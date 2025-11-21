import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from 'docx';
import { DESCRIPTEURS_COMPLETS } from './descripteurs-complets.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import JSZip from 'jszip';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Extrait les sous-critères des descripteurs
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
 * Récupère tous les sous-critères pour un critère
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
 * Génère les exercices avec Gemini AI
 */
async function generateExercicesWithGemini({ matiere, classe, uniteTitle, enonce, criteres, descripteurs }) {
    const useLLM = !!GEMINI_API_KEY;
    if (!useLLM) {
        console.warn('[WARN] GEMINI_API_KEY manquant - utilisation du fallback');
    }
    
    console.log('[INFO] Génération des exercices avec', useLLM ? 'Gemini' : 'fallback');
    const genAI = useLLM ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
    
    // Extraction des sous-critères
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
        }
    });
    
    // Si pas de LLM, générer des exercices par défaut
    if (!useLLM) {
        const defaultExercices = {};
        criteres.forEach(c => {
            const subs = allSubCriteria[c] || {};
            defaultExercices[c] = {};
            Object.entries(subs).forEach(([roman, text]) => {
                const d = (text || '').replace(/^[ivx]+\./i,'').trim();
                defaultExercices[c][roman] = `En lien avec l'unité "${uniteTitle}" et l'énoncé de recherche "${enonce}", réalisez une production qui démontre: ${d}. Consignes: 1) Situez le problème dans un contexte réel (2-3 phrases), 2) Expliquez la démarche à suivre étape par étape (3-4 phrases), 3) Appliquez vos connaissances pour proposer une solution ou analyse, 4) Justifiez vos choix avec des notions vues en cours, 5) Indiquez comment vous vérifieriez/évalueriez le résultat.`;
            });
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

Réponds en JSON strict avec cette structure:
{
  "exercices": {
    "A": {
      "i": "Exercice détaillé pour A.i (3-5 phrases minimum)",
      "ii": "Exercice détaillé pour A.ii (3-5 phrases minimum)",
      ...
    }
  }
}`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const res = await model.generateContent(prompt);
        let text = res.response.text();
        
        if (text.includes("```")) {
            const m = text.match(/```(?:json)?\n([\s\S]*?)```/);
            if (m) text = m[1];
        }
        
        const json = JSON.parse(text);
        console.log(`[SUCCESS] Exercices générés avec Gemini`);
        
        return {
            exercices: json.exercices || {},
            subCriteria: allSubCriteria
        };
    } catch (error) {
        console.error(`[ERROR] Erreur génération exercices:`, error.message);
        // Fallback
        const defaultExercices = {};
        criteres.forEach(c => {
            const subs = allSubCriteria[c] || {};
            defaultExercices[c] = {};
            Object.entries(subs).forEach(([roman, text]) => {
                const d = (text || '').replace(/^[ivx]+\./i,'').trim();
                defaultExercices[c][roman] = `En lien avec l'unité "${uniteTitle}", réalisez une production montrant: ${d}.`;
            });
        });
        return { exercices: defaultExercices, subCriteria: allSubCriteria };
    }
}

/**
 * Parse la classe au format clé
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
 * Sélection intelligente des critères
 */
function selectIntelligentCriteria(unite, matiere) {
    const detailedObjs = unite?.objectifs_specifiques_detailles || [];
    
    if (detailedObjs.length > 0) {
        const criteriaSet = new Set(detailedObjs.map(obj => obj.critere));
        return Array.from(criteriaSet);
    }
    
    const simpleObjs = unite?.objectifsSpecifiques || unite?.objectifs_specifiques || [];
    const criteriaSet = new Set();
    
    simpleObjs.forEach(obj => {
        const match = String(obj).match(/^([A-D])\./i);
        if (match) criteriaSet.add(match[1].toUpperCase());
    });
    
    if (criteriaSet.size > 0) return Array.from(criteriaSet);
    
    return ["D"];
}

/**
 * Crée une cellule de tableau
 */
function createTableCell(text, options = {}) {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({
                text: text,
                bold: options.bold || false,
                size: options.size || 20
            })],
            alignment: options.alignment || AlignmentType.LEFT
        })],
        width: options.width || { size: 100, type: WidthType.AUTO },
        margins: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100
        }
    });
}

