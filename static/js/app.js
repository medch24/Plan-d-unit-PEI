// État global de l'application
const appState = {
    currentStep: 1,
    enseignant: '',
    matiere: '',
    annee_pei: '',
    chapitres: [],
    units: []
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application PEI initialisée');
    updateNbUnitesText();
});

// Navigation entre les étapes
function goToStep1() {
    hideAllSteps();
    document.getElementById('step1').classList.add('active');
    appState.currentStep = 1;
}

function goToStep2() {
    // Valider les données de l'étape 1
    const enseignant = document.getElementById('enseignant').value.trim();
    const matiere = document.getElementById('matiere').value;
    const annee_pei = document.getElementById('annee_pei').value;

    if (!enseignant || !matiere || !annee_pei) {
        showAlert('Veuillez remplir tous les champs requis', 'error');
        return;
    }

    appState.enseignant = enseignant;
    appState.matiere = matiere;
    appState.annee_pei = annee_pei;

    hideAllSteps();
    document.getElementById('step2').classList.add('active');
    appState.currentStep = 2;
    
    updateNbUnitesText();
}

function goToStep3() {
    hideAllSteps();
    document.getElementById('step3').classList.add('active');
    appState.currentStep = 3;
}

function hideAllSteps() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
}

function updateNbUnitesText() {
    const nbUnites = appState.matiere === 'langue_litterature' ? 6 : 4;
    const element = document.getElementById('nb-unites-text');
    if (element) {
        element.textContent = `${nbUnites} unités`;
    }
}

// Gestion des chapitres
let chapitreCounter = 1;

function addChapitre() {
    const container = document.getElementById('chapitres-container');
    const newChapitre = createChapitreElement(chapitreCounter);
    container.appendChild(newChapitre);
    chapitreCounter++;
    
    // Animation d'entrée
    setTimeout(() => {
        newChapitre.style.opacity = '1';
        newChapitre.style.transform = 'translateY(0)';
    }, 10);
}

function createChapitreElement(index) {
    const div = document.createElement('div');
    div.className = 'chapitre-item';
    div.setAttribute('data-index', index);
    div.style.opacity = '0';
    div.style.transform = 'translateY(20px)';
    div.style.transition = 'all 0.3s ease';
    
    div.innerHTML = `
        <div class="chapitre-header">
            <h3>Chapitre ${index + 1}</h3>
            <button class="btn-icon btn-remove" onclick="removeChapitre(${index})" title="Supprimer">
                ✕
            </button>
        </div>
        <div class="form-group">
            <label>Titre du chapitre :</label>
            <input type="text" class="chapitre-titre" placeholder="Ex: Introduction à la programmation">
        </div>
        <div class="form-group">
            <label>Contenu/Description :</label>
            <textarea class="chapitre-contenu" rows="3" placeholder="Décrivez le contenu du chapitre..."></textarea>
        </div>
        <div class="form-group">
            <label>Durée (heures) :</label>
            <input type="number" class="chapitre-duree" min="1" value="10">
        </div>
    `;
    
    return div;
}

function removeChapitre(index) {
    const chapitreElement = document.querySelector(`.chapitre-item[data-index="${index}"]`);
    if (chapitreElement) {
        // Animation de sortie
        chapitreElement.style.opacity = '0';
        chapitreElement.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            chapitreElement.remove();
            updateChapitreNumbers();
        }, 300);
    }
}

function updateChapitreNumbers() {
    const chapitres = document.querySelectorAll('.chapitre-item');
    chapitres.forEach((chapitre, index) => {
        const header = chapitre.querySelector('.chapitre-header h3');
        if (header) {
            header.textContent = `Chapitre ${index + 1}`;
        }
    });
}

function collectChapitres() {
    const chapitres = [];
    const chapitreElements = document.querySelectorAll('.chapitre-item');
    
    chapitreElements.forEach((element, index) => {
        const titre = element.querySelector('.chapitre-titre').value.trim();
        const contenu = element.querySelector('.chapitre-contenu').value.trim();
        const duree = parseInt(element.querySelector('.chapitre-duree').value) || 10;
        
        if (titre) {
            chapitres.push({
                id: index,
                titre: titre,
                contenu: contenu,
                duree: duree
            });
        }
    });
    
    return chapitres;
}

// Génération des unités
async function generateUnits() {
    const chapitres = collectChapitres();
    
    if (chapitres.length < 2) {
        showAlert('Veuillez ajouter au moins 2 chapitres', 'error');
        return;
    }
    
    appState.chapitres = chapitres;
    
    // Passer à l'étape 3 et afficher le loading
    goToStep3();
    document.getElementById('loading').style.display = 'block';
    document.getElementById('units-container').innerHTML = '';
    
    try {
        const response = await fetch('/api/generate-units', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matiere: appState.matiere,
                annee_pei: appState.annee_pei,
                enseignant: appState.enseignant,
                chapitres: chapitres
            })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la génération des unités');
        }
        
        const data = await response.json();
        appState.units = data.units;
        
        displayUnits(data.units);
        
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur lors de la génération des unités: ' + error.message, 'error');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayUnits(units) {
    const container = document.getElementById('units-container');
    container.innerHTML = '';
    
    if (!units || units.length === 0) {
        container.innerHTML = '<div class="alert alert-warning">Aucune unité générée</div>';
        return;
    }
    
    units.forEach((unit, index) => {
        const unitCard = createUnitCard(unit, index);
        container.appendChild(unitCard);
    });
}

