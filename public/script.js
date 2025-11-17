document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('add-row-btn'); const SAVE_KEY = 'pei_last_form';
    const generateBtn = document.getElementById('generate-btn');
    const tableBody = document.querySelector('#chapitres-table tbody');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');

    // Ajoute une première ligne vide au chargement
    addRow();

    addRowBtn.addEventListener('click', addRow);
    generateBtn.addEventListener('click', generatePlans);

    // Restore last form if any
    try { const last = JSON.parse(localStorage.getItem(SAVE_KEY)||'{}'); if(last.enseignant){ document.getElementById('enseignant').value = last.enseignant; document.getElementById('classe').value = last.classe||'PEI 1'; document.getElementById('matiere').value = last.matiere||'Design'; (last.chapitres||[]).forEach(c=>addRowWith(c.chapitre,c.ressource)); } } catch(_){}

    function addRowWith(chapitre='', ressource=''){ const row=document.createElement('tr'); row.innerHTML=`\n            <td><input type="text" class="chapitre-input" placeholder="Nom du chapitre" value="${chapitre}"></td>\n            <td><input type="text" class="ressource-input" placeholder="Livre, site web, etc." value="${ressource}"></td>\n            <td>\n              <button class="delete-row-btn">X</button>\n            </td>`; tableBody.appendChild(row); row.querySelector('.delete-row-btn').addEventListener('click',()=>row.remove()); }

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
            // save last form
            localStorage.setItem(SAVE_KEY, JSON.stringify({ enseignant, classe, matiere, chapitres }));
            // 3. Appeler l'API
            const response = await fetch('/api/generate-units', {
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
            displayResults(generatedData.unites, { enseignant, classe, matiere });
            // Save units to DB for this attempt essai 2 if requested later
            await fetch('/api/save-units', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ enseignant, classe, matiere, units: generatedData.unites, essai: 1 }) });

        } catch (error) {
            resultsDiv.innerHTML = `<div class="error-message"><strong>Erreur :</strong> ${error.message}</div>`;
        } finally {
            // 5. Cacher le chargement
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
    
    function displayResults(unites, ctx) {
        if (!unites || unites.length === 0) {
            resultsDiv.innerHTML = '<p>Aucun plan d\'unité n\'a pu être généré.</p>';
            return;
        }

        let html = '<h2>Plans d\'Unités Générés</h2>';
        
        unites.forEach((unit, index) => {
            const q = unit.questions || {}; const qsF=(q.factuelles||unit.questions_factuelles||[]); const qsC=(q.conceptuelles||unit.questions_conceptuelles||[]); const qsD=(q.debat||unit.questions_debat||[]);
            html += `
                <div class="unit-plan">
                    <div style="padding:10px; text-align:right">
                      <button class="btn-secondary" data-eval="${index}">Générer l'évaluation critériée</button>
                    </div>
                    <table>
                        <tr class="header-row"><td colspan="2">Plan de travail de l'unité PEI - Unité ${index + 1}</td></tr>
                        <tr><th>Enseignant(s)</th><td>${ctx.enseignant || ''}</td></tr>
                        <tr><th>Titre de l'unité</th><td>${unit.titreUnite || unit.titre_unite || ''}</td></tr>
                        <tr><th>Groupe de matières et discipline</th><td>${ctx.matiere || ''}</td></tr>
                        <tr><th>Année du PEI</th><td>${ctx.classe || ''}</td></tr>
                        <tr><th>Durée de l'unité (heures)</th><td>${unit.duree || ''}</td></tr>
                        
                        <tr class="section-title"><td colspan="2">Recherche : définition de l'objectif de l'unité</td></tr>
                        <tr><th>Concept clé</th><td>${unit.conceptCle || unit.concept_cle || ''}</td></tr>
                        <tr><th>Concept(s) connexe(s)</th><td>${(unit.conceptsConnexes || unit.concepts_connexes || []).join(', ')}</td></tr>
                        <tr><th>Contexte mondial</th><td>${unit.contexteMondial || unit.contexte_mondial || ''}</td></tr>
                        <tr><th>Énoncé de recherche</th><td>${unit.enonceDeRecherche || unit.enonce_recherche || ''}</td></tr>
                        <tr><th>Questions de recherche</th><td>
                            <b>Factuelle(s):</b> <ul>${qsF.map(q => `<li>${q}</li>`).join('')}</ul>
                            <b>Conceptuelle(s):</b> <ul>${qsC.map(q => `<li>${q}</li>`).join('')}</ul>
                            <b>Invitant au débat:</b> <ul>${qsD.map(q => `<li>${q}</li>`).join('')}</ul>
                        </td></tr>

                        <tr><th>Objectifs spécifiques</th><td>${(unit.objectifsSpecifiques || unit.objectifs_specifiques || []).join('<br>')}</td></tr>
                    </table>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
        // Bind eval buttons
        resultsDiv.querySelectorAll('[data-eval]').forEach(btn=>{
          btn.addEventListener('click', async ()=>{
            const idx = parseInt(btn.getAttribute('data-eval'),10);
            const unite = unites[idx];
            const resp = await fetch('/api/generate-eval', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ matiere: ctx.matiere, classe: ctx.classe, unite }) });
            const blob = await resp.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Evaluation_${Date.now()}.docx`;
            a.click();
          });
        });
    }
});