/**
 * Crée le document Word avec le format exact demandé
 */
function createEvaluationDocument(data) {
    const {
        annee_pei,
        groupe_matiere,
        titre_unite,
        lettre_critere,
        nom_objectif_specifique,
        enonce_de_recherche,
        sous_criteres,
        descripteurs,
        exercices
    } = data;
    
    const sections = [];
    
    // ===== EN-TÊTE =====
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Nom et prénom : ………….……. ",
                    size: 22
                }),
                new TextRun({
                    text: `Classe: ${annee_pei}`,
                    bold: true,
                    size: 22
                })
            ],
            spacing: { after: 200 }
        })
    );
    
    sections.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    
    // ===== TITRE =====
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Évaluation de ${groupe_matiere} (Unité ${titre_unite})`,
                    bold: true,
                    size: 28
                })
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
        })
    );
    
    // ===== CRITÈRE =====
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `(Critère ${lettre_critere})`,
                    bold: true,
                    size: 22
                })
            ],
            spacing: { after: 100 }
        })
    );
    
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Énoncé de recherche : ${enonce_de_recherche}`,
                    size: 22
                })
            ],
            spacing: { after: 300 }
        })
    );
    
    // ===== TABLEAU 1 =====
    sections.push(
        new Paragraph({
            children: [new TextRun({ text: "Tableau 1:", bold: true, size: 22 })],
            spacing: { after: 100 }
        })
    );
    
    const table1 = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
        },
        rows: [
            new TableRow({
                children: [
                    createTableCell(`Critère ${lettre_critere}`, { bold: true }),
                    createTableCell("Nom de critère", { bold: true }),
                    createTableCell("Note /8", { bold: true })
                ]
            }),
            new TableRow({
                children: [
                    createTableCell(lettre_critere),
                    createTableCell(nom_objectif_specifique),
                    createTableCell("")
                ]
            })
        ]
    });
    
    sections.push(table1);
    sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    
    // ===== TEXTE EXPLICATIF =====
    sections.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Les apprenants seront évalués sur le critère ${lettre_critere} (${nom_objectif_specifique}) et ils seront capables de :`,
                    size: 22
                })
            ],
            spacing: { after: 300 }
        })
    );
    
    // ===== TABLEAU 2 =====
    sections.push(
        new Paragraph({
            children: [new TextRun({ text: "Tableau 2 :", bold: true, size: 22 })],
            spacing: { after: 100 }
        })
    );
    
    const table2Rows = [
        new TableRow({
            children: [
                createTableCell(`Critère ${lettre_critere}`, { bold: true }),
                createTableCell("1-2", { bold: true, alignment: AlignmentType.CENTER }),
                createTableCell("3-4", { bold: true, alignment: AlignmentType.CENTER }),
                createTableCell("5-6", { bold: true, alignment: AlignmentType.CENTER }),
                createTableCell("7-8", { bold: true, alignment: AlignmentType.CENTER })
            ]
        })
    ];
    
    // Ajouter une ligne pour chaque sous-critère
    sous_criteres.forEach(sc => {
        table2Rows.push(
            new TableRow({
                children: [
                    createTableCell(`${sc.roman} : ${sc.nom}`),
                    createTableCell(""),
                    createTableCell(""),
                    createTableCell(""),
                    createTableCell("")
                ]
            })
        );
    });
    
    const table2 = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
        },
        rows: table2Rows
    });
    
    sections.push(table2);
    sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    
    // ===== TABLEAU 3 =====
    sections.push(
        new Paragraph({
            children: [new TextRun({ text: "Tableau 3 : Descripteurs de niveaux", bold: true, size: 22 })],
            spacing: { after: 100 }
        })
    );
    
    const table3 = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
        },
        rows: [
            new TableRow({
                children: [
                    createTableCell("Niveau", { bold: true, width: { size: 15, type: WidthType.PERCENTAGE } }),
                    createTableCell("Descripteurs de niveaux", { bold: true, width: { size: 85, type: WidthType.PERCENTAGE } })
                ]
            }),
            ...descripteurs.map(desc => 
                new TableRow({
                    children: [
                        createTableCell(desc.niveaux),
                        createTableCell(desc.descripteur)
                    ]
                })
            )
        ]
    });
    
    sections.push(table3);
    sections.push(new Paragraph({ text: "", spacing: { after: 400 } }));
    sections.push(new Paragraph({ text: "", pageBreakBefore: true }));
    
    // ===== EXERCICES =====
    sections.push(
        new Paragraph({
            children: [new TextRun({ text: "Exercices", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
        })
    );
    
    exercices.forEach((ex, idx) => {
        // Titre de l'exercice
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Exercice ${idx + 1} : `,
                        bold: true,
                        size: 24
                    }),
                    new TextRun({
                        text: ex.description,
                        size: 24
                    })
                ],
                spacing: { after: 100 }
            })
        );
        
        // Sous-critère
        sections.push(
            new Paragraph({
                children: [new TextRun({ 
                    text: `${ex.index} (${ex.nom_sous_critere})`,
                    italic: true,
                    size: 20 
                })],
                spacing: { after: 200 }
            })
        );
        
        // Espace réponse
        sections.push(
            new Paragraph({
                children: [new TextRun({ text: "(espace pour la réponse)", size: 20, italics: true })],
                spacing: { after: 100 }
            })
        );
        
        for (let i = 0; i < 5; i++) {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: "_".repeat(100), size: 20 })],
                    spacing: { after: 50 }
                })
            );
        }
        
        sections.push(new Paragraph({ text: "", spacing: { after: 300 } }));
    });
    
    // Créer le document
    const doc = new Document({
        sections: [{
            properties: {},
            children: sections
        }]
    });
    
    return doc;
}

