import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { DESCRIPTEURS_COMPLETS } from './descripteurs-complets.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const EVAL_TEMPLATE_URL = process.env.EVAL_TEMPLATE_URL || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

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
            Object.keys(subs).forEach((roman) => {
                defaultExercices[c][roman] = `Exercice ${c}.${roman} : Évaluer la compétence "${subs[roman].substring(0, 50)}..." (à compléter par l'enseignant)`;
            });
        } else {
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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { matiere, classe, unite, criteres = ["D"] } = req.body;
        
        const classeKey = parseClasseToKey(classe, matiere);
        
        // Use first criterion if multiple provided
        const critere = Array.isArray(criteres) ? criteres[0] : criteres;
        
        // Get criterion data
        const matiereKey = (matiere || "").toLowerCase().replace(/\s+/g, '_');
        const pool = DESCRIPTEURS_COMPLETS[matiereKey];
        
        if (!pool) {
            return res.status(400).json({ error: `Matière non trouvée: ${matiere}` });
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
            return res.status(400).json({ error: `Critère ${critere} non trouvé pour ${matiere} ${classeKey}` });
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
        const templateUrl = EVAL_TEMPLATE_URL;
        if (!templateUrl) {
            throw new Error("L'URL du modèle d'évaluation n'est pas configurée.");
        }
        
        console.log(`[INFO] Téléchargement du modèle depuis ${templateUrl}`);
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement du modèle: ${response.statusText}`);
        }
        const templateArrayBuffer = await response.arrayBuffer();
        console.log(`[INFO] Template downloaded, size: ${templateArrayBuffer.byteLength} bytes`);
        
        if (templateArrayBuffer.byteLength === 0) {
            throw new Error("Le template téléchargé est vide");
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
        
        // Prepare simple data structure matching template placeholders
        // For simple template with {variable} placeholders (not arrays)
        const dataToRender = {
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
        res.setHeader('Content-Disposition', 'attachment; filename=Evaluation.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.status(200).send(buf);

    } catch (error) {
        console.error("Erreur lors de la génération du DOCX d'évaluation:", error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: `Erreur interne: ${error.message}` });
    }
}
