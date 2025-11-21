# Format d'Évaluation V2 - Documentation

## 📋 Vue d'ensemble

Cette nouvelle version de génération d'évaluation (V2) génère des documents Word avec un **format structuré exact** comprenant 3 tableaux distincts, conforme aux standards PEI.

## 🎯 Format du Document

### Structure Complète

```
Nom et prénom : ………….……. Classe: {Classe PEI}

Évaluation de {Matière} (Unité {Titre de l'unité})
(Critère {Lettre})
Énoncé de recherche : {Énoncé}

Tableau 1:
┌──────────────┬────────────────────┬──────────┐
│ Critère X    │ Nom de critère     │ Note /8  │
├──────────────┼────────────────────┼──────────┤
│ X            │ [Nom du critère]   │          │
└──────────────┴────────────────────┴──────────┘

Les apprenants seront évalués sur le critère X (Nom du critère) et ils seront capables de :

Tableau 2 :
┌──────────────┬──────┬──────┬──────┬──────┐
│ Critère X    │ 1-2  │ 3-4  │ 5-6  │ 7-8  │
├──────────────┼──────┼──────┼──────┼──────┤
│ i : [nom]    │      │      │      │      │
│ ii : [nom]   │      │      │      │      │
│ iii : [nom]  │      │      │      │      │
└──────────────┴──────┴──────┴──────┴──────┘

Tableau 3 : Descripteurs de niveaux
┌─────────┬────────────────────────────────────────┐
│ Niveau  │ Descripteurs de niveaux                │
├─────────┼────────────────────────────────────────┤
│ 1-2     │ [Descripteur complet niveau 1-2]      │
│ 3-4     │ [Descripteur complet niveau 3-4]      │
│ 5-6     │ [Descripteur complet niveau 5-6]      │
│ 7-8     │ [Descripteur complet niveau 7-8]      │
└─────────┴────────────────────────────────────────┘

[PAGE SUIVANTE]

Exercices

Exercice 1 : X.i (nom du sous-critère)
[Énoncé détaillé de l'exercice avec consignes]

Réponse :
_________________________________________________________
_________________________________________________________
_________________________________________________________
_________________________________________________________
_________________________________________________________

Exercice 2 : X.ii (nom du sous-critère)
[...]
```

## 🚀 Utilisation

### 1. Via l'API

**Endpoint:** `POST /api/generate-eval-v2`

**Requête:**
```json
{
  "matiere": "Sciences",
  "classe": "PEI 1",
  "unite": {
    "titreUnite": "Les forces et le mouvement",
    "enonceDeRecherche": "Comment les forces influencent-elles le mouvement des objets?",
    "objectifs_specifiques_detailles": [
      {
        "critere": "A",
        "sous_critere": "i",
        "description": "Expliquer un problème ou une question"
      }
    ]
  },
  "criteres": ["A"]
}
```

**Réponse:**
- Fichier Word (.docx) téléchargeable
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 2. Via la Page de Test

Accédez à `/test-eval.html` pour tester la génération avec une interface simple :

1. Sélectionnez la matière
2. Sélectionnez la classe
3. Entrez le titre de l'unité
4. Entrez l'énoncé de recherche
5. Sélectionnez le critère à évaluer
6. Cliquez sur "Générer l'évaluation"

Le document Word sera téléchargé automatiquement.

## 🔧 Fonctionnalités Techniques

### 1. Génération Programmatique

Le document est créé **programmatiquement** avec la bibliothèque `docx` (Node.js), sans utiliser de template Word pré-existant. Cela permet :

- ✅ Contrôle total sur la structure
- ✅ Pas de problèmes de compatibilité de templates
- ✅ Flexibilité maximale
- ✅ Format exactement comme demandé

### 2. Extraction des Sous-Critères

Les sous-critères (i, ii, iii, iv, v) sont extraits automatiquement depuis :

1. **Priorité 1:** `objectifs_specifiques_detailles` de l'unité
2. **Priorité 2:** Parsing des descripteurs du critère

Exemple d'extraction depuis les descripteurs :
```javascript
// Texte: "L'élève : i. explique un problème ; ii. formule une hypothèse"
// Extrait: 
// {
//   "i": "explique un problème",
//   "ii": "formule une hypothèse"
// }
```

### 3. Génération des Exercices

#### Avec Gemini AI (si GEMINI_API_KEY disponible)
- Exercices détaillés et contextualisés
- Consignes précises (3-5 phrases minimum)
- Adaptés au niveau et à la matière
- Permettent d'évaluer les 4 niveaux de maîtrise

#### Fallback (sans clé API)
- Exercices génériques basés sur les descripteurs
- Structure standardisée avec consignes de base
- Toujours utilisables par l'enseignant

### 4. Tableaux avec Bordures

