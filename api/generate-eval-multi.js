import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { DESCRIPTEURS_COMPLETS } from './descripteurs-complets.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MULTI_CRITERIA_TEMPLATE_PATH = join(__dirname, '..', 'public', 'templates', 'evaluation_multi_criteres_template.docx');

/**
 * Extract sub-criteria from descriptors
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
 * Parse classe to key format
 */
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
 * Build context string for sub-criteria
 */
function buildSubCriteriaContext(criteres, allSubCriteria, descripteurs) {
    let context = '';
    
    criteres.forEach(c => {
        const desc = descripteurs[c];
        const subs = allSubCriteria[c] || {};
        
        context += `\nCritère ${c} (${desc.titre}):\n`;
        context += `Sous-critères:\n`;
        Object.entries(subs).forEach(([roman, text]) => {
            context += `  ${roman}. ${text}\n`;
        });
    });
    
    return context;
}

/**
 * Generate varied exercises with Gemini AI
 */
async function generateVariedExercises({ matiere, classe, unite, criteres, allSubCriteria, descripteurs }) {
    if (!GEMINI_API_KEY) {
        console.warn('[WARN] No GEMINI_API_KEY - using fallback exercises');
        return generateDefaultExercises(criteres, allSubCriteria);
    }
    
    console.log('[INFO] 🎯 Generating varied exercises with Gemini for criteria:', criteres.join(', '));
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    const subCriteriaContext = buildSubCriteriaContext(criteres, allSubCriteria, descripteurs);
    
    const prompt = `Tu es un expert en évaluation PEI IB. Génère des exercices VARIÉS et CONCRETS.

Matière: ${matiere}
Niveau: ${classe}
Unité: ${unite?.titreUnite || unite?.titre_unite || unite?.titre || ''}
Énoncé de recherche: ${unite?.enonceDeRecherche || unite?.enonce_recherche || ''}

Critères à évaluer: ${criteres.join(', ')}
${subCriteriaContext}

GÉNÈRE 4-6 EXERCICES VARIÉS qui évaluent ces sous-critères:

Types d'exercices à mélanger:
1. **QCM** (Critère A.i souvent) : 3-5 questions à choix multiples avec 4 options chacune
2. **Questions ouvertes** (Critères A.iii, C.ii, C.iii) : Questions nécessitant justification (3-5 lignes de réponse)
3. **Analyse de données** (Critère C.i, C.ii) : Tableaux de données à interpréter
4. **Application pratique** (Critère A.ii) : Problèmes concrets à résoudre

RÈGLES IMPORTANTES:
- Chaque exercice doit être CONCRET et DÉTAILLÉ (minimum 100 mots par exercice)
- Référencer explicitement le critère/sous-critère évalué
- VARIER les types d'exercices (pas que des QCM!)
- Adapter au contexte de l'unité "${unite?.titreUnite || unite?.titre_unite || ''}"
- Pour les QCM: indiquer clairement les 4 options avec •
- Pour les questions ouvertes: prévoir espace de réponse (answer_lines)

Réponds en JSON strict:
{
  "exercices": [
    {
      "numero": 1,
      "titre": "Résumé des connaissances sur...",
      "type": "qcm",
      "critere_ref": "A",
      "sous_critere_ref": "i",
      "objectif_ref": "décrire des connaissances scientifiques",
      "contenu": "1. Première question\\n\\n• Option A\\n• Option B\\n• Option C (correcte)\\n• Option D\\n\\n2. Deuxième question\\n\\n• Option A...\\n",
      "answer_lines": 0
    },
    {
      "numero": 2,
      "titre": "Analyse d'un phénomène",
      "type": "question_ouverte",
      "critere_ref": "A",
      "sous_critere_ref": "iii",
      "objectif_ref": "analyser des informations",
      "contenu": "[Contexte détaillé du phénomène avec données]\\n\\nQuestion: Analysez ce phénomène en justifiant votre raisonnement scientifique.",
      "answer_lines": 4
    }
  ]
}`;

    const MODELS_TO_TRY = [
        { name: "gemini-2.5-flash", description: "Gemini 2.5 Flash (primary)" },
        { name: "gemini-2.0-flash", description: "Gemini 2.0 Flash (fallback)" }
    ];
    
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
                console.log(`[SUCCESS] ✅ Generated ${json.exercices?.length || 0} exercises with ${modelConfig.name}`);
                
                return json.exercices || [];
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
    
    console.warn('[WARN] ⚠️ Exercise generation failed, using default exercises');
    return generateDefaultExercises(criteres, allSubCriteria);
}

/**
 * Generate default exercises (fallback without AI)
 */