function createUnitCard(unit, index) {
    const div = document.createElement('div');
    div.className = 'unit-card';
    
    const conceptsConnexes = Array.isArray(unit.concepts_connexes) 
        ? unit.concepts_connexes.join(', ') 
        : unit.concepts_connexes;
    
    const questionsFact = Array.isArray(unit.questions_factuelles)
        ? unit.questions_factuelles.map(q => `<li>${q}</li>`).join('')
        : `<li>${unit.questions_factuelles}</li>`;
    
    const questionsConcept = Array.isArray(unit.questions_conceptuelles)
        ? unit.questions_conceptuelles.map(q => `<li>${q}</li>`).join('')
        : `<li>${unit.questions_conceptuelles}</li>`;
    
    const questionsDebat = Array.isArray(unit.questions_debat)
        ? unit.questions_debat.map(q => `<li>${q}</li>`).join('')
        : `<li>${unit.questions_debat}</li>`;
    
    const objectifs = Array.isArray(unit.objectifs_specifiques)
        ? unit.objectifs_specifiques.map(o => `<span class="badge badge-primary">${o}</span>`).join('')
        : `<span class="badge badge-primary">${unit.objectifs_specifiques}</span>`;
    
    div.innerHTML = `
        <h3>📘 ${unit.titre_unite}</h3>
        
        <div class="unit-info">
            <div class="unit-info-item">
                <strong>⏱️ Durée:</strong>
                ${unit.duree} heures
            </div>
            <div class="unit-info-item">
                <strong>🔑 Concept clé:</strong>
                ${unit.concept_cle}
            </div>
            <div class="unit-info-item">
                <strong>🌐 Contexte mondial:</strong>
                ${unit.contexte_mondial}
            </div>
        </div>
        
        <div class="unit-section">
            <h4>🔗 Concepts connexes</h4>
            <p>${conceptsConnexes}</p>
        </div>
        
        <div class="unit-section">
            <h4>🔍 Énoncé de recherche</h4>
            <p><em>"${unit.enonce_recherche}"</em></p>
        </div>
        
        <div class="unit-section">
            <h4>❓ Questions de recherche</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <div>
                    <strong>Factuelles:</strong>
                    <ul>${questionsFact}</ul>
                </div>
                <div>
                    <strong>Conceptuelles:</strong>
                    <ul>${questionsConcept}</ul>
                </div>
                <div>
                    <strong>Invitant au débat:</strong>
                    <ul>${questionsDebat}</ul>
                </div>
            </div>
        </div>
        
        <div class="unit-section">
            <h4>🎯 Objectifs spécifiques</h4>
            <div>${objectifs}</div>
        </div>
        
        <div class="unit-actions">
            <button class="btn btn-success" onclick="downloadUnitDocument(${index})">
                📥 Télécharger en Word
            </button>
        </div>
    `;
    
    return div;
}

async function downloadUnitDocument(unitIndex) {
    const unit = appState.units[unitIndex];
    
    if (!unit) {
        showAlert('Unité non trouvée', 'error');
        return;
    }
    
    try {
        showAlert('Génération du document en cours...', 'warning');
        
        const response = await fetch('/api/generate-document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unite: unit,
                matiere: appState.matiere,
                annee_pei: appState.annee_pei,
                enseignant: appState.enseignant
            })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la génération du document');
        }
        
        const data = await response.json();
        
        // Télécharger le fichier
        window.location.href = data.download_url;
        
        showAlert('Document généré avec succès!', 'success');
        
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Erreur lors de la génération du document: ' + error.message, 'error');
    }
}

async function downloadAllUnits() {
    if (appState.units.length === 0) {
        showAlert('Aucune unité à télécharger', 'warning');
        return;
    }
    
    showAlert(`Génération de ${appState.units.length} documents...`, 'warning');
    
    for (let i = 0; i < appState.units.length; i++) {
        await downloadUnitDocument(i);
        // Petite pause entre les téléchargements
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    showAlert('Tous les documents ont été générés!', 'success');
}

// Utilitaires
function showAlert(message, type = 'success') {
    // Créer l'élément d'alerte
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.style.maxWidth = '500px';
    alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alert.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(alert);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Écouter les changements de matière pour mettre à jour le nombre d'unités
document.addEventListener('DOMContentLoaded', function() {
    const matiereSelect = document.getElementById('matiere');
    if (matiereSelect) {
        matiereSelect.addEventListener('change', function() {
            appState.matiere = this.value;
            updateNbUnitesText();
        });
    }
});
