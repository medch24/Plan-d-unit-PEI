# Configuration des Templates Word

## 📄 Templates Créés

Deux templates propres ont été créés avec des placeholders **non fragmentés** :

1. **`Plan_CLEAN_TEMPLATE.docx`** (37 KB)
   - 22 placeholders uniques
   - Structure complète du plan d'unité PEI

2. **`Eval_CLEAN_TEMPLATE.docx`** (37 KB)
   - 12 placeholders uniques
   - Grille d'évaluation critériée

## 🔧 Configuration Vercel

### Étape 1: Uploader les Templates

Uploadez les templates dans un emplacement accessible publiquement :

**Option A: Google Drive (Recommandé)**
1. Ouvrez Google Drive
2. Uploadez `Plan_CLEAN_TEMPLATE.docx` et `Eval_CLEAN_TEMPLATE.docx`
3. Clic droit → Partager → "Tout le monde avec le lien"
4. Copiez le lien de partage pour chaque fichier
5. Convertissez en lien de téléchargement direct :
   - Lien original: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Lien direct: `https://drive.google.com/uc?export=download&id=FILE_ID`

**Option B: GitHub Repository**
1. Créez un repo public sur GitHub
2. Uploadez les templates
3. Utilisez les URLs raw :
   - `https://raw.githubusercontent.com/USER/REPO/main/Plan_CLEAN_TEMPLATE.docx`
   - `https://raw.githubusercontent.com/USER/REPO/main/Eval_CLEAN_TEMPLATE.docx`

**Option C: Vercel Blob Storage**
```bash
npm install @vercel/blob
vercel blob upload Plan_CLEAN_TEMPLATE.docx
vercel blob upload Eval_CLEAN_TEMPLATE.docx
```

### Étape 2: Configurer Variables d'Environnement Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet "Plan-d-unit-PEI"
3. Settings → Environment Variables
4. Ajoutez les variables suivantes :

```env
PLAN_TEMPLATE_URL=<URL_DE_VOTRE_TEMPLATE_PLAN>
EVAL_TEMPLATE_URL=<URL_DE_VOTRE_TEMPLATE_EVAL>
```

**Exemple avec Google Drive:**
```env
PLAN_TEMPLATE_URL=https://drive.google.com/uc?export=download&id=1abc123xyz
EVAL_TEMPLATE_URL=https://drive.google.com/uc?export=download&id=1def456uvw
```

### Étape 3: Redéployer

Après avoir ajouté les variables d'environnement :
```bash
git push origin main
# Ou depuis Vercel Dashboard: Deployments → Redeploy
```

## 📋 Placeholders Disponibles

### Plan Template (22 placeholders)

**Informations de base:**
- `{enseignant}` - Nom de l'enseignant
- `{titre_unite}` - Titre de l'unité
- `{groupe_matiere}` - Matière (Sciences, Mathématiques, etc.)
- `{annee_pei}` - Année du PEI (Année 1-2, 3-4, ou 5)
- `{duree}` - Durée en heures

**Recherche:**
- `{concept_cle}` - Concept clé principal
- `{concepts_connexes}` - Concepts connexes (séparés par virgules)
- `{contexte_mondial}` - Contexte mondial
- `{enonce_de_recherche}` - Énoncé de recherche

**Questions:**
- `{questions_factuelles}` - Questions factuelles (séparées par \n)
- `{questions_conceptuelles}` - Questions conceptuelles
- `{questions_debat}` - Questions invitant au débat

**Objectifs:**
- `{objectifs_specifiques}` - Objectifs spécifiques (séparés par \n)

**Évaluation:**
- `{evaluation_sommative}` - Description évaluation sommative
- `{evaluation_formative}` - Description évaluation formative

**Apprentissage:**
- `{approches_apprentissage}` - Approches de l'apprentissage
- `{contenu}` - Contenu et processus d'apprentissage
- `{ressources}` - Ressources pédagogiques
- `{differenciation}` - Stratégies de différenciation

