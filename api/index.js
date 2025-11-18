// Vercel Node Serverless API for Plan d'unité PEI
// Endpoints:
// - POST /api/generate-units - Generate units with AI
// - POST /api/save-units - Save units to database
// - GET  /api/units - Get saved units from database
// - POST /api/generate-plan-docx - Generate Plan Word document
// - POST /api/generate-eval - Generate Evaluation Word document

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI || "";

// Utility: build a single Mongo client reused across invocations
let cachedDb = null;
async function getDb() {
    if (cachedDb) return cachedDb;
    
    if (!MONGO_URL) {
        console.warn('[WARN] MONGO_URL is not configured - database features will be disabled');
        throw new Error("MONGO_URL manquant dans les variables d'environnement");
    }
    
    try {
        console.log('[INFO] Connecting to MongoDB...');
        const client = new MongoClient(MONGO_URL, { 
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 10,
            minPoolSize: 1
        });
        await client.connect();
        cachedDb = client.db();
        console.log('[INFO] MongoDB connection established');
        return cachedDb;
    } catch (error) {
        console.error('[ERROR] MongoDB connection failed:', error.message);
        throw new Error(`Erreur de connexion à MongoDB: ${error.message}`);
    }
}

function parseClasseToKey(classe, matiere) {
    const normalized = (classe || "").toString().toLowerCase().replaceAll(" ", "");
    
    if (matiere === "Arts") {
        if (normalized.includes("1") || normalized.includes("2")) return "débutant";
        if (normalized.includes("3") || normalized.includes("4")) return "intermédiaire";
        if (normalized.includes("5")) return "compétent";
    }
    
    if (matiere === "Acquisition de langues") {
        if (normalized.includes("1") || normalized.includes("2")) return "débutant";
        if (normalized.includes("3") || normalized.includes("4")) return "compétent";
        if (normalized.includes("5")) return "expérimenté";
    }
    
    if (normalized.startsWith("pei")) return normalized;
    return `pei${normalized}`;
}

