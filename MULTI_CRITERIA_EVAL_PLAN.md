# Plan de Mise en Œuvre : Système d'Évaluation Multi-Critères

## Contexte

L'utilisateur souhaite que les évaluations générées ressemblent à l'exemple fourni (PDF Sciences PEI2, 11 pages) avec :
- **Plusieurs critères dans UN seul document** (ex: A + C ensemble)
- **Exercices variés et concrets** : QCM, mots croisés, schémas, graphiques, questions ouvertes
- **Format structuré** : Page 1 = tableau récapitulatif, Pages suivantes = exercices détaillés

## État Actuel vs. Cible

### Système Actuel ✗
- ✗ Génère UN document par critère
- ✗ Exercices génériques (texte simple)
- ✗ Pas de variété dans les types d'exercices
- ✗ Template simple avec boucle unique

### Système Cible ✓
- ✓ Un seul document pour tous les critères sélectionnés
- ✓ 4-6 exercices variés par évaluation
- ✓ Types d'exercices : QCM, questions ouvertes, analyse de données, schémas
- ✓ Page 1 : Tableau récapitulatif multi-critères
- ✓ Pages suivantes : Exercices détaillés avec espaces de réponse

## Architecture Proposée

### 1. Nouveau Template Word

**Fichier** : `public/templates/evaluation_multi_criteres_template.docx`

**Structure** :
```
Page 1 - En-tête et Récapitulatif:
  - Nom/prénom, Classe: {annee_pei}
  - Titre: Évaluation de {groupe_matiere}
  - Énoncé: {enonce_de_recherche}
  - {#criteres_summary} LOOP
    - Critère {lettre_critere} : {nom_critere}
    - Maximum : 8
    - {#sous_criteres} LOOP
      - {roman}. {description_courte}
      - → {titre_exercice}
    - {/sous_criteres}
  - {/criteres_summary}

Pages suivantes - Exercices:
  - {#exercices} LOOP
    - Exercice {numero} : {titre}
    - Critère {critere_ref} : {sous_critere_ref} - {objectif_ref}
    - {contenu}
    - {#answer_lines} LOOP (espace de réponse)
    - {/answer_lines}
  - {/exercices}
```

**✅ FAIT** : Template créé

### 2. Modifications API (`api/generate-eval.js`)

#### 2.1 Nouvelle Signature d'Entrée
```javascript
POST /api/generate-eval-multi
{
  "matiere": "Sciences",
  "classe": "PEI 2",
  "unite": {...},
  "criteres": ["A", "C"],  // Array au lieu d'un seul
  "nb_exercices": 5  // Optionnel, par défaut 4-5
}
```

#### 2.2 Fonction Principale : `generateMultiCriteriaEvaluation`
```javascript
async function generateMultiCriteriaEvaluation({
  matiere, classe, unite, criteres
}) {
  // 1. Récupérer les descripteurs pour tous les critères
  const descripteurs = {};
  const allSubCriteria = {};
  
  criteres.forEach(c => {
    descripteurs[c] = getDescripteurData(matiere, classe, c);
    allSubCriteria[c] = extractSubCriteria(descripteurs[c]);
  });
  
  // 2. Générer exercices variés avec Gemini
  const exercices = await generateVariedExercises({
    matiere,
    classe,
    unite,
    criteres,
    allSubCriteria,
    descripteurs
  });
  
  // 3. Préparer données pour template
  const dataToRender = {
    annee_pei: classe,
    groupe_matiere: matiere,
    enonce_de_recherche: unite.enonce_recherche,
    
    criteres_summary: criteres.map(c => ({
      lettre_critere: c,
      nom_critere: descripteurs[c].titre,
      sous_criteres: Object.entries(allSubCriteria[c]).map(([roman, desc]) => ({
        roman,
        description_courte: desc.substring(0, 60) + '...',
        titre_exercice: findExerciceForSubCriteria(exercices, c, roman)
      }))
    })),
    
    exercices: exercices  // Array of {numero, titre, critere_ref, contenu, answer_lines}
  };
  
  // 4. Rendre template
  return renderTemplate(NEW_TEMPLATE_PATH, dataToRender);
}
```

#### 2.3 Générateur d'Exercices Variés
```javascript
async function generateVariedExercises({
  matiere, classe, unite, criteres, allSubCriteria, descripteurs
}) {
  const prompt = `Tu es un expert en évaluation PEI IB.

Matière: ${matiere}
Niveau: ${classe}
Unité: ${unite.titre}
Énoncé de recherche: ${unite.enonce_recherche}

Critères à évaluer: ${criteres.join(', ')}
${buildSubCriteriaContext(criteres, allSubCriteria, descripteurs)}

GÉNÈRE 4-6 EXERCICES VARIÉS qui évaluent ces sous-critères:

Types d'exercices à mélanger:
1. **QCM** (Critère A.i souvent) : 3-5 questions à choix multiples
2. **Questions ouvertes** (Critères A.iii, C.ii, C.iii) : Questions nécessitant justification
3. **Analyse de données** (Critère C.i, C.ii) : Tableaux, graphiques à interpréter
4. **Application pratique** (Critère A.ii) : Problèmes concrets

IMPORTANT:
- Chaque exercice doit être CONCRET et DÉTAILLÉ
- Référencer explicitement le critère/sous-critère évalué
- Varier les types d'exercices
- Adapter au contexte de l'unité "${unite.titre}"

