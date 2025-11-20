import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { DESCRIPTEURS_COMPLETS } from './descripteurs-complets.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pickEnv(...keys){ for(const k of keys){ if(process.env[k]) return process.env[k]; } return ""; }
const EVAL_TEMPLATE_URL = pickEnv('EVAL_TEMPLATE_URL','Eval_TEMPLATE_URL','EVALUATION_TEMPLATE_URL','Evaluation_TEMPLATE_URL');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Local fallback template path
const LOCAL_EVAL_TEMPLATE_PATH = join(__dirname, '..', 'public', 'templates', 'evaluation_template.docx');

// Version: 1.2 - Robust env var handling + better template validation
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
        Object.assign(allSubs, subs);
    }
    
    return allSubs;
}

/**
 * Generate exercises for evaluation using Gemini AI
 */
async function generateExercicesWithGemini({ matiere, classe, uniteTitle, enonce, criteres, descripteurs }) {
    const useLLM = !!GEMINI_API_KEY;
    if (!useLLM) {
        console.warn('[WARN] GEMINI_API_KEY is missing for exercise generation - using rule-based fallback');
    }
    
    console.log('[INFO] 🎯 Generating exercises with', useLLM ? 'Gemini' : 'fallback', 'for criteria:', criteres.join(', '));
    const genAI = useLLM ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
    
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
    // If LLM unavailable, build rule-based exercises from sub-criteria
    if (!useLLM) {
        const defaultExercices = {};
        criteres.forEach(c => {
            const subs = allSubCriteria[c] || {};
            defaultExercices[c] = {};
            const subKeys = Object.keys(subs);
            if (subKeys.length === 0) {
                ['i','ii','iii'].forEach((roman) => {
                    defaultExercices[c][roman] = `Exercice ${c}.${roman} (${matiere} - ${classe}): En lien avec l'unité "${uniteTitle}", réalisez une tâche permettant d'évaluer ce sous-critère. 1) Décrivez la démarche et les notions mobilisées, 2) Appliquez-les à un exemple concret, 3) Justifiez votre choix et vérifiez votre résultat.`;
                });
            } else {
                Object.entries(subs).forEach(([roman, text]) => {
                    const d = (text || '').replace(/^[ivx]+\./i,'').trim();
                    defaultExercices[c][roman] = `Exercice ${c}.${roman} (${matiere} - ${classe}): En lien avec l'unité "${uniteTitle}" et l'énoncé de recherche "${enonce}", réalisez une production qui démontre: ${d}. Consignes: 1) Situez le problème dans un contexte réel (2-3 phrases), 2) Expliquez la démarche à suivre étape par étape (3-4 phrases), 3) Appliquez vos connaissances pour proposer une solution ou analyse, 4) Justifiez vos choix avec des notions vues en cours, 5) Indiquez comment vous vérifieriez/évalueriez le résultat. Votre production doit permettre d'apprécier les niveaux 1-2, 3-4, 5-6, 7-8.`;
                });
            }
        });
        return { exercices: defaultExercices, subCriteria: allSubCriteria };
    }
    
    const prompt = `Tu es un expert en évaluation PEI IB. Génère des exercices PRATIQUES et DÉTAILLÉS pour évaluer les élèves.

Matière: ${matiere}
Niveau: ${classe}
Unité: ${uniteTitle}
Énoncé de recherche: ${enonce}

Critères d'évaluation avec sous-critères:
${descriptorInfo}

IMPORTANT:
1. Pour CHAQUE sous-critère (i, ii, iii, iv, v) de CHAQUE critère, génère UN EXERCICE SPÉCIFIQUE ET DÉTAILLÉ
2. Chaque exercice doit:
   - Être concret et directement réalisable en classe
   - Contenir des consignes précises et claires (minimum 3-5 phrases)
   - Permettre d'évaluer spécifiquement le sous-critère visé
   - Être adapté au niveau ${classe}
   - Inclure des exemples ou contextes si nécessaire
   - Permettre d'évaluer les différents niveaux de maîtrise (1-2, 3-4, 5-6, 7-8)

Exemple de format attendu:
"Exercice A.i (${matiere}): Analysez le phénomène X en identifiant les concepts scientifiques impliqués. Consignes: 1) Listez au moins 3 concepts clés, 2) Expliquez leur rôle dans le phénomène, 3) Fournissez des exemples concrets tirés de situations réelles. Rédigez votre réponse sous forme de paragraphe structuré (200-300 mots)."

Réponds en JSON strict avec cette structure:
{
  "exercices": {
    "A": {
      "i": "Exercice détaillé pour évaluer le sous-critère A.i (3-5 phrases minimum)",
      "ii": "Exercice détaillé pour évaluer le sous-critère A.ii (3-5 phrases minimum)",
      "iii": "Exercice détaillé pour évaluer le sous-critère A.iii (3-5 phrases minimum)",
      "iv": "Exercice détaillé pour évaluer le sous-critère A.iv (3-5 phrases minimum)"
    },
    "B": {
      "i": "Exercice détaillé pour B.i...",
      ...
    }
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
    
    console.warn('[WARN] ⚠️  Exercise generation failed, using rule-based fallback');
    
    // Build detailed exercises from descriptors to avoid empty tasks
    const defaultExercices = {};
    criteres.forEach(c => {
        const subs = allSubCriteria[c] || {};
        defaultExercices[c] = {};
        const keys = Object.keys(subs);
        if (keys.length === 0) {
            ['i','ii','iii'].forEach((roman) => {
                defaultExercices[c][roman] = `Exercice ${c}.${roman} (${matiere} - ${classe}): En lien avec l'unité "${uniteTitle}", produisez un travail qui démontre le sous-critère. Consignes: 1) Décrivez la démarche et les notions mobilisées, 2) Appliquez-les à un exemple concret, 3) Justifiez vos choix et indiquez comment vous évalueriez la qualité du résultat.`;
            });
        } else {
            Object.entries(subs).forEach(([roman, text]) => {
                const d = (text || '').replace(/^[ivx]+\./i,'').trim();
                defaultExercices[c][roman] = `Exercice ${c}.${roman} (${matiere} - ${classe}): En lien avec l'unité "${uniteTitle}" et l'énoncé de recherche "${enonce}", réalisez une production montrant: ${d}. Consignes: 1) Situez le problème dans un contexte réel, 2) Expliquez votre démarche en étapes, 3) Appliquez vos connaissances pour obtenir un résultat analysable, 4) Justifiez et vérifiez votre résultat.`;
            });
        }
    });
    
    return {
        exercices: defaultExercices,
        subCriteria: allSubCriteria
    };
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

