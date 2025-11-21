import handler from './api/generate-eval.js';
import { writeFileSync } from 'fs';

// Simuler une requête avec PLUSIEURS critères
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
                { critere: 'B', sous_critere: 'i', description: 'Recueillir et présenter des données' },
                { critere: 'B', sous_critere: 'ii', description: 'Interpréter des données' }
            ]
        },
        criteres: ['A', 'B']  // DEUX CRITÈRES !
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
        console.log(`[SUCCESS] Fichier généré, taille: ${buffer.length} bytes`);
        
        // Détecter si c'est un ZIP ou un DOCX
        const isZip = buffer[0] === 0x50 && buffer[1] === 0x4B; // PK signature
        const filename = isZip ? 'test_evaluations.zip' : 'test_evaluation.docx';
        
        writeFileSync(filename, buffer);
        console.log(`[INFO] Fichier sauvegardé: ${filename}`);
        
        if (isZip) {
            console.log('[INFO] 🎉 ZIP contenant plusieurs évaluations créé avec succès !');
        }
    },
    json: function(data) {
        console.log('[RESPONSE JSON]', data);
    }
};

console.log('[INFO] Test de génération avec PLUSIEURS critères (A et B)...\n');

handler(mockReq, mockRes).catch(error => {
    console.error('[ERROR]', error);
});