Réponds en JSON strict:
{
  "exercices": [
    {
      "numero": 1,
      "titre": "Résumé des connaissances sur...",
      "type": "qcm",
      "critere_ref": "A",
      "sous_critere_ref": "i",
      "objectif_ref": "décrire des connaissances scientifiques",
      "contenu": "1. Question a) \\n• Réponse 1\\n• Réponse 2 (correcte)\\n...\\n\\n2. Question b)...",
      "answer_lines": 0  // Pas besoin de lignes pour QCM
    },
    {
      "numero": 2,
      "titre": "Analyse d'un phénomène",
      "type": "question_ouverte",
      "critere_ref": "A",
      "sous_critere_ref": "iii",
      "objectif_ref": "analyser des informations",
      "contenu": "[Contexte détaillé]\\n\\nQuestion: Analysez... en justifiant...",
      "answer_lines": 5
    },
    ...
  ]
}`;

  // Appel Gemini comme précédemment
  const response = await callGeminiAPI(prompt);
  return response.exercices;
}
```

### 3. Modifications UI (`public/script.js`)

#### 3.1 Sélection Multi-Critères
```html
<!-- Dans index.html -->
<div>
  <label>Critères à évaluer:</label>
  <div>
    <input type="checkbox" name="critere" value="A" checked> Critère A (Connaissances)
    <input type="checkbox" name="critere" value="B"> Critère B (Recherche)
    <input type="checkbox" name="critere" value="C"> Critère C (Traitement)
    <input type="checkbox" name="critere" value="D"> Critère D (Réflexion)
  </div>
</div>
```

```javascript
// Dans script.js
async function generateEvaluation(uniteIndex) {
  const selectedCriteria = Array.from(
    document.querySelectorAll('input[name="critere"]:checked')
  ).map(cb => cb.value);
  
  if (selected Criteria.length === 0) {
    alert('Sélectionnez au moins un critère');
    return;
  }
  
  const response = await fetch('/api/generate-eval-multi', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      matiere,
      classe,
      unite: unites[uniteIndex],
      criteres: selectedCriteria
    })
  });
  
  // Download DOCX
  const blob = await response.blob();
  downloadFile(blob, `Evaluation_Multi_Criteres_${Date.now()}.docx`);
}
```

### 4. Fallback Sans IA

Si `GEMINI_API_KEY` manquant, générer des exercices basiques:
```javascript
function generateDefaultExercises(criteres, allSubCriteria) {
  const exercices = [];
  let numero = 1;
  
  criteres.forEach(c => {
    Object.entries(allSubCriteria[c]).forEach(([roman, desc]) => {
      exercices.push({
        numero: numero++,
        titre: `Évaluation ${c}.${roman}`,
        type: 'question_ouverte',
        critere_ref: c,
        sous_critere_ref: roman,
        objectif_ref: desc.substring(0, 50),
        contenu: `Réalisez une tâche qui démontre : ${desc}\\n\\nConsignes: (À compléter par l'enseignant)`,
        answer_lines: 5
      });
    });
  });
  
  return exercices.slice(0, 5);  // Limit to 5 exercises
}
```

## Planning d'Implémentation

### Phase 1 : Core Multi-Critères (PRIORITÉ)
1. ✅ Template créé
2. ⏳ Créer `/api/generate-eval-multi` endpoint
3. ⏳ Implémenter `generateMultiCriteriaEvaluation`
4. ⏳ Implémenter `generateVariedExercises` avec Gemini
5. ⏳ Tester avec exemple Sciences PEI2 (A+C)

### Phase 2 : UI & UX
6. ⏳ Ajouter checkboxes multi-critères dans UI
7. ⏳ Bouton "Générer évaluation multi-critères"
8. ⏳ Gérer téléchargement et affichage

### Phase 3 : Améliorations (Optionnel)
9. Support images/diagrammes dans exercices
10. Templates personnalisés par matière
11. Export PDF en plus de DOCX

## Tests & Validation

**Test Case 1** : Sciences PEI2, Critères A+C
- Unité : Changements d'état
- Attendu : 4-5 exercices variés (QCM, questions ouvertes, analyse graphique)

**Test Case 2** : Langue et Littérature PEI3, Critères A+B+D
- Unité : Analyse littéraire
- Attendu : Exercices adaptés (analyse de texte, questions de compréhension, réflexion)

## Compatibility

**Ancien système** (1 critère / 1 doc) reste fonctionnel via :
- `/api/generate-eval` (ancien endpoint)
- `evaluation_template.docx` (ancien template)

**Nouveau système** (multi-critères) :
- `/api/generate-eval-multi` (nouveau endpoint)
- `evaluation_multi_criteres_template.docx` (nouveau template)

L'UI offrira les deux options.

## Notes Techniques

- **Docxtemplater** : Boucles imbriquées supportées
- **Gemini API** : Utiliser modèle `gemini-2.5-flash` pour génération rapide
- **Longueur document** : Prévoir 8-12 pages pour 5 exercices
- **Format réponses** : Lignes pointillées pour écriture manuscrite

## Prochaine Étape Immédiate

Créer la nouvelle route `/api/generate-eval-multi.js` et implémenter le générateur d'exercices variés avec Gemini.