**Réflexion:**
- `{reflexion_avant}` - Réflexion avant l'enseignement
- `{reflexion_pendant}` - Réflexion pendant l'enseignement
- `{reflexion_apres}` - Réflexion après l'enseignement

### Eval Template (12 placeholders)

**En-tête:**
- `{groupe_matiere}` - Matière
- `{titre_unite}` - Titre de l'unité
- `{enonce_de_recherche}` - Énoncé de recherche
- `{annee_pei}` - Année du PEI

**Critère:**
- `{lettre_critere}` - Lettre du critère (A, B, C, D)
- `{nom_objectif_specifique}` - Nom du critère (ex: "Connaissance et compréhension")

**Contenu:**
- `{objectifs_specifiques}` - Liste des sous-critères (i, ii, iii, iv)
- `{exercices}` - Exercices générés par IA

**Descripteurs:**
- `{descripteur_1_2}` - Descripteur niveaux 1-2
- `{descripteur_3_4}` - Descripteur niveaux 3-4
- `{descripteur_5_6}` - Descripteur niveaux 5-6
- `{descripteur_7_8}` - Descripteur niveaux 7-8

## 🧪 Test Local

Pour tester les templates localement avant déploiement :

```bash
# 1. Créer un fichier .env.local
echo "PLAN_TEMPLATE_URL=./templates/Plan_CLEAN_TEMPLATE.docx" > .env.local
echo "EVAL_TEMPLATE_URL=./templates/Eval_CLEAN_TEMPLATE.docx" >> .env.local

# 2. Lancer le serveur local
npm run dev

# 3. Tester la génération
curl -X POST http://localhost:3000/api/generate-plan-docx \
  -H "Content-Type: application/json" \
  -d @test-data.json \
  --output test-plan.docx

# 4. Ouvrir dans Word
open test-plan.docx  # macOS
xdg-open test-plan.docx  # Linux
```

## ⚠️ Points Importants

1. **Ne jamais éditer les templates dans Word** - Cela fragmente les placeholders
2. **Utiliser le script Python** pour recréer les templates si nécessaire
3. **Vérifier les placeholders** avec `node verify-clean-templates.js`
4. **Tester après chaque modification** de template
5. **Les URLs doivent être accessibles publiquement** pour Vercel

## 🔧 Recréer les Templates

Si vous devez modifier les templates :

```bash
# 1. Éditer create-clean-templates.py
nano create-clean-templates.py

# 2. Recréer les templates
python3 create-clean-templates.py

# 3. Vérifier
node verify-clean-templates.js

# 4. Re-uploader sur votre plateforme de choix
```

## 📊 Structure de Données Attendue

### Pour `/api/generate-plan-docx`:

```json
{
  "enseignant": "M. Dupont",
  "matiere": "Sciences",
  "classe": "Année 3-4 du PEI",
  "unite": {
    "titre": "L'énergie",
    "duree": "6 semaines",
    "concept_cle": "Changement",
    "concepts_connexes": ["Énergie", "Systèmes"],
    "contexte_mondial": "Innovation scientifique",
    "enonce_recherche": "Comment l'énergie se transforme?",
    "questions_factuelles": ["Q1", "Q2"],
    "questions_conceptuelles": ["Q1"],
    "questions_debat": ["Q1"],
    "objectifs_specifiques": ["A.i", "A.ii"]
  }
}
```

### Pour `/api/generate-eval`:

```json
{
  "matiere": "Sciences",
  "classe": "Année 3-4 du PEI",
  "unite": {
    "titre": "L'énergie",
    "enonce_recherche": "Comment l'énergie se transforme?"
  },
  "criteres": ["A"]
}
```

## 🚀 Déploiement

Une fois configuré :

```bash
git add .
git commit -m "feat: add clean Word templates with proper placeholders"
git push origin main
```

Vercel redéploiera automatiquement avec les nouvelles variables d'environnement.