function generateDefaultExercises(criteres, allSubCriteria) {
    const exercices = [];
    let numero = 1;
    
    criteres.forEach(c => {
        const subs = allSubCriteria[c] || {};
        Object.entries(subs).forEach(([roman, desc]) => {
            if (numero > 5) return; // Limit to 5 exercises
            
            exercices.push({
                numero: numero++,
                titre: `Évaluation ${c}.${roman}`,
                type: 'question_ouverte',
                critere_ref: c,
                sous_critere_ref: roman,
                objectif_ref: desc.substring(0, 50),
                contenu: `Réalisez une tâche qui démontre: ${desc}\n\nConsignes:\n1. Situez le problème dans un contexte réel\n2. Expliquez votre démarche\n3. Justifiez vos choix avec des notions du cours\n\n(À compléter par l'enseignant si nécessaire)`,
                answer_lines: 5
            });
        });
    });
    
    return exercices;
}

/**
 * Find exercise title for a sub-criterion
 */
function findExerciceForSubCriteria(exercices, critere, roman) {
    const ex = exercices.find(e => 
        e.critere_ref === critere && e.sous_critere_ref === roman
    );
    return ex ? ex.titre : `Exercice ${critere}.${roman}`;
}

/**
 * Main handler for multi-criteria evaluation generation
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { matiere, classe, unite, criteres } = req.body;
        
        console.log('[INFO] Multi-Criteria Eval Request:', {
            matiere,
            classe,
            criteres: criteres?.join(', '),
            unite: unite?.titreUnite || unite?.titre_unite
        });
        
        if (!criteres || !Array.isArray(criteres) || criteres.length === 0) {
            return res.status(400).json({ error: 'Au moins un critère doit être fourni' });
        }
        
        const classeKey = parseClasseToKey(classe, matiere);
        
        // Get criterion data for all selected criteria
        const matiereNormalized = (matiere || "").toLowerCase();
        let pool = DESCRIPTEURS_COMPLETS[matiereNormalized] || 
                   DESCRIPTEURS_COMPLETS[matiereNormalized.replace(/\s+/g, '_')] ||
                   DESCRIPTEURS_COMPLETS[matiere];
        
        if (!pool) {
            return res.status(400).json({ 
                error: `Matière non trouvée: ${matiere}`,
                availableMatiers: Object.keys(DESCRIPTEURS_COMPLETS)
            });
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
        
        // Collect descriptors and sub-criteria for all criteria
        const descripteurs = {};
        const allSubCriteria = {};
        
        for (const critere of criteres) {
            const criterionData = yearData?.[critere];
            if (!criterionData) {
                return res.status(400).json({ 
                    error: `Critère ${critere} non trouvé pour ${matiere} ${classeKey}` 
                });
            }
            descripteurs[critere] = criterionData;
            allSubCriteria[critere] = getAllSubCriteria(criterionData);
        }
        
        console.log('[INFO] 🎯 Generating exercises for criteria:', criteres.join(', '));
        
        // Generate varied exercises
        const exercices = await generateVariedExercises({
            matiere,
            classe: classeKey,
            unite,
            criteres,
            allSubCriteria,
            descripteurs
        });
        
        // Prepare data for template
        const criteres_summary = criteres.map(c => ({
            lettre_critere: c,
            nom_critere: descripteurs[c].titre,
            sous_criteres: Object.entries(allSubCriteria[c]).map(([roman, desc]) => ({
                roman,
                description_courte: desc.length > 60 ? desc.substring(0, 60) + '...' : desc,
                titre_exercice: findExerciceForSubCriteria(exercices, c, roman)
            }))
        }));
        
        // Format exercises with answer lines
        const formattedExercices = exercices.map(ex => ({
            ...ex,
            answer_lines: Array(ex.answer_lines || 0).fill({ line: '………………………………………………………………………………………………' })
        }));
        
        const dataToRender = {
            annee_pei: classe || '',
            groupe_matiere: matiere || '',
            enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
            criteres_summary,
            exercices: formattedExercices
        };
        
        console.log('[INFO] Data structure prepared:', {
            criteres_count: criteres_summary.length,
            exercices_count: formattedExercices.length
        });
        
        // Load and render template
        console.log('[INFO] Loading template:', MULTI_CRITERIA_TEMPLATE_PATH);
        const templateBuffer = readFileSync(MULTI_CRITERIA_TEMPLATE_PATH);
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            nullGetter: (part) => {
                console.warn(`⚠️  Missing placeholder in template: ${part.value}`);
                return '';
            }
        });
        
        console.log('[INFO] Rendering template with data...');
        doc.render(dataToRender);

        console.log('[INFO] Generating document buffer...');
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        console.log('[INFO] ✅ Multi-criteria evaluation generated successfully, size:', buf.length);

        // Send file
        const ts = Date.now();
        const criteresStr = criteres.join('_');
        res.setHeader('Content-Disposition', `attachment; filename=Evaluation_Criteres_${criteresStr}_${ts}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.statusCode = 200;
        res.end(buf);

    } catch (error) {
        console.error("[ERROR] Multi-criteria eval generation failed:", error);
        console.error("[ERROR] Stack trace:", error.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: `Erreur interne: ${error.message}` }));
    }
}
