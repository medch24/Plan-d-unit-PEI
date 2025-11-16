document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('add-row-btn');
    const generateBtn = document.getElementById('generate-btn');
    const tableBody = document.querySelector('#chapitres-table tbody');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');

    // Ajoute une première ligne vide au chargement
    addRow();

    addRowBtn.addEventListener('click', addRow);
    generateBtn.addEventListener('click', generatePlans);

    function addRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="chapitre-input" placeholder="Nom du chapitre"></td>
            <td><input type="text" class="ressource-input" placeholder="Livre, site web, etc."></td>
            <td><button class="delete-row-btn">X</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector('.delete-row-btn').addEventListener('click', () => {
            row.remove();
        });
    }

    async function generatePlans() {
        // 1. Collecter les données du formulaire
        const enseignant = document.getElementById('enseignant').value;
        const classe = document.getElementById('classe').value;
        const matiere = document.getElementById('matiere').value;
        
        const chapitres = [];
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const chapitre = row.querySelector('.chapitre-input').value.trim();
            const ressource = row.querySelector('.ressource-input').value.trim();
            if (chapitre) {
                chapitres.push({ chapitre, ressource });
            }
        });

        if (!enseignant || !classe || !matiere || chapitres.length === 0) {
            alert("Veuillez remplir tous les champs et ajouter au moins un chapitre.");
            return;
        }

        const data = { enseignant, classe, matiere, chapitres };
        
        // 2. Afficher le chargement et préparer la requête
        loadingDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '';
        generateBtn.disabled = true;

        try {
            // 3. Appeler l'API
            const response = await fetch('/api/index', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue lors de la génération.');
            }

            const generatedData = await response.json();
            
            // 4. Afficher les résultats
            displayResults(generatedData.unites);

        } catch (error) {
            resultsDiv.innerHTML = `<div class="error-message"><strong>Erreur :</strong> ${error.message}</div>`;
        } finally {
            // 5. Cacher le chargement
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
    
    function displayResults(unites) {
        if (!unites || unites.length === 0) {
            resultsDiv.innerHTML = '<p>Aucun plan d\'unité n\'a pu être généré.</p>';
            return;
        }

        let html = '<h2>Plans d\'Unités Générés</h2>';
        
        unites.forEach((unit, index) => {
            html += `
                <div class="unit-plan">
                    <table>
                        <tr class="header-row"><td colspan="2">Plan de travail de l'unité PEI - Unité ${index + 1}</td></tr>
                        <tr><th>Enseignant(s)</th><td>${unit.enseignant || ''}</td></tr>
                        <tr><th>Titre de l'unité</th><td>${unit.titreUnite || ''}</td></tr>
                        <tr><th>Groupe de matières et discipline</th><td>${unit.groupeMatiere || ''}</td></tr>
                        <tr><th>Année du PEI</th><td>${unit.anneePEI || ''}</td></tr>
                        <tr><th>Durée de l'unité (heures)</th><td>${unit.duree || ''}</td></tr>
                        
                        <tr class="section-title"><td colspan="2">Recherche : définition de l'objectif de l'unité</td></tr>
                        <tr><th>Concept clé</th><td>${unit.conceptCle || ''}</td></tr>
                        <tr><th>Concept(s) connexe(s)</th><td>${(unit.conceptsConnexes || []).join(', ')}</td></tr>
                        <tr><th>Contexte mondial</th><td>${unit.contexteMondial || ''}</td></tr>
                        <tr><th>Énoncé de recherche</th><td>${unit.enonceDeRecherche || ''}</td></tr>
                        <tr><th>Questions de recherche</th><td>
                            <b>Factuelle(s):</b> <ul>${(unit.questions.factuelles || []).map(q => `<li>${q}</li>`).join('')}</ul>
                            <b>Conceptuelle(s):</b> <ul>${(unit.questions.conceptuelles || []).map(q => `<li>${q}</li>`).join('')}</ul>
                            <b>Invitant au débat:</b> <ul>${(unit.questions.debat || []).map(q => `<li>${q}</li>`).join('')}</ul>
                        </td></tr>

                        <tr><th>Objectifs spécifiques</th><td>${(unit.objectifsSpecifiques || []).join('<br>')}</td></tr>
                        <tr><th>Évaluation sommative</th><td>${unit.evaluationSommative || ''}</td></tr>
                        
                        <tr class="section-title"><td colspan="2">Approches de l'apprentissage</td></tr>
                        <tr><td colspan="2">${(unit.approchesApprentissage || []).join('<br>')}</td></tr>

                        <tr class="section-title"><td colspan="2">Action : enseignement et apprentissage par le biais de la recherche</td></tr>
                        <tr><th>Contenu</th><td>${unit.contenu || ''}</td></tr>
                        <tr><th>Processus d'apprentissage</th><td>${unit.processusApprentissage || ''}</td></tr>
                    </table>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
    }
});
