const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors'); // Utile pour les tests en local

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // À utiliser pour les tests locaux, Vercel gère CORS en production

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/index', async (req, res) => {
    const { enseignant, classe, matiere, chapitres } = req.body;

    if (!chapitres || chapitres.length === 0) {
        return res.status(400).json({ error: "La liste des chapitres est vide." });
    }

    // Le prompt est la partie la plus importante. Il guide l'IA.
    const prompt = `
    Tu es un assistant expert en pédagogie pour le Programme d'éducation intermédiaire (PEI) de l'IB. Ta mission est de générer des plans d'unités complets et pertinents.

    Voici les informations fournies par l'enseignant :
    - Enseignant(s) : ${enseignant}
    - Année du PEI : ${classe}
    - Matière : ${matiere}
    - Liste des chapitres et ressources prévus : ${JSON.stringify(chapitres, null, 2)}

    Instructions :
    1. Analyse la liste des chapitres et regroupe-les en unités thématiques logiques (entre 2 et 4 unités maximum). Chaque unité doit contenir des chapitres qui ont un lien clair entre eux.
    2. Pour CHAQUE unité créée, remplis TOUS les champs du modèle JSON ci-dessous en te basant sur les informations fournies, tes connaissances du programme PEI, et le modèle de plan d'unité.
    3. Les réponses doivent être créatives, pertinentes pour l'année du PEI spécifiée et alignées avec les principes de l'IB.
    4. L'Énoncé de recherche doit être une phrase déclarative solide qui guide l'unité.
    5. Les Questions de recherche doivent être distinctes (factuelles, conceptuelles, invitant au débat).
    6. Les Objectifs spécifiques doivent être les lettres pertinentes (A, B, C, D) pour la matière.
    7. Le Contenu doit lister les chapitres que tu as regroupés pour cette unité.

    Ne génère que le JSON, sans aucun texte explicatif avant ou après.

    Le format de sortie doit être un objet JSON contenant une seule clé "unites", qui est un tableau d'objets. Voici le modèle pour CHAQUE objet unité dans le tableau :

    {
      "enseignant": "${enseignant}",
      "titreUnite": "Titre créatif et pertinent pour l'unité",
      "groupeMatiere": "${matiere}",
      "anneePEI": "${classe}",
      "duree": "Estimation en heures (ex: 20-25 heures)",
      "conceptCle": "Choisis UN concept clé le plus pertinent pour l'unité parmi la liste de la matière",
      "conceptsConnexes": ["Choisis 2 ou 3 concepts connexes pertinents"],
      "contexteMondial": "Choisis le contexte mondial le plus approprié et l'exploration (ex: Innovation scientifique et technique (exploration de l'adaptation et de l'ingéniosité))",
      "enonceDeRecherche": "Formule un énoncé de recherche clair et concis.",
      "questions": {
        "factuelles": ["Question factuelle 1", "Question factuelle 2"],
        "conceptuelles": ["Question conceptuelle 1", "Question conceptuelle 2"],
        "debat": ["Question invitant au débat 1", "Question invitant au débat 2"]
      },
      "objectifsSpecifiques": ["Liste des objectifs spécifiques (ex: A: Recherche, B: Développement)"],
      "evaluationSommative": "Décris brièvement la ou les tâches d'évaluation sommative pour cette unité.",
      "approchesApprentissage": ["Liste des compétences des approches de l'apprentissage développées (ex: Compétences de communication : communication écrite et orale)"],
      "contenu": "Liste ici les chapitres de l'enseignant que tu as regroupés pour cette unité.",
      "processusApprentissage": "Décris brièvement les principales activités d'apprentissage et stratégies d'enseignement."
    }
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Nettoyer la réponse pour s'assurer que c'est un JSON valide
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonData = JSON.parse(text);
        res.status(200).json(jsonData);

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini:", error);
        res.status(500).json({ error: "Impossible de générer les plans. L'IA a peut-être rencontré un problème. Veuillez réessayer." });
    }
});

// Exporte l'application Express pour Vercel
module.exports = app;
