import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const PLAN_TEMPLATE_URL = process.env.PLAN_TEMPLATE_URL || "";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { enseignant, matiere, classe, unite } = req.body;

        // 1. Récupérer l'URL du modèle depuis les variables d'environnement
        const templateUrl = PLAN_TEMPLATE_URL;
        if (!templateUrl) {
            throw new Error("L'URL du modèle de plan n'est pas configurée.");
        }

        // 2. Télécharger le modèle de document Word
        console.log(`[INFO] Téléchargement du modèle depuis ${templateUrl}`);
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement du modèle: ${response.statusText}`);
        }
        const templateArrayBuffer = await response.arrayBuffer();

        // 3. Charger le modèle avec PizZip et Docxtemplater
        const zip = new PizZip(Buffer.from(templateArrayBuffer));
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 4. Préparer les données pour le template
        const dataToRender = {
            enseignant: enseignant || '',
            groupe_matiere: matiere || '',
            annee_pei: classe || '',
            titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
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
            processus_apprentissage: unite?.processus_apprentissage || unite?.contenu || '',
            ressources: unite?.ressources || 'Manuels scolaires, ressources numériques, matériel de laboratoire (si applicable).',
            differenciation: unite?.differenciation || 'Adaptation selon les besoins : soutien supplémentaire, extensions pour élèves avancés, supports visuels/audio.',
            evaluation_formative: unite?.evaluation_formative || 'Observations continues, questionnements, quizz formatifs, rétroaction régulière.',
            reflexion_avant: unite?.reflexion_avant || 'Préparation des ressources, planification des activités, anticipation des difficultés.',
            reflexion_pendant: unite?.reflexion_pendant || 'Ajustements selon la progression, gestion du temps, adaptation aux besoins.',
            reflexion_apres: unite?.reflexion_apres || 'Analyse des résultats, points à améliorer, ajustements pour les prochaines unités.'
        };

        doc.setData(dataToRender);
        doc.render();

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        
        // 5. Envoyer le fichier généré
        res.setHeader('Content-Disposition', 'attachment; filename=Plan_Unite.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.status(200).send(buf);

    } catch (error) {
        console.error('Erreur lors de la génération du DOCX:', error);
        res.status(500).json({ error: `Erreur interne: ${error.message}` });
    }
}
