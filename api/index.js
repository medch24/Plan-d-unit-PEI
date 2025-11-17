// Vercel Node Serverless API for Plan d'unité PEI
// Endpoints:
// - POST /api/generate-units
// - POST /api/save-units
// - GET  /api/units
// - POST /api/generate-eval (generate a Word .docx evaluation)

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient, ObjectId } from "mongodb";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";
import { DESCRIPTEURS_COMPLETS } from "./descripteurs-complets.js";

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

// Use complete official IB PEI descriptors from separate file
// All subjects, all years, all criteria (A, B, C, D) with complete level descriptors (0, 1-2, 3-4, 5-6, 7-8)
const DESCRIPTEURS = DESCRIPTEURS_COMPLETS;

function parseClasseToKey(classe, matiere) {
  // Accepts values like "PEI 1" or "pei1" or "PEI1"
  const normalized = (classe || "").toString().toLowerCase().replaceAll(" ", "");
  
  // Special handling for Arts and Acquisition de langues which use level-based structure
  if (matiere === "Arts") {
    // PEI 1-2 = débutant, PEI 3-4 = intermédiaire, PEI 5 = compétent
    if (normalized.includes("1") || normalized.includes("2")) return "débutant";
    if (normalized.includes("3") || normalized.includes("4")) return "intermédiaire";
    if (normalized.includes("5")) return "compétent";
  }
  
  if (matiere === "Acquisition de langues") {
    // Simplified mapping: PEI 1-2 = débutant, PEI 3-4 = compétent, PEI 5 = expérimenté
    if (normalized.includes("1") || normalized.includes("2")) return "débutant";
    if (normalized.includes("3") || normalized.includes("4")) return "compétent";
    if (normalized.includes("5")) return "expérimenté";
  }
  
  // For other subjects, use standard pei1, pei2, etc.
  if (normalized.startsWith("pei")) return normalized; // pei1, pei2...
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
  // Gemini 1.5 models are retired, use 2.x series only
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
    
    // Retry up to 3 times for each model (to handle temporary 503 errors)
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
        
        // Check if it's a temporary error (503 overload) or permanent error (404 not found)
        const isTemporaryError = errorMsg.includes('503') || errorMsg.includes('overloaded');
        const isPermanentError = errorMsg.includes('404') || errorMsg.includes('not found');
        
        if (isPermanentError) {
          console.warn(`[WARN] Model ${modelConfig.name} not available (404), trying next model...`);
          break; // Skip to next model immediately
        }
        
        if (isTemporaryError && attempt < 3) {
          // Wait before retrying (exponential backoff: 1s, 2s, 4s)
          const waitTime = Math.pow(2, attempt - 1) * 1000;
          console.log(`[INFO] Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Retry with same model
        }
        
        // If not temporary or last attempt, try next model
        break;
      }
    }
  }
  
  // If all models failed, throw the last error
  console.error('[ERROR] All models failed. Last error:', lastError?.message);
  throw new Error(`Erreur lors de la génération avec Gemini après avoir essayé tous les modèles: ${lastError?.message || 'Unknown error'}`);
}

function buildPlanDocx({ enseignant, matiere, classe, unite }) {
  const doc = new Document({ sections: [{ properties: {}, children: [] }] });
  const children = [];
  children.push(new Paragraph({ text: "Planification d'Unité PEI", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ text: `Enseignant: ${enseignant}` }));
  children.push(new Paragraph({ text: `Matière: ${matiere}` }));
  children.push(new Paragraph({ text: `Année PEI: ${classe}` }));
  children.push(new Paragraph({ text: `Titre de l'unité: ${unite.titre_unite}` }));
  children.push(new Paragraph({ text: `Durée (h): ${unite.duree || ""}` }));
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Recherche : définition de l'objectif de l'unité", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: `Concept clé: ${unite.concept_cle || ""}` }));
  children.push(new Paragraph({ text: `Concepts connexes: ${(unite.concepts_connexes || []).join(", ")}` }));
  children.push(new Paragraph({ text: `Contexte mondial: ${unite.contexte_mondial || ""}` }));
  children.push(new Paragraph({ text: `Énoncé de recherche: ${unite.enonce_recherche || ""}` }));
  children.push(new Paragraph({ text: "Questions factuelles:" }));
  (unite.questions_factuelles || []).forEach(q => children.push(new Paragraph({ text: `• ${q}` })));
  children.push(new Paragraph({ text: "Questions conceptuelles:" }));
  (unite.questions_conceptuelles || []).forEach(q => children.push(new Paragraph({ text: `• ${q}` })));
  children.push(new Paragraph({ text: "Questions invitant au débat:" }));
  (unite.questions_debat || []).forEach(q => children.push(new Paragraph({ text: `• ${q}` })));

  doc.addSection({ children });
  return Packer.toBuffer(doc);
}

function buildEvalDocx({ elevePlaceholders = true, matiere, classeKey, criteres = ["D"], uniteTitle = "", enonce = "" }) {
  // Compose a simple one-page evaluation sheet based on descriptors
  const children = [];
  children.push(new Paragraph({ text: `Évaluation critériée – ${matiere}`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
  if (uniteTitle) children.push(new Paragraph({ text: `Unité: ${uniteTitle}`, spacing: { after: 200 } }));
  if (enonce) children.push(new Paragraph({ text: `Énoncé de recherche: ${enonce}`, spacing: { after: 200 } }));

  criteres.forEach(c => {
    // Try to find descriptors
    let descBlock = null;
    const key = (matiere || "").toLowerCase();
    const pool = DESCRIPTEURS[key] || DESCRIPTEURS[matiere] || DESCRIPTEURS[key.replaceAll(" ", "_")] || null;
    const year = pool && (pool[classeKey] || pool[parseClasseToKey(classeKey, matiere)] || pool["débutant"] || pool["compétent"] || pool["expérimenté"]);
    if (year && year[c]) descBlock = year[c];

    children.push(new Paragraph({ text: `Critère ${c}${descBlock ? ` : ${descBlock.titre}` : ""}`, heading: HeadingLevel.HEADING_2 }));

    const rows = [];
    rows.push(new TableRow({ children: [
      new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Niveaux", bold: true })] }),
      new TableCell({ width: { size: 85, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Descripteurs" })] })
    ] }));

    const niveaux = descBlock ? descBlock.niveaux : {
      "1-2": "Descripteurs à compléter.",
      "3-4": "",
      "5-6": "",
      "7-8": ""
    };

    Object.entries(niveaux).forEach(([niv, txt]) => {
      rows.push(new TableRow({ children: [
        new TableCell({ children: [new Paragraph({ text: niv })] }),
        new TableCell({ children: [new Paragraph({ text: txt })] })
      ] }));
    });

    children.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));

    if (elevePlaceholders) {
      children.push(new Paragraph({ text: "\nTâches (réponse de l'élève):", heading: HeadingLevel.HEADING_3 }));
      children.push(new Paragraph({ text: "1. ............................................................." }));
      children.push(new Paragraph({ text: "2. ............................................................." }));
      children.push(new Paragraph({ text: "3. ............................................................." }));
      children.push(new Paragraph({ text: "Espace pour insérer une image/ressource: [collez ici]" }));
    }
  });

  // Create document with proper section configuration
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return Packer.toBuffer(doc);
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

// Utility function to create safe filenames (ASCII-only for HTTP headers)
function sanitizeFilename(str) {
  return str
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace non-ASCII with underscore
    .replace(/_+/g, '_'); // Remove consecutive underscores
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

    if (req.method === "GET" && pathname === "/api/units") {
      const matiere = url.searchParams.get("matiere");
      const classe = url.searchParams.get("classe");
      const enseignant = url.searchParams.get("enseignant");
      const essai = Number(url.searchParams.get("essai") || 1);
      const db = await getDb();
      const items = await db.collection("units").find({ matiere, classe, enseignant, essai }).sort({ createdAt: -1 }).toArray();
      return json(res, 200, { units: items });
    }

    if (req.method === "POST" && pathname === "/api/save-units") {
      const body = await readBody(req);
      const { enseignant, matiere, classe, units, essai = 1 } = body || {};
      if (!enseignant || !matiere || !classe || !Array.isArray(units)) return json(res, 400, { error: "Champs manquants" });
      const db = await getDb();
      const session = { enseignant, matiere, classe, essai, units, createdAt: new Date() };
      await db.collection("units").insertOne(session);
      return json(res, 200, { ok: true });
    }

    if (req.method === "POST" && pathname === "/api/generate-units") {
      const body = await readBody(req);
      const { enseignant, classe, matiere, chapitres = [], essai = 1 } = body || {};
      if (!enseignant || !classe || !matiere || chapitres.length === 0) return json(res, 400, { error: "Champs manquants" });

      const classeKey = parseClasseToKey(classe, matiere);
      const unites = await generateUnitsWithGemini({ chapitres, matiere, classe: classeKey });

      // Save session
      const db = await getDb();
      await db.collection("sessions").insertOne({ enseignant, matiere, classe: classeKey, essai, chapitres, unites, createdAt: new Date() });

      return json(res, 200, { unites, essai });
    }

    if (req.method === "POST" && pathname === "/api/generate-plan-docx") {
      const body = await readBody(req);
      const { enseignant, matiere, classe, unite } = body || {};
      const buffer = await buildPlanDocx({ enseignant, matiere, classe, unite });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      // Sanitize filename to remove accents and special characters (HTTP header requirement)
      const safeName = sanitizeFilename(matiere || 'Unite');
      const filename = `Plan_Unite_${safeName}_${Date.now()}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      // Packer.toBuffer() already returns a Buffer, don't wrap it again
      return res.end(buffer);
    }

    if (req.method === "POST" && pathname === "/api/generate-eval") {
      const body = await readBody(req);
      const { matiere, classe, unite, criteres = ["D"], telecharger = true } = body || {};
      const classeKey = parseClasseToKey(classe, matiere);
      const buffer = await buildEvalDocx({ matiere, classeKey, criteres, uniteTitle: unite?.titre_unite || "", enonce: unite?.enonce_recherche || "" });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      // Sanitize filename to remove accents and special characters (HTTP header requirement)
      const safeName = sanitizeFilename(matiere || 'Evaluation');
      const filename = `Evaluation_${safeName}_${Date.now()}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      // Packer.toBuffer() already returns a Buffer, don't wrap it again
      return res.end(buffer);
    }

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
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { resolve({}); }
    });
    req.on("error", reject);
  });
}