/**
 * Select intelligent criteria based on unit content and subject
 */
function selectIntelligentCriteria(unite, matiere) {
    // Get detailed objectives if available
    const detailedObjs = unite?.objectifs_specifiques_detailles || [];
    
    if (detailedObjs.length > 0) {
        // Extract unique criteria from detailed objectives
        const criteriaSet = new Set(detailedObjs.map(obj => obj.critere));
        return Array.from(criteriaSet);
    }
    
    // Fallback: parse from simple objectifs_specifiques
    const simpleObjs = unite?.objectifsSpecifiques || unite?.objectifs_specifiques || [];
    const criteriaSet = new Set();
    
    simpleObjs.forEach(obj => {
        const match = String(obj).match(/^([A-D])\\./i);
        if (match) criteriaSet.add(match[1].toUpperCase());
    });
    
    if (criteriaSet.size > 0) return Array.from(criteriaSet);
    
    // Default fallback
    return ["D"];
}

/**
 * Get sub-criteria for a criterion from detailed objectives, ensuring minimum 3
 */
function getSubCriteriaFromObjectives(unite, critere) {
    const detailedObjs = unite?.objectifs_specifiques_detailles || [];
    const subCriteria = {};
    
    detailedObjs
        .filter(obj => obj.critere === critere)
        .forEach(obj => {
            subCriteria[obj.sous_critere] = obj.description;
        });
    
    return subCriteria;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { matiere, classe, unite, criteres: inputCriteres } = req.body;
        
        console.log('[INFO] Generate Eval Request received');
        console.log('[INFO] Environment variables check:', {
            hasTemplateUrl: !!EVAL_TEMPLATE_URL,
            templateUrlLength: EVAL_TEMPLATE_URL?.length || 0,
            hasGeminiKey: !!GEMINI_API_KEY
        });
        
        const classeKey = parseClasseToKey(classe, matiere);
        
        // Intelligent criteria selection if not provided
        let criteres = inputCriteres;
        if (!criteres || criteres.length === 0) {
            criteres = selectIntelligentCriteria(unite, matiere);
            console.log('[INFO] Auto-selected criteria:', criteres);
        }
        
        // Use first criterion if multiple provided (for single eval doc)
        const critere = Array.isArray(criteres) ? criteres[0] : criteres;
        console.log('[INFO] Generating evaluation for criterion:', critere);
        
        // Get criterion data
        // Try different key formats to find the matching descriptors
        const matiereNormalized = (matiere || "").toLowerCase();
        let pool = DESCRIPTEURS_COMPLETS[matiereNormalized] || 
                   DESCRIPTEURS_COMPLETS[matiereNormalized.replace(/\s+/g, '_')] ||
                   DESCRIPTEURS_COMPLETS[matiereNormalized.replace(/\s+/g, '-')] ||
                   DESCRIPTEURS_COMPLETS[matiere]; // Try original case
        
        if (!pool) {
            console.error('[ERROR] Matière non trouvée:', matiere);
            console.error('[ERROR] Clés disponibles:', Object.keys(DESCRIPTEURS_COMPLETS));
            return res.status(400).json({ 
                error: `Matière non trouvée: ${matiere}`,
                availableMatiers: Object.keys(DESCRIPTEURS_COMPLETS),
                triedKeys: [
                    matiereNormalized,
                    matiereNormalized.replace(/\s+/g, '_'),
                    matiereNormalized.replace(/\s+/g, '-'),
                    matiere
                ]
            });
        }
        
        console.log('[INFO] Matière trouvée:', matiere, '-> Key used:', matiereNormalized);
        
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
            return res.status(400).json({ error: `Critère ${critere} non trouvé pour ${matiere} ${classeKey}` });
        }
        
        // Extract sub-criteria from objectives first (more precise), then fallback to descriptor parsing
        let subCriteria = getSubCriteriaFromObjectives(unite, critere);
        
        // If less than 3 sub-criteria from objectives, merge with descriptor extraction
        const descriptorSubs = getAllSubCriteria(criterionData);
        if (Object.keys(subCriteria).length < 3) {
            console.log('[INFO] Less than 3 sub-criteria from objectives, merging with descriptor subs');
            subCriteria = { ...descriptorSubs, ...subCriteria };
        }
        
        // Ensure minimum 3 sub-criteria
        const subKeys = Object.keys(subCriteria);
        if (subKeys.length < 3) {
            console.warn(`[WARN] Only ${subKeys.length} sub-criteria found for ${critere}, should be minimum 3`);
        }
        
        console.log(`[INFO] Selected ${subKeys.length} sub-criteria for ${critere}:`, subKeys);
        
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
        
        // Try to load template: URL first, then local fallback
        let templateArrayBuffer;
        const templateUrl = EVAL_TEMPLATE_URL;
        
        if (templateUrl) {
            try {
                console.log(`[INFO] Téléchargement du modèle depuis ${templateUrl}`);
                const response = await fetch(templateUrl, { redirect: 'follow' });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const ct = response.headers.get('content-type') || '';
                if (!ct.includes('officedocument.wordprocessingml.document')){
                    throw new Error(`Invalid content-type: ${ct}`);
                }
                templateArrayBuffer = await response.arrayBuffer();
                console.log(`[INFO] Template downloaded from URL, size: ${templateArrayBuffer.byteLength} bytes`);
                
                if (templateArrayBuffer.byteLength === 0) {
                    throw new Error('Template is empty');
                }
            } catch (urlError) {
                console.warn('[WARN] Failed to load template from URL:', urlError.message);
                console.log('[INFO] Falling back to local template...');
                templateArrayBuffer = null;
            }
        }
        
        // Fallback to local template if URL failed or not configured
        if (!templateArrayBuffer) {
            try {
                console.log(`[INFO] Loading local template from ${LOCAL_EVAL_TEMPLATE_PATH}`);
                const localBuffer = readFileSync(LOCAL_EVAL_TEMPLATE_PATH);
                templateArrayBuffer = localBuffer.buffer.slice(localBuffer.byteOffset, localBuffer.byteOffset + localBuffer.byteLength);
                console.log(`[INFO] Local template loaded, size: ${templateArrayBuffer.byteLength} bytes`);
            } catch (localError) {
                console.error('[ERROR] Failed to load local template:', localError.message);
                return res.status(500).json({ 
                    error: 'Impossible de charger le template (URL et local ont échoué)',
                    details: localError.message
                });
            }
        }
        
        // Fill template with docxtemplater
        const zip = new PizZip(Buffer.from(templateArrayBuffer));
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            nullGetter: (part) => {
                console.warn(`⚠️  Missing placeholder in template: ${part.value}`);
                return '';
            }
        });
        
        // Prepare data structure matching template structure
        // Template uses loops for tasks and descriptors
        const taches = [];
        Object.entries(subCriteria).forEach(([roman, description]) => {
            const exercise = exercicesGenerated[roman];
            taches.push({
                index: `${critere}.${roman}`,
                description: exercise || `[À compléter par l'enseignant pour ${critere}.${roman}]`
            });
        });
        
        // Build descripteurs array for the loop in template
        const descripteurs = [
            { 
                niveaux: '1-2', 
                descripteur: criterionData.niveaux['1-2'] || '',
                descript: criterionData.niveaux['1-2'] || '' // Match template variable name
            },
            { 
                niveaux: '3-4', 
                descripteur: criterionData.niveaux['3-4'] || '',
                descript: criterionData.niveaux['3-4'] || ''
            },
            { 
                niveaux: '5-6', 
                descripteur: criterionData.niveaux['5-6'] || '',
                descript: criterionData.niveaux['5-6'] || ''
            },
            { 
                niveaux: '7-8', 
                descripteur: criterionData.niveaux['7-8'] || '',
                descript: criterionData.niveaux['7-8'] || ''
            }
        ];
        
        const objectifsArray = Array.isArray(unite?.objectifsSpecifiques || unite?.objectifs_specifiques)
            ? (unite?.objectifsSpecifiques || unite?.objectifs_specifiques)
            : [];

        // FINAL FIX: Your template has nested structure that's causing the error
        // We provide BOTH nested (for {#objectifs}) AND flat (direct access) structures
        const dataToRender = {
            annee_pei: classe || '',
            groupe_matiere: matiere || '',
            titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
            objectifs_specifiques: objectifs_specifiques_text,
            enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
            lettre_critere: critere,
            nom_objectif_specifique: criterionData.titre,
            
            // Provide taches and descripteurs DIRECTLY (not nested)
            // This avoids the {#objectifs} parent loop that has the closing tag error
            taches: taches,
            descripteurs: descripteurs,
            
            // Text versions for simple placeholders
            exercices: exercisesText
        };
        
        console.log('[INFO] Data structure for template (FLAT structure to avoid nesting error):', {
            taches_count: taches.length,
            descripteurs_count: descripteurs.length,
            critere,
            has_objectifs_loop: false
        });
        
        console.log('[INFO] Rendering template with data...');
        doc.setData(dataToRender);
        doc.render();

        console.log('[INFO] Generating document buffer...');
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        console.log('[INFO] Document generated successfully, size:', buf.length);

        // Send file
        const ts = Date.now();
        res.setHeader('Content-Disposition', `attachment; filename=Evaluation_${ts}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.status(200).send(buf);

    } catch (error) {
        console.error("Erreur lors de la génération du DOCX d'évaluation:", error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: `Erreur interne: ${error.message}` });
    }
}