/**
 * Génère un document d'évaluation pour un critère spécifique
 */
async function generateDocumentForCritere({
    critere,
    matiere,
    classe,
    classeKey,
    unite,
    yearData,
    criterionData
}) {
    // Extraire les sous-critères
    const subCriteria = getAllSubCriteria(criterionData);
    
    console.log(`[INFO] ${Object.keys(subCriteria).length} sous-critères trouvés pour ${critere}`);
    
    // Générer les exercices
    const exerciseResult = await generateExercicesWithGemini({
        matiere,
        classe: classeKey,
        uniteTitle: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
        enonce: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
        criteres: [critere],
        descripteurs: { [critere]: criterionData }
    });
    
    const exercicesGenerated = exerciseResult.exercices[critere] || {};
    
    // Préparer les données pour le document
    const sousCriteres = Object.entries(subCriteria).map(([roman, nom]) => ({
        roman: roman,
        nom: nom
    }));
    
    const descripteurs = [
        { niveaux: '1-2', descripteur: criterionData.niveaux['1-2'] || '' },
        { niveaux: '3-4', descripteur: criterionData.niveaux['3-4'] || '' },
        { niveaux: '5-6', descripteur: criterionData.niveaux['5-6'] || '' },
        { niveaux: '7-8', descripteur: criterionData.niveaux['7-8'] || '' }
    ];
    
    const exercices = Object.entries(subCriteria).map(([roman, nom]) => ({
        index: `${critere}.${roman}`,
        nom_sous_critere: nom,
        description: exercicesGenerated[roman] || `[À compléter par l'enseignant]`
    }));
    
    const documentData = {
        annee_pei: classe || '',
        groupe_matiere: matiere || '',
        titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
        lettre_critere: critere,
        nom_objectif_specifique: criterionData.titre,
        enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
        sous_criteres: sousCriteres,
        descripteurs: descripteurs,
        exercices: exercices
    };
    
    console.log(`[INFO] Création du document Word pour critère ${critere}...`);
    const doc = createEvaluationDocument(documentData);
    
    console.log(`[INFO] Génération du buffer pour critère ${critere}...`);
    const buffer = await Packer.toBuffer(doc);
    
    console.log(`[INFO] Document ${critere} généré avec succès, taille: ${buffer.length}`);
    
    return {
        critere,
        buffer,
        filename: `Evaluation_${critere}_${Date.now()}.docx`
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { matiere, classe, unite, criteres: inputCriteres } = req.body;
        
        console.log('[INFO] Generate Eval Request received');
        
        const classeKey = parseClasseToKey(classe, matiere);
        
        // Sélection intelligente des critères depuis l'unité
        let criteres = inputCriteres;
        if (!criteres || criteres.length === 0) {
            criteres = selectIntelligentCriteria(unite, matiere);
            console.log('[INFO] Critères auto-sélectionnés depuis l\'unité:', criteres);
        }
        
        console.log(`[INFO] Génération de ${criteres.length} document(s) - un par critère`);
        
        // Récupérer les données de la matière
        const matiereNormalized = (matiere || "").toLowerCase();
        let pool = DESCRIPTEURS_COMPLETS[matiereNormalized] || 
                   DESCRIPTEURS_COMPLETS[matiereNormalized.replace(/\s+/g, '_')] ||
                   DESCRIPTEURS_COMPLETS[matiereNormalized.replace(/\s+/g, '-')] ||
                   DESCRIPTEURS_COMPLETS[matiere];
        
        if (!pool) {
            return res.status(400).json({ 
                error: `Matière non trouvée: ${matiere}`,
                availableMatiers: Object.keys(DESCRIPTEURS_COMPLETS)
            });
        }
        
        // Déterminer le niveau PEI
        let peiLevel = 'pei1';
        if (classeKey.includes('1') || classeKey.includes('2')) peiLevel = 'pei1';
        else if (classeKey.includes('3') || classeKey.includes('4')) peiLevel = 'pei3';
        else if (classeKey.includes('5')) peiLevel = 'pei5';
        
        let yearData = pool[peiLevel];
        if (typeof yearData === 'string' && yearData.startsWith('same_as_')) {
            const refLevel = yearData.split('_')[2];
            yearData = pool[refLevel];
        }
        
        // Si un seul critère, générer directement
        if (criteres.length === 1) {
            const critere = criteres[0];
            console.log(`[INFO] Génération pour le critère: ${critere}`);
            
            const criterionData = yearData?.[critere];
            if (!criterionData) {
                return res.status(400).json({ error: `Critère ${critere} non trouvé` });
            }
            
            const result = await generateDocumentForCritere({
                critere,
                matiere,
                classe,
                classeKey,
                unite,
                yearData,
                criterionData
            });
            
            // Envoyer le fichier
            res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.status(200).send(result.buffer);
            
        } else {
            // PLUSIEURS CRITÈRES : Générer un ZIP avec tous les documents
            console.log(`[INFO] Génération de ${criteres.length} documents dans un ZIP`);
            
            const zip = new JSZip();
            const documents = [];
            
            // Générer un document pour chaque critère
            for (const critere of criteres) {
                console.log(`[INFO] Génération du document pour critère ${critere}...`);
                
                const criterionData = yearData?.[critere];
                if (!criterionData) {
                    console.warn(`[WARN] Critère ${critere} non trouvé, ignoré`);
                    continue;
                }
                
                try {
                    const result = await generateDocumentForCritere({
                        critere,
                        matiere,
                        classe,
                        classeKey,
                        unite,
                        yearData,
                        criterionData
                    });
                    
                    documents.push(result);
                    zip.file(result.filename, result.buffer);
                    
                } catch (error) {
                    console.error(`[ERROR] Erreur lors de la génération du critère ${critere}:`, error.message);
                    // Continue avec les autres critères
                }
            }
            
            if (documents.length === 0) {
                return res.status(400).json({ 
                    error: 'Aucun document généré. Vérifiez les critères fournis.',
                    criteres: criteres
                });
            }
            
            console.log(`[INFO] ${documents.length} documents générés, création du ZIP...`);
            
            const zipBuffer = await zip.generateAsync({ 
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });
            
            console.log(`[INFO] ZIP créé avec succès, taille: ${zipBuffer.length}`);
            
            // Envoyer le ZIP
            const ts = Date.now();
            res.setHeader('Content-Disposition', `attachment; filename=Evaluations_${ts}.zip`);
            res.setHeader('Content-Type', 'application/zip');
            res.status(200).send(zipBuffer);
        }

    } catch (error) {
        console.error("Erreur lors de la génération:", error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: `Erreur interne: ${error.message}` });
    }
}
