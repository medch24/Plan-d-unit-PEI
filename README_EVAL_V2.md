# Générateur d'Évaluation PEI - Format Structuré V2

## 🎯 Qu'est-ce que c'est ?

Un générateur d'évaluations PEI qui crée des documents Word **avec le format exact** que vous avez demandé :

```
Nom et prénom : ………….……. Classe: PEI X

Évaluation de (matière) (Unité ...)
(Critère A/B/C/D)
Énoncé de recherche : ......

Tableau 1: Critère | Nom de critère | Note /8

Tableau 2: Sous-critères avec colonnes 1-2, 3-4, 5-6, 7-8

Tableau 3: Descripteurs de niveaux complets

Exercices : Un par sous-critère avec espace pour réponses
```

## 🚀 Démarrage Rapide

### Option 1 : Interface Web (Recommandé)

1. Ouvrez votre navigateur et allez sur : **`/test-eval.html`**
2. Remplissez le formulaire :
   - Matière (Sciences, Mathématiques, Design, etc.)
   - Classe (PEI 1-5)
   - Titre de l'unité
   - Énoncé de recherche
   - Critère à évaluer (A, B, C ou D)
3. Cliquez sur **"Générer l'évaluation"**
4. Le document Word se télécharge automatiquement ! 📄

### Option 2 : Via API

**Endpoint:** `POST /api/generate-eval-v2`

**Exemple de requête (JavaScript):**

```javascript
const response = await fetch('/api/generate-eval-v2', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    matiere: 'Sciences',
    classe: 'PEI 1',
    unite: {
      titreUnite: 'Les forces et le mouvement',
      enonceDeRecherche: 'Comment les forces influencent-elles le mouvement?'
    },
    criteres: ['A']
  })
});

const blob = await response.blob();
// Télécharger le fichier Word
```

**Exemple avec curl:**

```bash
curl -X POST http://localhost:3000/api/generate-eval-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "matiere": "Sciences",
    "classe": "PEI 1",
    "unite": {
      "titreUnite": "Les forces",
      "enonceDeRecherche": "Comment les forces influencent le mouvement?"
    },
    "criteres": ["A"]
  }' \
  --output evaluation.docx
```

## 📋 Ce que vous obtenez

### Format du Document

1. **En-tête** : Nom et classe de l'élève
2. **Titre** : Évaluation de [matière] (Unité [titre])
3. **Tableau 1** : Critère évalué et note sur 8
4. **Tableau 2** : Sous-critères (i, ii, iii...) avec colonnes pour les 4 niveaux
5. **Tableau 3** : Descripteurs détaillés des 4 niveaux (1-2, 3-4, 5-6, 7-8)
6. **Exercices** : Un exercice par sous-critère avec espace pour réponses

### Exemple de Tableau 2

```
┌──────────────┬──────┬──────┬──────┬──────┐
│ Critère A    │ 1-2  │ 3-4  │ 5-6  │ 7-8  │
├──────────────┼──────┼──────┼──────┼──────┤
│ i : Expli-   │      │      │      │      │
│     quer un  │      │      │      │      │
│     problème │      │      │      │      │
├──────────────┼──────┼──────┼──────┼──────┤
│ ii : Formu-  │      │      │      │      │
│      ler une │      │      │      │      │
│      hypothè │      │      │      │      │
└──────────────┴──────┴──────┴──────┴──────┘
```

## 🎓 Matières et Critères Supportés

### Matières
- ✅ Sciences
- ✅ Mathématiques
- ✅ Design
- ✅ Langue et littérature
- ✅ Acquisition de langues
- ✅ Individus et sociétés
- ✅ Arts

### Niveaux PEI
- PEI 1
- PEI 2
- PEI 3
- PEI 4
- PEI 5

### Critères (selon la matière)
- **A** : Recherche et conception / Compréhension / etc.
- **B** : Traitement et évaluation / Communication / etc.
- **C** : Réflexion sur les répercussions
- **D** : Réflexion sur les compétences

## 🤖 Génération d'Exercices Automatique

### Avec Gemini AI

Si vous configurez `GEMINI_API_KEY`, les exercices sont :
- ✨ **Contextualisés** à votre unité
- ✨ **Détaillés** avec consignes précises
- ✨ **Adaptés** au niveau PEI
- ✨ **Pertinents** pour chaque sous-critère

**Exemple d'exercice généré :**

