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
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI || "";
const PLAN_TEMPLATE_URL = process.env.PLAN_TEMPLATE_URL || "";
const EVAL_TEMPLATE_URL = process.env.EVAL_TEMPLATE_URL || "";

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

/**
 * Generate exercises for evaluation based on specific criteria
 * @param {string} matiere - Subject name
 * @param {string} classe - Class level (e.g., "PEI 1")
 * @param {string} uniteTitle - Unit title
 * @param {string} enonce - Research statement
 * @param {Array<string>} criteres - Assessment criteria (e.g., ["A", "B", "C"])
 * @param {object} descripteurs - Descriptors for the criteria
 * @returns {Promise<object>} - Generated exercises organized by criteria
 */
/**
 * Extract sub-criteria from descriptors (i, ii, iii, iv)
 */
function extractSubCriteria(descriptorText) {
  if (!descriptorText || typeof descriptorText !== 'string') return {};
  
  const subCriteria = {};
  const matches = descriptorText.matchAll(/([ivx]+)\.\s*([^;]+)/gi);
  
  for (const match of matches) {
    const [, roman, text] = match;
    subCriteria[roman.toLowerCase()] = text.trim();
  }
  
  return subCriteria;
}

/**
 * Get all sub-criteria for a criterion across all levels
 */
function getAllSubCriteria(criterionData) {
  if (!criterionData || !criterionData.niveaux) return {};
  
  const allSubs = {};
  for (const [level, text] of Object.entries(criterionData.niveaux)) {
    if (level === '0') continue;
    const subs = extractSubCriteria(text);
    Object.assign(allSubs, subs); // Keep most detailed version
  }
  
  return allSubs;
}

