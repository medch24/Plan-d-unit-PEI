// Vercel Node Serverless API for Plan d'unité PEI
// Endpoints:
// - POST /api/generate-units
// - POST /api/save-units
// - GET  /api/units
// - POST /api/generate-eval (generate a Word .docx evaluation)

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient, ObjectId } from "mongodb";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI || "";

// Utility: build a single Mongo client reused across invocations
let cachedDb = null;
async function getDb() {
  if (cachedDb) return cachedDb;
  if (!MONGO_URL) throw new Error("MONGO_URL manquant dans les variables d'environnement");
  const client = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  cachedDb = client.db();
  return cachedDb;
}

// Minimal descriptors store (focused on Criterion D for evaluation docs) and Design full criteria.
// NOTE: The full official text provided by you has been curated and compressed to fit here.
// You can extend easily by editing DESCRIPTEURS below.
const DESCRIPTEURS = {
  design: {
    pei1: {
      A: {
        titre: "Recherche et analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "i. indique le besoin d'apporter une solution à un problème ; ii. indique les conclusions des recherches menées.",
          "3-4": "i. résume le besoin ... ; ii. indique quelques étapes des recherches ... ; iii. indique les caractéristiques principales d'un produit existant ; iv. résume quelques-unes des principales conclusions.",
          "5-6": "i. explique le besoin ... ; ii. indique et hiérarchise, avec de l'aide, les grandes étapes des recherches ; iii. résume les caractéristiques principales d'un produit existant ; iv. résume les principales conclusions des recherches pertinentes.",
          "7-8": "i. explique et justifie le besoin ... ; ii. indique et hiérarchise, avec peu d'aide, les grandes étapes ; iii. décrit les caractéristiques principales d'un produit existant ; iv. présente les principales conclusions des recherches pertinentes."
        }
      },
      B: {
        titre: "Développement des idées",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "i. indique un critère de réussite élémentaire ; ii. présente une idée ; iii. crée un dessin/schéma incomplet.",
          "3-4": "i. indique quelques critères ; ii. présente plusieurs idées pouvant être interprétées ; iii. indique les caractéristiques de la conception retenue ; iv. crée un dessin/schéma ou les modalités requises.",
          "5-6": "i. développe quelques critères ; ii. présente quelques idées réalisables ; iii. présente la conception retenue ; iv. crée un dessin/schéma et les informations principales.",
          "7-8": "i. développe une liste de critères ; ii. présente des idées réalisables avec annotations ; iii. présente la conception retenue en décrivant ses caractéristiques ; iv. crée un dessin/schéma qui résume les informations principales."
        }
      },
      C: {
        titre: "Création de la solution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "i. compétences techniques de base ; ii. crée une solution qui fonctionne mal et présentée de manière incomplète.",
          "3-4": "i. énumère des étapes principales d'un plan avec quelques détails ; ii. compétences techniques satisfaisantes ; iii. solution fonctionne en partie ; iv. indique un changement apporté.",
          "5-6": "i. énumère les étapes d'un plan qui tient compte du temps et des ressources ; ii. bonnes compétences techniques ; iii. solution fonctionne comme prévu ; iv. indique un changement apporté à la conception et au plan.",
          "7-8": "i. résume un plan efficace ; ii. compétences techniques excellentes ; iii. suit le plan pour créer la solution ; iv. énumère les changements apportés."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "i. définit une méthode d'essai ; ii. indique dans quelle mesure la solution est une réussite.",
          "3-4": "i. définit une méthode d'essai pertinente ; ii. indique la réussite par rapport au cahier des charges ; iii. indique une amélioration possible ; iv. indique un effet sur le client/public.",
          "5-6": "i. définit des méthodes d'essai pertinentes ; ii. indique la réussite par rapport au cahier des charges ; iii. résume une amélioration ; iv. résume les effets sur le client/public.",
          "7-8": "i. résume des méthodes d'essai pertinentes ; ii. résume la réussite par rapport au cahier des charges ; iii. résume en quoi améliorer ; iv. résume les effets sur le client/public."
        }
      }
    },
    pei2: "same_as_pei1",
    pei3: "see_general_D_only",
    pei4: "see_general_D_only",
    pei5: "see_general_D_only"
  },
  // For other subjects we include Criterion D (used for evaluation docs most often)
  sciences: {
    pei1: { D: { titre: "Réflexion sur les répercussions de la science", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "i. indiquer comment la science est utilisée ; ii. indiquer des conséquences en lien avec un facteur ; iii. langage scientifique limité ; iv. documentation limitée.",
      "3-4": "i. résumer comment la science est utilisée ; ii. résumer des conséquences (1 facteur) ; iii. parfois langage scientifique ; iv. parfois documenter correctement.",
      "5-6": "i. récapituler l'application de la science ; ii. décrire des conséquences (1 facteur) ; iii. langage scientifique généralement clair ; iv. documenter généralement correctement.",
      "7-8": "i. décrire comment la science est utilisée ; ii. discuter/analyser les conséquences (1 facteur) ; iii. langage scientifique systématique ; iv. documenter intégralement."
    }}},
    pei3: { D: { titre: "Réflexion sur les répercussions de la science", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "i. indiquer comment la science est utilisée ; ii. indiquer conséquences (1 facteur) ; iii. langage limité ; iv. documentation limitée.",
      "3-4": "i. résumer comment la science est utilisée ; ii. résumer conséquences (1 facteur) ; iii. parfois langage scientifique ; iv. parfois documenter.",
      "5-6": "i. récapituler l'application de la science ; ii. décrire conséquences ; iii. langage généralement clair ; iv. documenter généralement correctement.",
      "7-8": "i. décrire application de la science ; ii. discuter/analyser conséquences ; iii. langage scientifique clair ; iv. documenter intégralement."
    }}},
    pei5: { D: { titre: "Réflexion sur les répercussions de la science", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "i. résumer comment la science est utilisée ; ii. résumer conséquences (1 facteur) ; iii. langage limité ; iv. documentation limitée.",
      "3-4": "i. récapituler l'application ; ii. décrire conséquences ; iii. parfois langage scientifique ; iv. parfois documenter.",
      "5-6": "i. décrire application ; ii. discuter conséquences ; iii. langage généralement clair ; iv. documenter généralement correctement.",
      "7-8": "i. expliquer application ; ii. discuter et évaluer conséquences ; iii. langage scientifique systématique ; iv. documenter intégralement."
    }}}
  },
  "langue et littérature": {
    pei1: { D: { titre: "Utilisation de la langue", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Vocabulaire approprié mais peu varié ; registre/style inappropriés ; grammaire/syntaxe/punct. limitées ; orthographe/prononciation limitées ; techniques non verbales limitées.",
      "3-4": "Vocabulaire et formes appropriés et variés ; registre parfois adapté ; grammaire correcte à un certain degré ; orthographe/prononciation correctes à un certain degré ; parfois techniques non verbales appropriées.",
      "5-6": "Utilisation compétente et très variée ; registre adapté ; grammaire conséquente ; orthographe/prononciation conséquentes ; suffisamment de techniques non verbales.",
      "7-8": "Utilisation efficace et très variée ; registre constamment approprié ; grammaire de haut niveau ; orthographe/prononciation de haut niveau ; techniques non verbales efficaces."
    }}},
    pei3: { D: { titre: "Utilisation de la langue", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Vocabulaire approprié mais peu varié ; registre/style inappropriés ; grammaire limitée ; orthographe/prononciation limitées ; techniques non verbales limitées.",
      "3-4": "Vocabulaire approprié et varié ; registre parfois adapté ; grammaire correcte ; orthographe/prononciation correctes ; parfois techniques non verbales.",
      "5-6": "Compétent, très varié ; registre adapté ; grammaire conséquente ; orthographe/prononciation conséquentes ; suffisamment de techniques.",
      "7-8": "Efficace, très varié ; registre constant ; grammaire élevée ; orthographe/prononciation élevées ; techniques efficaces."
    }}},
    pei5: { D: { titre: "Utilisation de la langue", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Vocabulaire approprié mais peu varié ; registre/style inappropriés ; grammaire limitée ; orthographe/prononciation limitées ; techniques non verbales limitées.",
      "3-4": "Vocabulaire approprié et varié ; registre parfois adapté ; grammaire correcte ; orthographe/prononciation correctes ; parfois techniques non verbales.",
      "5-6": "Compétent, très varié ; registre adapté ; grammaire conséquente ; orthographe/prononciation conséquentes ; suffisamment de techniques.",
      "7-8": "Efficace, très varié ; registre constant ; grammaire élevée ; orthographe/prononciation élevées ; techniques efficaces."
    }}}
  },
  "individus et sociétés": {
    pei1: { D: { titre: "Pensée critique", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Identifier lignes générales, utiliser rarement infos pour justifier, identifier origine/finalité de sources limitées, identifier quelques points de vue.",
      "3-4": "Identifier quelques lignes ; justifier avec quelques infos ; identifier origine/finalité ; identifier quelques points de vue et suggérer implications.",
      "5-6": "Identifier lignes ; justifier avec infos ; identifier origine/finalité d'un éventail ; identifier différents points de vue et leurs implications.",
      "7-8": "Identifier en détail ; justifier en détail ; analyser un éventail de sources ; identifier systématiquement différents points de vue et leurs implications."
    }}},
    pei3: { D: { titre: "Pensée critique", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Analyse limitée ; débuts d'arguments ; origine/finalité limitée ; identifie différentes perspectives.",
      "3-4": "Analyse simple ; récapitule pour développer arguments ; analyse/évalue sources ; interprète perspectives.",
      "5-6": "Discute concepts ; synthétise infos ; analyse/évalue efficacement sources ; interprète perspectives et implications.",
      "7-8": "Analyse détaillée ; arguments cohérents ; analyse efficace large éventail ; reconnaît perspectives et explique implications."
    }}},
    pei5: { D: { titre: "Pensée critique", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Analyse limitée ; récapitule limité ; décrit peu de sources ; identifie perspectives très limitées.",
      "3-4": "Analyse ; récapitule ; analyse/évalue sources ; interprète perspectives et quelques implications.",
      "5-6": "Discute concepts ; synthétise ; analyse/évalue efficacement ; interprète perspectives et implications.",
      "7-8": "Discussion détaillée ; arguments valables et étayés ; analyse/évalue efficacement éventail ; interprète en profondeur différentes perspectives."
    }}}
  },
  mathématiques: {
    pei1: { D: { titre: "Application des mathématiques (vie réelle)", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Identifier quelques éléments ; appliquer avec succès limité des stratégies.",
      "3-4": "Identifier éléments pertinents ; sélectionner des stratégies ; appliquer pour obtenir solution ; décrire si la solution a un sens.",
      "5-6": "Identifier éléments pertinents ; sélectionner stratégies convenables ; appliquer pour solution valable ; décrire précision et discuter sens.",
      "7-8": "Identifier éléments pertinents ; sélectionner stratégies appropriées ; appliquer pour solution correcte ; justifier précision et sens."
    }}},
    pei3: { D: { titre: "Application des mathématiques (vie réelle)", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Identifier quelques éléments ; appliquer stratégies avec succès limité.",
      "3-4": "Identifier éléments pertinents ; sélectionner stratégies ; appliquer ; discuter sens.",
      "5-6": "Identifier éléments ; sélectionner stratégies ; appliquer pour solution valable ; décrire précision ; discuter sens.",
      "7-8": "Identifier éléments ; sélectionner stratégies appropriées ; appliquer pour solution correcte ; justifier précision ; justifier sens."
    }}},
    pei5: { D: { titre: "Application des mathématiques (vie réelle)", niveaux: {
      "0": "N'atteint aucun des niveaux.",
      "1-2": "Identifier quelques éléments ; appliquer stratégies avec succès limité.",
      "3-4": "Identifier éléments pertinents ; sélectionner stratégies ; appliquer ; discuter sens.",
      "5-6": "Identifier éléments ; sélectionner stratégies ; appliquer pour solution valable ; décrire précision ; expliquer sens.",
      "7-8": "Identifier éléments ; sélectionner stratégies appropriées ; appliquer pour solution correcte ; justifier précision ; justifier sens."
    }}}
  },
  arts: {
    pei1: { D: { titre: "Évaluation", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Identifie certains éléments et effectue une brève observation.", "3-4": "Résume certains éléments et identifie aspects de développement.", "5-6": "Décrit son travail et résume son développement.", "7-8": "Analyse son travail et décrit son développement." } } },
    pei3: { D: { titre: "Évaluation", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Résume certains éléments ; identifie aspects de développement.", "3-4": "Décrit son travail ; résume le développement.", "5-6": "Analyse son travail ; décrit le développement.", "7-8": "Évalue son travail ; analyse le développement." } } },
    pei5: { D: { titre: "Évaluation", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Décrit son travail ; résume le développement.", "3-4": "Analyse son travail ; décrit le développement.", "5-6": "Évalue son travail ; analyse le développement.", "7-8": "Évalue minutieusement ; discute le développement." } } }
  },
  "acquisition de langues": {
    debutant: { D: { titre: "Expression écrite", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Vocabulaire limité ; nombreuses erreurs ; présentation reconnaissable ; peu d'adaptation au destinataire.", "3-4": "Vocabulaire élémentaire ; quelques erreurs ; présentation reconnaissable ; quelques informations pertinentes.", "5-6": "Vocabulaire varié ; erreurs occasionnelles ; présentation appropriée ; la plupart des informations pertinentes.", "7-8": "Vocabulaire très varié ; structures généralement correctes ; organisation efficace ; informations complètes adaptées au contexte." } } },
    competent: { D: { titre: "Expression écrite", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Vocabulaire limité ; nombreuses erreurs ; présentation reconnaissable ; peu d'adaptation.", "3-4": "Vocabulaire élémentaire ; quelques erreurs ; présentation reconnaissable ; quelques informations.", "5-6": "Vocabulaire varié ; erreurs occasionnelles ; présentation appropriée ; la plupart des informations.", "7-8": "Vocabulaire très varié ; structures correctes ; organisation efficace ; informations complètes et adaptées." } } },
    experimente: { D: { titre: "Expression écrite", niveaux: { "0": "N'atteint aucun niveau.", "1-2": "Vocabulaire limité ; nombreuses erreurs ; présentation reconnaissable ; peu d'adaptation.", "3-4": "Vocabulaire élémentaire ; quelques erreurs ; présentation reconnaissable ; quelques informations.", "5-6": "Vocabulaire varié ; erreurs occasionnelles ; présentation appropriée ; la plupart des informations.", "7-8": "Vocabulaire très varié ; structures correctes ; organisation efficace ; informations complètes et adaptées." } } }
  }
};

function parseClasseToKey(classe) {
  // Accepts values like "PEI 1" or "pei1" or "PEI1"
  const normalized = (classe || "").toString().toLowerCase().replaceAll(" ", "");
  if (normalized.startsWith("pei")) return normalized; // pei1, pei2...
  return `pei${normalized}`;
}

async function generateUnitsWithGemini({ chapitres, matiere, classe }) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY manquant dans Vercel env");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const nbUnites = matiere === "Langue et littérature" ? 6 : 4;
  const prompt = `Tu es un expert PEI IB. Génère EXACTEMENT ${nbUnites} unités en regroupant ces chapitres en thèmes cohérents. Donne pour chaque unité: titre_unite, chapitres_inclus (index), duree totale estimée (en heures, somme "poids" approx 4h/chapitre si absent), concept_cle, 2-3 concepts_connexes, contexte_mondial, enonce_recherche, 2-3 questions_factuelles, 2-3 questions_conceptuelles, 2-3 questions_debat, objectifs_specifiques (liste d'IDs tels que A.i, B.ii...). Réponds EN JSON strict: {"unites":[{...}]}. Matière: ${matiere}. Année: ${classe}. Chapitres: ${JSON.stringify(chapitres)}.`;

  const res = await model.generateContent(prompt);
  let text = res.response.text();
  // Clean code-fences if any
  if (text.includes("```")) {
    const m = text.match(/```(?:json)?\n([\s\S]*?)```/);
    if (m) text = m[1];
  }
  const json = JSON.parse(text);
  return json.unites || [];
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
  const doc = new Document();
  const children = [];
  children.push(new Paragraph({ text: `Évaluation critériée – ${matiere}`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
  if (uniteTitle) children.push(new Paragraph({ text: `Unité: ${uniteTitle}`, spacing: { after: 200 } }));
  if (enonce) children.push(new Paragraph({ text: `Énoncé de recherche: ${enonce}`, spacing: { after: 200 } }));

  criteres.forEach(c => {
    // Try to find descriptors
    let descBlock = null;
    const key = (matiere || "").toLowerCase();
    const pool = DESCRIPTEURS[key] || DESCRIPTEURS[matiere] || DESCRIPTEURS[key.replaceAll(" ", "_")] || null;
    const year = pool && (pool[classeKey] || pool[parseClasseToKey(classeKey)] || pool["debutant"] || pool["competent"] || pool["experimente"]);
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

  return Packer.toBuffer(doc);
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
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

      const classeKey = parseClasseToKey(classe);
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
      const filename = `Plan_Unite_${(matiere||'').replace(/\s+/g,'_')}_${Date.now()}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      return res.end(Buffer.from(buffer));
    }

    if (req.method === "POST" && pathname === "/api/generate-eval") {
      const body = await readBody(req);
      const { matiere, classe, unite, criteres = ["D"], telecharger = true } = body || {};
      const classeKey = parseClasseToKey(classe);
      const buffer = await buildEvalDocx({ matiere, classeKey, criteres, uniteTitle: unite?.titre_unite || "", enonce: unite?.enonce_recherche || "" });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      const filename = `Evaluation_${(matiere||'').replace(/\s+/g,'_')}_${Date.now()}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      return res.end(Buffer.from(buffer));
    }

    // Fallback
    return json(res, 404, { error: "Route inconnue" });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: e.message || String(e) });
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
