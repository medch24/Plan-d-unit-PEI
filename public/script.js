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
    document.getElementById('load-existing').addEventListener('click', loadFromDb);
    document.getElementById('excel-upload').addEventListener('change', handleExcelUpload);

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

    function handleExcelUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Get first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                
                // Clear existing rows except the first one
                tableBody.innerHTML = '';
                
                // Add rows from Excel
                let rowsAdded = 0;
                jsonData.forEach((row, index) => {
                    // Skip header row if it exists
                    if (index === 0 && (row[0] === 'Chapitre' || row[0] === 'chapitre')) return;
                    
                    const chapitre = row[0] ? String(row[0]).trim() : '';
                    const ressource = row[1] ? String(row[1]).trim() : '';
                    
                    if (chapitre) {
                        addRowWith(chapitre, ressource);
                        rowsAdded++;
                    }
                });
                
                alert(`✅ ${rowsAdded} chapitre(s) importé(s) depuis Excel!`);
                
            } catch (error) {
                console.error('Erreur lors de la lecture du fichier Excel:', error);
                alert('❌ Erreur lors de la lecture du fichier Excel. Assurez-vous que le format est correct.');
            }
        };
        
        reader.readAsArrayBuffer(file);
        
        // Reset file input
        event.target.value = '';
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

        const essai = parseInt(document.getElementById('essai').value,10) || 1;
        const data = { enseignant, classe, matiere, chapitres, essai };
        
        // 2. Afficher le chargement et préparer la requête
        loadingDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '';
        generateBtn.disabled = true;

        try {
            // save last form
            localStorage.setItem(SAVE_KEY, JSON.stringify({ enseignant, classe, matiere, chapitres }));
            
            console.log('[INFO] Sending request to /api/generate-units');
            
            // 3. Appeler l'API
            const response = await fetch('/api/generate-units', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('[INFO] Response status:', response.status);

            if (!response.ok) {
                let errorMessage = 'Une erreur est survenue lors de la génération.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    console.error('[ERROR] API error:', errorData);
                } catch (e) {
                    console.error('[ERROR] Failed to parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            const generatedData = await response.json();
            console.log('[INFO] Generated units:', generatedData.unites?.length || 0);
            
            // 4. Afficher les résultats
            displayResults(generatedData.unites, { enseignant, classe, matiere });
            
            // Save units to DB for this attempt essai 2 if requested later
            try {
                await fetch('/api/save-units', { 
                    method:'POST', 
                    headers:{'Content-Type':'application/json'}, 
                    body: JSON.stringify({ enseignant, classe, matiere, units: generatedData.unites, essai }) 
                });
                console.log('[INFO] Units saved to database');
            } catch (dbError) {
                console.warn('[WARN] Failed to save units to database:', dbError);
                // Don't fail the whole process if DB save fails
            }

        } catch (error) {
            console.error('[ERROR] Generation failed:', error);
            resultsDiv.innerHTML = `<div class="error-message"><strong>Erreur :</strong> ${error.message}<br><small>Consultez la console pour plus de détails.</small></div>`;
        } finally {
            // 5. Cacher le chargement
            loadingDiv.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }
    
    async function loadFromDb(){
        const enseignant = document.getElementById('enseignant').value.trim();
        const classe = document.getElementById('classe').value; const matiere = document.getElementById('matiere').value; const essai = parseInt(document.getElementById('essai').value,10)||1;
        if(!enseignant){ alert('Entrez le nom enseignant'); return; }
        loadingDiv.classList.remove('hidden');
        try {
            const url = `/api/units?enseignant=${encodeURIComponent(enseignant)}&classe=${encodeURIComponent(classe)}&matiere=${encodeURIComponent(matiere)}&essai=${essai}`;
            const r = await fetch(url); const j = await r.json();
            const last = (j.units||[]).slice(-1)[0];
            if(!last){ alert('Aucun enregistrement'); return; }
            displayResults(last.units || last.unites || [], { enseignant, classe, matiere });
        } catch(e){ alert('Erreur de chargement'); } finally { loadingDiv.classList.add('hidden'); }
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
                    <div style="padding:10px; text-align:right; display:flex; gap:8px; justify-content:flex-end">
                      <button class="btn-secondary" data-plan="${index}">Exporter le plan (Word)</button>
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
        // Export Plan buttons
        resultsDiv.querySelectorAll('[data-plan]').forEach(btn=>{
          btn.addEventListener('click', async ()=>{
            const idx = parseInt(btn.getAttribute('data-plan'),10);
            const unite = unites[idx];
            const resp = await fetch('/api/generate-plan-docx', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ enseignant: ctx.enseignant, matiere: ctx.matiere, classe: ctx.classe, unite }) });
            if (!resp.ok) {
              try { const err = await resp.json(); alert('Erreur génération plan: ' + (err.error || resp.status)); } catch(_) { alert('Erreur génération plan: ' + resp.status); }
              return;
            }
            const blob = await resp.blob();
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Plan_Unite_${Date.now()}.docx`; a.click();
          });
        });
        // Eval buttons
        resultsDiv.querySelectorAll('[data-eval]').forEach(btn=>{
          btn.addEventListener('click', async ()=>{
            const idx = parseInt(btn.getAttribute('data-eval'),10);
            const unite = unites[idx];
            const resp = await fetch('/api/generate-eval', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ matiere: ctx.matiere, classe: ctx.classe, unite }) });
            if (!resp.ok) {
              try { const err = await resp.json(); alert('Erreur génération évaluation: ' + (err.error || resp.status)); } catch(_) { alert('Erreur génération évaluation: ' + resp.status); }
              return;
            }
            const blob = await resp.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Evaluation_${Date.now()}.docx`;
            a.click();
          });
        });
    }
});