async function generateExercicesWithGemini({ matiere, classe, uniteTitle, enonce, criteres, descripteurs }) {
  if (!GEMINI_API_KEY) {
    console.error('[ERROR] GEMINI_API_KEY is missing for exercise generation');
    return { exercices: {}, subCriteria: {} };
  }
  
  console.log('[INFO] 🎯 Generating exercises with Gemini for criteria:', criteres.join(', '));
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  const MODELS_TO_TRY = [
    { name: "gemini-2.5-flash", description: "Gemini 2.5 Flash (primary)" },
    { name: "gemini-2.0-flash", description: "Gemini 2.0 Flash (fallback 1)" }
  ];
  
  // Extract sub-criteria for each criterion
  const allSubCriteria = {};
  let descriptorInfo = '';
  
  criteres.forEach(c => {
    const desc = descripteurs[c];
    if (desc) {
      // Extract sub-criteria
      const subs = getAllSubCriteria(desc);
      allSubCriteria[c] = subs;
      
      descriptorInfo += `\nCritère ${c} (${desc.titre}):\n`;
      descriptorInfo += `Sous-critères:\n`;
      Object.entries(subs).forEach(([roman, text]) => {
        descriptorInfo += `  ${roman}. ${text}\n`;
      });
      descriptorInfo += `\nNiveaux de maîtrise:\n`;
      Object.entries(desc.niveaux || {}).forEach(([niveau, texte]) => {
        if (niveau !== '0') {
          descriptorInfo += `  Niveau ${niveau}: ${texte.substring(0, 100)}...\n`;
        }
      });
    }
  });
  
  const prompt = `Tu es un expert en évaluation PEI IB. Génère des exercices pratiques pour évaluer les élèves.

Matière: ${matiere}
Niveau: ${classe}
Unité: ${uniteTitle}
Énoncé de recherche: ${enonce}

Critères d'évaluation avec sous-critères:
${descriptorInfo}

IMPORTANT: Pour CHAQUE sous-critère (i, ii, iii, iv) de CHAQUE critère, génère UN exercice spécifique qui évalue cette compétence particulière.

Par exemple, pour le Critère A avec sous-critères i, ii, iii, iv, tu dois générer:
- Un exercice qui évalue spécifiquement le sous-critère i
- Un exercice qui évalue spécifiquement le sous-critère ii
- Un exercice qui évalue spécifiquement le sous-critère iii
- Un exercice qui évalue spécifiquement le sous-critère iv

Les exercices doivent:
- Être concrets et réalisables en classe
- Correspondre au niveau ${classe}
- Cibler précisément la compétence du sous-critère
- Permettre d'évaluer les différents niveaux de maîtrise (1-2, 3-4, 5-6, 7-8)
- Être clairs et sans ambiguïté

Réponds en JSON strict avec cette structure:
{
  "exercices": {
    "A": {
      "i": "Exercice pour évaluer le sous-critère A.i",
      "ii": "Exercice pour évaluer le sous-critère A.ii",
      "iii": "Exercice pour évaluer le sous-critère A.iii",
      "iv": "Exercice pour évaluer le sous-critère A.iv"
    },
    "B": {
      "i": "Exercice pour évaluer le sous-critère B.i",
      ...
    },
    ...
  }
}`;

  let lastError = null;
  
  for (const modelConfig of MODELS_TO_TRY) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[INFO] Trying ${modelConfig.name} (attempt ${attempt}/2)...`);
        const model = genAI.getGenerativeModel({ model: modelConfig.name });
        const res = await model.generateContent(prompt);
        let text = res.response.text();
        
        if (text.includes("```")) {
          const m = text.match(/```(?:json)?\n([\s\S]*?)```/);
          if (m) text = m[1];
        }
        
        const json = JSON.parse(text);
        console.log(`[SUCCESS] ✅ Generated exercises with ${modelConfig.name}`);
        console.log(`[INFO] Generated ${Object.keys(json.exercices || {}).length} criterion groups`);
        
        return {
          exercices: json.exercices || {},
          subCriteria: allSubCriteria
        };
      } catch (error) {
        lastError = error;
        console.error(`[ERROR] ❌ Exercise generation attempt ${attempt} failed:`, error.message);
        
        if (attempt < 2 && (error.message.includes('503') || error.message.includes('overloaded'))) {
          console.log(`[INFO] ⏳ Retrying after delay...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        break;
      }
    }
  }
  
  console.warn('[WARN] ⚠️  Exercise generation failed, using default placeholders');
  
  // Return default structure with sub-criteria if generation fails
  const defaultExercices = {};
  criteres.forEach(c => {
    const subs = allSubCriteria[c] || {};
    defaultExercices[c] = {};
    
    if (Object.keys(subs).length > 0) {
      Object.keys(subs).forEach((roman, idx) => {
        defaultExercices[c][roman] = `Exercice ${c}.${roman} : Évaluer la compétence "${subs[roman].substring(0, 50)}..." (à compléter par l'enseignant)`;
      });
    } else {
      // Fallback if no sub-criteria found
      defaultExercices[c] = {
        i: `Exercice ${c}.i (à compléter)`,
        ii: `Exercice ${c}.ii (à compléter)`,
        iii: `Exercice ${c}.iii (à compléter)`
      };
    }
  });
  
  return {
    exercices: defaultExercices,
    subCriteria: allSubCriteria
  };
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
  
  // Add objectives
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Objectifs spécifiques", heading: HeadingLevel.HEADING_2 }));
  (unite.objectifs_specifiques || []).forEach(obj => children.push(new Paragraph({ text: `• ${obj}` })));
  
  // Add evaluation sommative section
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Évaluation sommative", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.evaluation_sommative || "Évaluation à définir selon les critères d'évaluation de la matière." }));
  
  // Add approches de l'apprentissage
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Approches de l'apprentissage", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.approches_apprentissage || "Compétences développées : pensée critique, communication, autogestion, recherche, compétences sociales." }));
  
  // Add content and learning process
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Contenu et processus d'apprentissage", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.contenu || unite.processus_apprentissage || "Contenu à développer en fonction des chapitres et des objectifs spécifiques." }));
  
  // Add ressources
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Ressources", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.ressources || "Manuels scolaires, ressources numériques, matériel de laboratoire (si applicable)." }));
  
  // Add differentiation
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Différenciation", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.differenciation || "Adaptation selon les besoins : soutien supplémentaire, extensions pour élèves avancés, supports visuels/audio." }));
  
  // Add formative evaluation
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Évaluation formative", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: unite.evaluation_formative || "Observations continues, questionnements, quizz formatifs, rétroaction régulière." }));
  
  // Add reflections
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Réflexion", heading: HeadingLevel.HEADING_2 }));
  children.push(new Paragraph({ text: "Avant l'enseignement:", heading: HeadingLevel.HEADING_3 }));
  children.push(new Paragraph({ text: unite.reflexion_avant || "Préparation des ressources, planification des activités, anticipation des difficultés." }));
  children.push(new Paragraph({ text: "Pendant l'enseignement:", heading: HeadingLevel.HEADING_3 }));
  children.push(new Paragraph({ text: unite.reflexion_pendant || "Ajustements selon la progression, gestion du temps, adaptation aux besoins." }));
  children.push(new Paragraph({ text: "Après l'enseignement:", heading: HeadingLevel.HEADING_3 }));
  children.push(new Paragraph({ text: unite.reflexion_apres || "Analyse des résultats, points à améliorer, ajustements pour les prochaines unités." }));

  doc.addSection({ children });
  return Packer.toBuffer(doc);
}