Tous les tableaux ont des bordures complètes :
- Bordures extérieures (top, bottom, left, right)
- Bordures intérieures (insideHorizontal, insideVertical)
- Style: lignes simples noires

## 📊 Différences avec V1

| Aspect | V1 (generate-eval.js) | V2 (generate-eval-v2.js) |
|--------|----------------------|--------------------------|
| Méthode | Template Word + docxtemplater | Génération programmatique |
| Format | Flexible selon template | **Format exact fixe** |
| Tableaux | Selon template | **3 tableaux structurés** |
| Sous-critères | Texte formaté | **Tableau détaillé** |
| Dépendances | pizzip, docxtemplater | **docx** |
| Flexibilité | Haute (template modifiable) | Moyenne (code modifiable) |
| Conformité | Variable | **100% conforme au format demandé** |

## 🎨 Personnalisation

Pour modifier le format, éditez `/api/generate-eval-v2.js` :

### Modifier les marges
```javascript
const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: 720,    // 0.5 inch = 720 twips
          bottom: 720,
          left: 1080,  // 0.75 inch = 1080 twips
          right: 1080
        }
      }
    },
    children: sections
  }]
});
```

### Modifier les styles de texte
```javascript
new TextRun({
  text: "Mon texte",
  bold: true,
  size: 24,  // en demi-points (24 = 12pt)
  color: "000000"
})
```

### Modifier les tableaux
```javascript
new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    // Personnaliser les bordures
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
  },
  rows: [...]
})
```

## 🔍 Débogage

### Logs de génération

L'API log des informations utiles :

```
[INFO] Generate Eval V2 Request received
[INFO] Génération pour le critère: A
[INFO] 3 sous-critères trouvés pour A
[INFO] Génération des exercices avec Gemini
[INFO] Création du document Word...
[INFO] Génération du buffer...
[INFO] Document généré avec succès, taille: 9136
```

### Test local

Utilisez le script de test :
```bash
node test-eval-v2.js
```

Cela génère `test_evaluation.docx` dans le répertoire racine.

## 📦 Dépendances

### Nouvelles dépendances ajoutées

```json
{
  "docx": "^8.x.x"  // Création de documents Word
}
```

### Installation

```bash
npm install docx
```

## 🔐 Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `GEMINI_API_KEY` | Clé API Gemini pour génération des exercices | Non (fallback activé) |

Si `GEMINI_API_KEY` n'est pas défini, le système utilise des exercices par défaut basés sur les descripteurs.

## 🚢 Déploiement

### Vercel

Le routing est déjà configuré dans `vercel.json` :

```json
{
  "rewrites": [
    { "source": "/api/generate-eval-v2", "destination": "/api/generate-eval-v2.js" }
  ]
}
```

### Déploiement manuel

```bash
vercel --prod
```

## 📝 Exemples de Matières Supportées

- Sciences
- Mathématiques
- Design
- Langue et littérature
- Acquisition de langues
- Individus et sociétés
- Arts

Tous les critères A, B, C, D sont supportés selon la matière et le niveau PEI (1-5).

## 🐛 Problèmes Connus

### ⚠️ Limite : Un seul critère par génération

La V2 génère **un document par critère**. Si vous avez besoin d'évaluer plusieurs critères, générez plusieurs documents.

**Raison:** Le format demandé est conçu pour un seul critère à la fois (Tableau 1 contient une seule ligne de données).

### Solution pour multiples critères

```javascript
// Générer un document pour chaque critère
for (const critere of ['A', 'B', 'C']) {
  await fetch('/api/generate-eval-v2', {
    body: JSON.stringify({ 
      ...data, 
      criteres: [critere] 
    })
  });
}
```

## ✅ Validation du Format

Le document généré respecte :

- ✅ En-tête avec "Nom et prénom" et "Classe"
- ✅ Titre "Évaluation de {matière} (Unité {titre})"
- ✅ Critère et énoncé de recherche
- ✅ Tableau 1 : Critère et note /8
- ✅ Tableau 2 : Sous-critères avec colonnes de niveaux
- ✅ Tableau 3 : Descripteurs de niveaux (4 niveaux)
- ✅ Section Exercices sur nouvelle page
- ✅ Espaces pour réponses

## 📞 Support

Pour toute question ou problème :

1. Consultez les logs dans la console/Vercel
2. Vérifiez le fichier de test `test-eval-v2.js`
3. Ouvrez le document généré dans Word pour validation

## 🔄 Migrations depuis V1

Pour migrer depuis V1 (template-based) vers V2 (programmatic) :

1. **Pas de migration de templates nécessaire** (V2 ne les utilise pas)
2. **L'API reste compatible** : même format de requête
3. **Changez l'endpoint** : `/api/generate-eval` → `/api/generate-eval-v2`

V1 reste disponible si vous préférez l'approche par template.

---

**Version:** 2.0  
**Date:** 21 Novembre 2025  
**Auteur:** GenSpark AI Developer