> **Exercice A.i (Expliquer un problème scientifique)**
> 
> En lien avec l'unité "Les forces et le mouvement" et l'énoncé de recherche "Comment les forces influencent-elles le mouvement des objets?", réalisez une production qui démontre votre capacité à expliquer un problème scientifique.
>
> **Consignes :**
> 1. Situez le problème dans un contexte réel (par exemple, un objet qui tombe, une voiture qui freine, etc.) - 2-3 phrases
> 2. Expliquez la démarche scientifique à suivre pour étudier ce problème - 3-4 phrases
> 3. Identifiez les variables importantes et expliquez leur rôle
> 4. Justifiez pourquoi ce problème est intéressant à étudier scientifiquement
> 5. Indiquez comment vous pourriez vérifier votre compréhension du problème

### Sans Gemini (Fallback)

Si pas de clé API, des exercices génériques sont créés :
- 📝 Basés sur les descripteurs officiels PEI
- 📝 Structure standardisée avec consignes de base
- 📝 Modifiables par l'enseignant après génération

## ⚙️ Configuration (Optionnel)

### Variable d'Environnement

Pour activer la génération intelligente d'exercices :

```bash
# Dans votre fichier .env ou dans Vercel
GEMINI_API_KEY=votre_clé_api_gemini
```

**Comment obtenir une clé :**
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Copiez-la dans vos variables d'environnement

**Sans clé API :** Le système fonctionne quand même avec des exercices par défaut ! 👍

## 🔧 Installation Locale

Si vous voulez tester en local :

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd webapp

# 2. Installer les dépendances
npm install

# 3. (Optionnel) Configurer Gemini
echo "GEMINI_API_KEY=votre_clé" > .env

# 4. Tester la génération
node test-eval-v2.js

# 5. Un fichier test_evaluation.docx sera créé !
```

## 📊 Comparaison V1 vs V2

| Caractéristique | V1 (Original) | V2 (Nouveau) |
|----------------|---------------|--------------|
| Format | Template Word modifiable | **Format fixe structuré** |
| Tableaux | Selon template | **3 tableaux standardisés** |
| Sous-critères | Texte simple | **Tableau détaillé** |
| Conformité | Variable | **100% conforme** |
| Configuration | Template à créer | **Aucune configuration** |
| Flexibilité | Haute | Moyenne |

**Quand utiliser V2 ?**
- ✅ Vous voulez le format exact avec 3 tableaux
- ✅ Vous ne voulez pas gérer de templates
- ✅ Vous voulez un résultat standardisé

**Quand utiliser V1 ?**
- ✅ Vous avez déjà des templates personnalisés
- ✅ Vous voulez un format complètement personnalisable

## 🐛 Résolution de Problèmes

### Le document ne se télécharge pas

**Solution :**
1. Vérifiez la console du navigateur (F12)
2. Regardez les erreurs réseau
3. Essayez avec un autre navigateur

### Les exercices sont génériques

**Cause :** Pas de `GEMINI_API_KEY` configurée

**Solutions :**
- Ajoutez votre clé API Gemini
- Ou utilisez les exercices par défaut et modifiez-les après génération

### Le critère n'est pas trouvé

**Cause :** Combinaison matière/classe/critère invalide

**Solution :**
- Vérifiez que la matière supporte ce critère
- Vérifiez le niveau PEI (1-5)
- Consultez la documentation PEI officielle

### Erreur "Matière non trouvée"

**Solution :**
- Vérifiez l'orthographe exacte
- Matières valides : Sciences, Mathématiques, Design, Langue et littérature, Acquisition de langues, Individus et sociétés, Arts

## 📄 Documentation Complète

Pour plus de détails techniques, consultez :
- **`EVAL_V2_FORMAT.md`** : Documentation technique complète
- **`TEMPLATE_STRUCTURE.md`** : Structure des templates (V1)
- **`CONFIGURATION.md`** : Configuration des variables d'environnement

## 🤝 Support

Besoin d'aide ?
1. Consultez les logs dans la console du navigateur
2. Testez avec `test-eval-v2.js` en local
3. Vérifiez que vos données sont correctes
4. Ouvrez le document généré dans Word pour validation

## 🎉 Exemple Complet

```javascript
// Générer une évaluation pour Sciences PEI 1, Critère A
const reponse = await fetch('/api/generate-eval-v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    matiere: 'Sciences',
    classe: 'PEI 1',
    unite: {
      titreUnite: 'Les forces et le mouvement',
      enonceDeRecherche: 'Comment les forces influencent-elles le mouvement des objets dans notre quotidien?'
    },
    criteres: ['A']  // Recherche et conception
  })
});

// Télécharger le fichier
const blob = await reponse.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'Evaluation_Sciences_PEI1_CritereA.docx';
a.click();

// ✅ Votre évaluation est prête !
```

---

**Bon enseignement ! 📚✨**

*Fait avec ❤️ pour les enseignants PEI*