async function buildEvalDocx({ 
  elevePlaceholders = true, 
  matiere, 
  classeKey, 
  criteres = ["D"], 
  uniteTitle = "", 
  enonce = "",
  objectifs_specifiques = [],
  unite = null // Full unite object for exercise generation
}) {
  // Compose a comprehensive evaluation document with AI-generated exercises
  const children = [];
  
  // Header section
  children.push(new Paragraph({ text: `Évaluation critériée – ${matiere}`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
  if (uniteTitle) children.push(new Paragraph({ text: `Unité: ${uniteTitle}`, spacing: { after: 200 } }));
  if (enonce) children.push(new Paragraph({ text: `Énoncé de recherche: ${enonce}`, spacing: { after: 200 } }));
  
  // Add objectifs spécifiques section
  if (objectifs_specifiques && objectifs_specifiques.length > 0) {
    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({ text: "Objectifs spécifiques évalués", heading: HeadingLevel.HEADING_2 }));
    objectifs_specifiques.forEach(obj => {
      children.push(new Paragraph({ text: `• ${obj}`, spacing: { after: 100 } }));
    });
  }

  // Generate exercises with Gemini AI if unite data is available
  let exercicesData = null;
  if (unite && matiere && classeKey) {
    try {
      console.log(`🎯 Generating exercises for ${matiere} - ${classeKey} with criteria: ${criteres.join(', ')}`);
      
      // Prepare descriptors for each criterion
      const descripteurs = {};
      criteres.forEach(c => {
        const key = (matiere || "").toLowerCase();
        const pool = DESCRIPTEURS[key] || DESCRIPTEURS[matiere] || DESCRIPTEURS[key.replaceAll(" ", "_")] || null;
        const year = pool && (pool[classeKey] || pool[parseClasseToKey(classeKey, matiere)] || pool["débutant"] || pool["compétent"] || pool["expérimenté"]);
        if (year && year[c]) {
          descripteurs[c] = year[c];
        }
      });
      
      exercicesData = await generateExercicesWithGemini({
        matiere,
        classe: classeKey,
        uniteTitle: uniteTitle || unite.titre,
        enonce: enonce || unite.enonce_recherche,
        criteres,
        descripteurs
      });
      
      console.log(`✅ Successfully generated ${Object.keys(exercicesData.exercices || {}).length} criterion groups`);
    } catch (error) {
      console.error('⚠️  Failed to generate exercises, continuing without them:', error.message);
    }
  }

  // Add exercises section if available
  if (exercicesData && exercicesData.exercices) {
    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({ text: "Exercices d'évaluation", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }));
    children.push(new Paragraph({ 
      text: "Les exercices suivants évaluent les objectifs spécifiques selon les critères d'évaluation du PEI.", 
      spacing: { after: 300 } 
    }));
    
    // Add exercises for each criterion
    Object.entries(exercicesData.exercices).forEach(([critere, exercises]) => {
      // Find descriptor for this criterion
      const key = (matiere || "").toLowerCase();
      const pool = DESCRIPTEURS[key] || DESCRIPTEURS[matiere] || DESCRIPTEURS[key.replaceAll(" ", "_")] || null;
      const year = pool && (pool[classeKey] || pool[parseClasseToKey(classeKey, matiere)] || pool["débutant"] || pool["compétent"] || pool["expérimenté"]);
      const descBlock = year && year[critere];
      
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ 
        text: `Critère ${critere}${descBlock ? ` : ${descBlock.titre}` : ""}`, 
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 }
      }));
      
      // Add each exercise for this criterion
      exercises.forEach((exercice, idx) => {
        children.push(new Paragraph({ 
          text: `Exercice ${critere}.${idx + 1}`, 
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }));
        children.push(new Paragraph({ text: exercice, spacing: { after: 200 } }));
      });
    });
  }

  // Add descriptors and grading rubrics section
  children.push(new Paragraph({ text: "" }));
  children.push(new Paragraph({ text: "Grille d'évaluation", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }));

  criteres.forEach(c => {
    // Try to find descriptors
    let descBlock = null;
    const key = (matiere || "").toLowerCase();
    const pool = DESCRIPTEURS[key] || DESCRIPTEURS[matiere] || DESCRIPTEURS[key.replaceAll(" ", "_")] || null;
    const year = pool && (pool[classeKey] || pool[parseClasseToKey(classeKey, matiere)] || pool["débutant"] || pool["compétent"] || pool["expérimenté"]);
    if (year && year[c]) descBlock = year[c];

    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({ text: `Critère ${c}${descBlock ? ` : ${descBlock.titre}` : ""}`, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }));

    const rows = [];
    rows.push(new TableRow({ children: [
      new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Niveaux", bold: true })] }),
      new TableCell({ width: { size: 85, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Descripteurs", bold: true })] })
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
        new TableCell({ children: [new Paragraph({ text: txt || "(Descripteur non disponible)" })] })
      ] }));
    });

    children.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));

    if (elevePlaceholders) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "Espace de travail pour l'élève:", heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }));
      children.push(new Paragraph({ text: "1. ............................................................." }));
      children.push(new Paragraph({ text: "2. ............................................................." }));
      children.push(new Paragraph({ text: "3. ............................................................." }));
      children.push(new Paragraph({ text: "Espace pour insérer une image/ressource: [collez ici]", spacing: { after: 300 } }));
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
      
      try {
        // Download template from configured URL
        const templateUrl = PLAN_TEMPLATE_URL || path.join(__dirname, '../templates/Plan_CLEAN_TEMPLATE.docx');
        
        let templateBuffer;
        if (templateUrl.startsWith('http://') || templateUrl.startsWith('https://')) {
          const response = await fetch(templateUrl);
          if (!response.ok) throw new Error(`Failed to fetch template: ${response.statusText}`);
          templateBuffer = Buffer.from(await response.arrayBuffer());
        } else {
          templateBuffer = fs.readFileSync(templateUrl);
        }
        
        // Fill template with docxtemplater
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part) => {
            console.warn(`⚠️  Missing placeholder in Plan: ${part.value}`);
            return '';
          }
        });
        
        // Prepare data matching template placeholders
        const templateData = {
          enseignant: enseignant || '',
          titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
          groupe_matiere: matiere || '',
          annee_pei: classe || '',
          duree: unite?.duree || '',
          concept_cle: unite?.conceptCle || unite?.concept_cle || '',
          concepts_connexes: Array.isArray(unite?.conceptsConnexes || unite?.concepts_connexes) 
            ? (unite?.conceptsConnexes || unite?.concepts_connexes).join(', ') 
            : (unite?.conceptsConnexes || unite?.concepts_connexes || ''),
          contexte_mondial: unite?.contexteMondial || unite?.contexte_mondial || '',
          enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
          questions_factuelles: Array.isArray(unite?.questions?.factuelles || unite?.questions_factuelles)
            ? (unite?.questions?.factuelles || unite?.questions_factuelles).map(q => `• ${q}`).join('\n')
            : '',
          questions_conceptuelles: Array.isArray(unite?.questions?.conceptuelles || unite?.questions_conceptuelles)
            ? (unite?.questions?.conceptuelles || unite?.questions_conceptuelles).map(q => `• ${q}`).join('\n')
            : '',
          questions_debat: Array.isArray(unite?.questions?.debat || unite?.questions_debat)
            ? (unite?.questions?.debat || unite?.questions_debat).map(q => `• ${q}`).join('\n')
            : '',
          objectifs_specifiques: Array.isArray(unite?.objectifsSpecifiques || unite?.objectifs_specifiques)
            ? (unite?.objectifsSpecifiques || unite?.objectifs_specifiques).map(o => `• ${o}`).join('\n')
            : '',
          evaluation_sommative: unite?.evaluation_sommative || 'Évaluation à définir selon les critères d\'évaluation de la matière.',
          approches_apprentissage: unite?.approches_apprentissage || 'Compétences développées : pensée critique, communication, autogestion, recherche, compétences sociales.',
          contenu: unite?.contenu || unite?.processus_apprentissage || 'Contenu à développer en fonction des chapitres et des objectifs spécifiques.',
          ressources: unite?.ressources || 'Manuels scolaires, ressources numériques, matériel de laboratoire (si applicable).',
          differenciation: unite?.differenciation || 'Adaptation selon les besoins : soutien supplémentaire, extensions pour élèves avancés, supports visuels/audio.',
          evaluation_formative: unite?.evaluation_formative || 'Observations continues, questionnements, quizz formatifs, rétroaction régulière.',
          reflexion_avant: unite?.reflexion_avant || 'Préparation des ressources, planification des activités, anticipation des difficultés.',
          reflexion_pendant: unite?.reflexion_pendant || 'Ajustements selon la progression, gestion du temps, adaptation aux besoins.',
          reflexion_apres: unite?.reflexion_apres || 'Analyse des résultats, points à améliorer, ajustements pour les prochaines unités.'
        };
        
        doc.setData(templateData);
        doc.render();
        
        const buffer = doc.getZip().generate({ 
          type: 'nodebuffer',
          compression: 'DEFLATE'
        });
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const safeName = sanitizeFilename(matiere || 'Unite');
        const filename = `Plan_Unite_${safeName}_${Date.now()}.docx`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.end(buffer);
        
      } catch (error) {
        console.error('[ERROR] Plan template generation failed:', error);
        return json(res, 500, { error: 'Plan generation failed: ' + error.message });
      }
    }

    if (req.method === "POST" && pathname === "/api/generate-eval") {
      const body = await readBody(req);
      const { matiere, classe, unite, criteres = ["D"], telecharger = true } = body || {};
      const classeKey = parseClasseToKey(classe, matiere);
      
      try {
        // Use first criterion if multiple provided
        const critere = Array.isArray(criteres) ? criteres[0] : criteres;
        
        // Get criterion data
        const matiereKey = (matiere || "").toLowerCase().replace(/\s+/g, '_');
        const pool = DESCRIPTEURS_COMPLETS[matiereKey];
        
        if (!pool) {
          return json(res, 400, { error: `Matière non trouvée: ${matiere}` });
        }
        
        // Determine PEI level
        let peiLevel = 'pei1';
        if (classeKey.includes('1') || classeKey.includes('2')) peiLevel = 'pei1';
        else if (classeKey.includes('3') || classeKey.includes('4')) peiLevel = 'pei3';
        else if (classeKey.includes('5')) peiLevel = 'pei5';
        
        let yearData = pool[peiLevel];
        if (typeof yearData === 'string' && yearData.startsWith('same_as_')) {
          const refLevel = yearData.split('_')[2];
          yearData = pool[refLevel];
        }
        
        const criterionData = yearData?.[critere];
        if (!criterionData) {
          return json(res, 400, { error: `Critère ${critere} non trouvé pour ${matiere} ${classeKey}` });
        }
        
        // Extract sub-criteria
        const subCriteria = getAllSubCriteria(criterionData);
        
        // Generate exercises for each sub-criterion
        console.log(`[INFO] 🎯 Generating exercises for criterion ${critere}`);
        
        const exerciseResult = await generateExercicesWithGemini({
          matiere,
          classe: classeKey,
          uniteTitle: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
          enonce: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
          criteres: [critere],
          descripteurs: { [critere]: criterionData }
        });
        
        const exercicesGenerated = exerciseResult.exercices[critere] || {};
        
        // Format exercises with sub-criteria
        let exercisesText = '';
        Object.entries(subCriteria).forEach(([roman, description]) => {
          exercisesText += `\n${critere}.${roman}) ${description}\n`;
          const exercise = exercicesGenerated[roman];
          if (exercise) {
            exercisesText += `Exercice: ${exercise}\n`;
          } else {
            exercisesText += `Exercice: [À compléter par l'enseignant]\n`;
          }
        });
        
        // Format objectifs_specifiques with full sub-criteria
        let objectifs_specifiques_text = 'Sous-critères évalués:\n';
        Object.entries(subCriteria).forEach(([roman, description]) => {
          objectifs_specifiques_text += `${roman}. ${description}\n`;
        });
        
        // Download template
        const templateUrl = EVAL_TEMPLATE_URL || path.join(__dirname, '../templates/Eval_CLEAN_TEMPLATE.docx');
        
        let templateBuffer;
        if (templateUrl.startsWith('http://') || templateUrl.startsWith('https://')) {
          const response = await fetch(templateUrl);
          if (!response.ok) throw new Error(`Failed to fetch template: ${response.statusText}`);
          templateBuffer = Buffer.from(await response.arrayBuffer());
        } else {
          templateBuffer = fs.readFileSync(templateUrl);
        }
        
        // Fill template with docxtemplater
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part) => {
            console.warn(`⚠️  Missing placeholder in Eval: ${part.value}`);
            return '';
          }
        });
        
        // Prepare data
        const templateData = {
          annee_pei: classe || '',
          groupe_matiere: matiere || '',
          titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
          objectifs_specifiques: objectifs_specifiques_text,
          enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
          lettre_critere: critere,
          nom_objectif_specifique: criterionData.titre,
          exercices: exercisesText,
          descripteur_1_2: criterionData.niveaux['1-2'] || '',
          descripteur_3_4: criterionData.niveaux['3-4'] || '',
          descripteur_5_6: criterionData.niveaux['5-6'] || '',
          descripteur_7_8: criterionData.niveaux['7-8'] || ''
        };
        
        doc.setData(templateData);
        doc.render();
        
        const buffer = doc.getZip().generate({ 
          type: 'nodebuffer',
          compression: 'DEFLATE'
        });
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const safeName = sanitizeFilename(matiere || 'Evaluation');
        const filename = `Evaluation_${safeName}_Critere_${critere}_${Date.now()}.docx`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.end(buffer);
        
      } catch (error) {
        console.error('[ERROR] Eval template generation failed:', error);
        return json(res, 500, { error: 'Eval generation failed: ' + error.message });
      }
    }

    // NEW: Generate Plan using template
    if (req.method === "POST" && pathname === "/api/generate-plan-template") {
      const body = await readBody(req);
      const { enseignant, matiere, classe, unite } = body || {};
      
      try {
        // Download template
        const PLAN_TEMPLATE_URL = "https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx";
        const response = await fetch(PLAN_TEMPLATE_URL);
        const templateBuffer = Buffer.from(await response.arrayBuffer());
        
        // Fill template with docxtemplater
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part) => `[${part.value}]`
        });
        
        // Prepare data
        const templateData = {
          enseignant: enseignant || 'Nom de l\'enseignant',
          groupe_matiere: matiere || '',
          titre_unite: unite?.titre || unite?.titre_unite || '',
          annee_pei: classe || '',
          duree: unite?.duree || '',
          concept_cle: unite?.concept_cle || '',
          concepts_connexes: Array.isArray(unite?.concepts_connexes) ? unite.concepts_connexes.join(', ') : (unite?.concepts_connexes || ''),
          contexte_mondial: unite?.contexte_mondial || '',
          enonce_de_recherche: unite?.enonce_recherche || '',
          questions_factuelles: Array.isArray(unite?.questions_factuelles) ? unite.questions_factuelles.join('\n') : (unite?.questions_factuelles || ''),
          questions_conceptuelles: Array.isArray(unite?.questions_conceptuelles) ? unite.questions_conceptuelles.join('\n') : (unite?.questions_conceptuelles || ''),
          questions_debat: Array.isArray(unite?.questions_debat) ? unite.questions_debat.join('\n') : (unite?.questions_debat || ''),
          objectifs_specifiques: Array.isArray(unite?.objectifs_specifiques) ? unite.objectifs_specifiques.join('\n') : (unite?.objectifs_specifiques || ''),
          evaluation_sommative: unite?.evaluation_sommative || 'Évaluation à définir selon les critères d\'évaluation de la matière.',
          approches_apprentissage: unite?.approches_apprentissage || 'Compétences développées : pensée critique, communication, autogestion, recherche, compétences sociales.',
          contenu: unite?.contenu || unite?.processus_apprentissage || 'Contenu à développer en fonction des chapitres et des objectifs spécifiques.',
          processus_apprentissage: unite?.processus_apprentissage || unite?.contenu || '',
          ressources: unite?.ressources || 'Manuels scolaires, ressources numériques, matériel de laboratoire (si applicable).',
          differenciation: unite?.differenciation || 'Adaptation selon les besoins : soutien supplémentaire, extensions pour élèves avancés, supports visuels/audio.',
          evaluation_formative: unite?.evaluation_formative || 'Observations continues, questionnements, quizz formatifs, rétroaction régulière.',
          reflexion_avant: unite?.reflexion_avant || 'Préparation des ressources, planification des activités, anticipation des difficultés.',
          reflexion_pendant: unite?.reflexion_pendant || 'Ajustements selon la progression, gestion du temps, adaptation aux besoins.',
          reflexion_apres: unite?.reflexion_apres || 'Analyse des résultats, points à améliorer, ajustements pour les prochaines unités.'
        };
        
        doc.setData(templateData);
        doc.render();
        
        const buffer = doc.getZip().generate({ 
          type: 'nodebuffer',
          compression: 'DEFLATE'
        });
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const safeName = sanitizeFilename(matiere || 'Unite');
        const filename = `Plan_Unite_${safeName}_${Date.now()}.docx`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.end(buffer);
      } catch (error) {
        console.error('[ERROR] Template generation failed:', error);
        return json(res, 500, { error: 'Template generation failed: ' + error.message });
      }
    }

    // NEW: Generate Eval using template with AI exercises
    if (req.method === "POST" && pathname === "/api/generate-eval-template") {
      const body = await readBody(req);
      const { matiere, classe, unite, critere = "A" } = body || {};
      
      try {
        const classeKey = parseClasseToKey(classe, matiere);
        
        // Get criterion data
        const matiereKey = (matiere || "").toLowerCase().replace(/\s+/g, '_');
        const pool = DESCRIPTEURS_COMPLETS[matiereKey];
        
        if (!pool) {
          return json(res, 400, { error: `Matière non trouvée: ${matiere}` });
        }
        
        // Determine PEI level
        let peiLevel = 'pei1';
        if (classeKey.includes('1') || classeKey.includes('2')) peiLevel = 'pei1';
        else if (classeKey.includes('3') || classeKey.includes('4')) peiLevel = 'pei3';
        else if (classeKey.includes('5')) peiLevel = 'pei5';
        
        let yearData = pool[peiLevel];
        if (typeof yearData === 'string' && yearData.startsWith('same_as_')) {
          const refLevel = yearData.split('_')[2];
          yearData = pool[refLevel];
        }
        
        const criterionData = yearData?.[critere];
        if (!criterionData) {
          return json(res, 400, { error: `Critère ${critere} non trouvé pour ${matiere} ${classeKey}` });
        }
        
        // Extract sub-criteria
        const subCriteria = getAllSubCriteria(criterionData);
        
        // Generate exercises for each sub-criterion
        console.log(`[INFO] 🎯 Generating exercises for criterion ${critere} with sub-criteria: ${Object.keys(subCriteria).join(', ')}`);
        
        const exerciseResult = await generateExercicesWithGemini({
          matiere,
          classe: classeKey,
          uniteTitle: unite?.titre || unite?.titre_unite || '',
          enonce: unite?.enonce_recherche || '',
          criteres: [critere],
          descripteurs: { [critere]: criterionData }
        });
        
        const exercicesGenerated = exerciseResult.exercices[critere] || {};
        
        // Format exercises with sub-criteria
        let exercisesText = `Exercices d'évaluation pour le Critère ${critere}\n\n`;
        Object.entries(subCriteria).forEach(([roman, description]) => {
          exercisesText += `${critere}.${roman}) ${description}\n`;
          const exercise = exercicesGenerated[roman];
          if (exercise) {
            exercisesText += `Exercice: ${exercise}\n\n`;
          } else {
            exercisesText += `Exercice: [À compléter]\n\n`;
          }
        });
        
        // Format objectifs_specifiques with full sub-criteria
        let objectifs_specifiques_text = `Critère ${critere} : ${criterionData.titre}\n\n`;
        objectifs_specifiques_text += 'Sous-critères évalués:\n';
        Object.entries(subCriteria).forEach(([roman, description]) => {
          objectifs_specifiques_text += `${roman}. ${description}\n`;
        });
        
        // Download template
        const EVAL_TEMPLATE_URL = "https://docs.google.com/document/d/1R4wsPh9ClGrUJR46mISScRZk7DBVHBaC/export?format=docx";
        const response = await fetch(EVAL_TEMPLATE_URL);
        const templateBuffer = Buffer.from(await response.arrayBuffer());
        
        // Fill template with docxtemplater
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: (part) => `[${part.value}]`
        });
        
        // Prepare data
        const templateData = {
          annee_pei: classe || '',
          groupe_matiere: matiere || '',
          titre_unite: unite?.titre || unite?.titre_unite || '',
          objectifs_specifiques: objectifs_specifiques_text,
          enonce_de_recherche: unite?.enonce_recherche || '',
          lettre_critere: critere,
          nom_objectif_specifique: criterionData.titre,
          Exercices: exercisesText,
          descripteur_1_2: criterionData.niveaux['1-2'] || '',
          descripteur_3_4: criterionData.niveaux['3-4'] || '',
          descripteur_5_6: criterionData.niveaux['5-6'] || '',
          descripteur_7_8: criterionData.niveaux['7-8'] || ''
        };
        
        doc.setData(templateData);
        doc.render();
        
        const buffer = doc.getZip().generate({ 
          type: 'nodebuffer',
          compression: 'DEFLATE'
        });
        
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        const safeName = sanitizeFilename(matiere || 'Evaluation');
        const filename = `Evaluation_${safeName}_Critere_${critere}_${Date.now()}.docx`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.end(buffer);
      } catch (error) {
        console.error('[ERROR] Eval template generation failed:', error);
        return json(res, 500, { error: 'Eval template generation failed: ' + error.message });
      }
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
