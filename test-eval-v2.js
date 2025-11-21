import handler from './api/generate-eval.js';
import { writeFileSync } from 'fs';

// Simuler une requête
const mockReq = {
    method: 'POST',
    body: {
        matiere: 'Sciences',
        classe: 'PEI 1',
        unite: {
            titreUnite: 'Les forces et le mouvement',
            titre_unite: 'Les forces et le mouvement',
            titre: 'Les forces et le mouvement',
            enonceDeRecherche: 'Comment les forces influencent-elles le mouvement des objets?',
            enonce_recherche: 'Comment les forces influencent-elles le mouvement des objets?',
            objectifs_specifiques_detailles: [
                { critere: 'A', sous_critere: 'i', description: 'Expliquer un problème ou une question à étudier par une recherche scientifique' },
                { critere: 'A', sous_critere: 'ii', description: 'Formuler une hypothèse vérifiable et l\'expliquer' },
                { critere: 'A', sous_critere: 'iii', description: 'Formuler la question de recherche' }
            ]
        },
        criteres: ['A']
    }
};

// Simuler une réponse
const mockRes = {
    status: function(code) {
        console.log(`[STATUS] ${code}`);
        return this;
    },
    setHeader: function(name, value) {
        console.log(`[HEADER] ${name}: ${value}`);
    },
    send: function(buffer) {
        console.log(`[SUCCESS] Document généré, taille: ${buffer.length} bytes`);
        writeFileSync('test_evaluation.docx', buffer);
        console.log('[INFO] Fichier sauvegardé: test_evaluation.docx');
    },
    json: function(data) {
        console.log('[RESPONSE JSON]', data);
    }
};

console.log('[INFO] Test de génération d\'évaluation V2...\n');

handler(mockReq, mockRes).catch(error => {
    console.error('[ERROR]', error);
});