async function generateUnitsWithGemini({ chapitres, matiere, classe }) {
    if (!GEMINI_API_KEY) {
        console.error('[ERROR] GEMINI_API_KEY is missing');
        throw new Error("GEMINI_API_KEY manquant dans Vercel env");
    }
    
    console.log('[INFO] Initializing Gemini AI');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // List of models to try in order (fallback strategy)
    const MODELS_TO_TRY = [
        { name: "gemini-2.5-flash", description: "Gemini 2.5 Flash (primary)" },
        { name: "gemini-2.0-flash", description: "Gemini 2.0 Flash (fallback 1)" },
        { name: "gemini-2.5-flash-lite", description: "Gemini 2.5 Flash Lite (fallback 2)" },
        { name: "gemini-2.0-flash-lite", description: "Gemini 2.0 Flash Lite (fallback 3)" }
    ];
    
    const nbUnites = matiere === "Langue et littérature" ? 6 : 4;
    console.log(`[INFO] Generating ${nbUnites} units for ${matiere} - ${classe}`);
    
    const prompt = `Tu es un expert PEI IB. Génère EXACTEMENT ${nbUnites} unités en regroupant ces chapitres en thèmes cohérents. Donne pour chaque unité: titre_unite, chapitres_inclus (index), duree totale estimée (en heures, somme "poids" approx 4h/chapitre si absent), concept_cle, 2-3 concepts_connexes, contexte_mondial, enonce_recherche, 2-3 questions_factuelles, 2-3 questions_conceptuelles, 2-3 questions_debat, objectifs_specifiques (liste d'IDs tels que A.i, B.ii...). Réponds EN JSON strict: {"unites":[{...}]}. Matière: ${matiere}. Année: ${classe}. Chapitres: ${JSON.stringify(chapitres)}.`;

    let lastError = null;
    
    // Try each model with retry logic
    for (const modelConfig of MODELS_TO_TRY) {
        console.log(`[INFO] Attempting with model: ${modelConfig.description}`);
        const model = genAI.getGenerativeModel({ model: modelConfig.name });
        
        // Retry up to 3 times for each model
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`[INFO] Attempt ${attempt}/3 with ${modelConfig.name}`);
                const res = await model.generateContent(prompt);
                let text = res.response.text();
                console.log('[INFO] Gemini response received, length:', text.length);
                
                // Clean code-fences if any
                if (text.includes("```")) {
                    const m = text.match(/```(?:json)?\n([\s\S]*?)```/);
                    if (m) text = m[1];
                }
                
                const json = JSON.parse(text);
                console.log(`[SUCCESS] Generated units successfully with ${modelConfig.name}`);
                return json.unites || [];
            } catch (error) {
                lastError = error;
                const errorMsg = error.message || String(error);
                console.error(`[ERROR] Attempt ${attempt}/3 failed with ${modelConfig.name}:`, errorMsg);
                
                const isTemporaryError = errorMsg.includes('503') || errorMsg.includes('overloaded');
                const isPermanentError = errorMsg.includes('404') || errorMsg.includes('not found');
                
                if (isPermanentError) {
                    console.warn(`[WARN] Model ${modelConfig.name} not available (404), trying next model...`);
                    break;
                }
                
                if (isTemporaryError && attempt < 3) {
                    const waitTime = Math.pow(2, attempt - 1) * 1000;
                    console.log(`[INFO] Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                
                break;
            }
        }
    }
    
    console.error('[ERROR] All models failed. Last error:', lastError?.message);
    throw new Error(`Erreur lors de la génération avec Gemini après avoir essayé tous les modèles: ${lastError?.message || 'Unknown error'}`);
}

function json(res, status, payload) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        return res.end();
    }
    
    try {
        const url = new URL(req.url, "http://localhost");
        const pathname = url.pathname;

        // GET /api/units - Get saved units from database
        if (req.method === "GET" && pathname === "/api/units") {
            const matiere = url.searchParams.get("matiere");
            const classe = url.searchParams.get("classe");
            const enseignant = url.searchParams.get("enseignant");
            const essai = Number(url.searchParams.get("essai") || 1);
            const db = await getDb();
            const items = await db.collection("units").find({ matiere, classe, enseignant, essai }).sort({ createdAt: -1 }).toArray();
            return json(res, 200, { units: items });
        }

        // POST /api/save-units - Save units to database
        if (req.method === "POST" && pathname === "/api/save-units") {
            const body = await readBody(req);
            const { enseignant, matiere, classe, units, essai = 1 } = body || {};
            if (!enseignant || !matiere || !classe || !Array.isArray(units)) {
                return json(res, 400, { error: "Champs manquants" });
            }
            const db = await getDb();
            const session = { enseignant, matiere, classe, essai, units, createdAt: new Date() };
            await db.collection("units").insertOne(session);
            return json(res, 200, { ok: true });
        }

        // POST /api/generate-units - Generate units with AI
        if (req.method === "POST" && pathname === "/api/generate-units") {
            const body = await readBody(req);
            const { enseignant, classe, matiere, chapitres = [], essai = 1 } = body || {};
            if (!enseignant || !classe || !matiere || chapitres.length === 0) {
                return json(res, 400, { error: "Champs manquants" });
            }

            const classeKey = parseClasseToKey(classe, matiere);
            const unites = await generateUnitsWithGemini({ chapitres, matiere, classe: classeKey });

            // Save session
            const db = await getDb();
            await db.collection("sessions").insertOne({ 
                enseignant, 
                matiere, 
                classe: classeKey, 
                essai, 
                chapitres, 
                unites, 
                createdAt: new Date() 
            });

            return json(res, 200, { unites, essai });
        }

        // Route /api/generate-plan-docx - Handled by separate file
        // Route /api/generate-eval - Handled by separate file
        // These are handled by Vercel routing in vercel.json

        // Fallback
        console.log(`[404] Route not found: ${pathname}`);
        return json(res, 404, { error: "Route inconnue", pathname });
    } catch (e) {
        console.error('[ERROR] Handler exception:', e);
        console.error('[ERROR] Stack:', e.stack);
        return json(res, 500, { 
            error: e.message || String(e),
            type: e.constructor.name,
            stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
        });
    }
}

async function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => {
            try { 
                resolve(data ? JSON.parse(data) : {}); 
            } catch (e) { 
                resolve({}); 
            }
        });
        req.on("error", reject);
    });
}
