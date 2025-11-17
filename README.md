# Générateur d'Unités PEI

Application web pour générer automatiquement des unités d'enseignement du Programme d'Éducation Intermédiaire (PEI) de l'IB.

## 🎯 Fonctionnalités

- **Interface intuitive** : Saisie facile des informations enseignant et des chapitres du programme
- **Génération automatique** : L'IA regroupe intelligemment les chapitres en unités cohérentes
- **Supports multiples** : 7 matières PEI supportées (Design, Langue et littérature, Acquisition de langues, etc.)
- **Export Word complet** : Génération de documents Word formatés selon les templates PEI
  - **Plans d'unité** : Tous les champs du template sont remplis (objectifs, évaluation, ressources, différenciation, réflexion)
  - **Évaluations critériées** : Documents avec exercices générés par IA selon les critères d'évaluation
- **Exercices générés par IA** : Gemini génère 3-4 exercices par critère (A.i, A.ii, B.i, etc.) adaptés au niveau
- **Personnalisation** : Génère 4 unités (ou 6 pour Langue et littérature)

## 📚 Matières supportées

1. **Design**
2. **Langue et littérature** (6 unités)
3. **Acquisition de langues**
4. **Individus et sociétés**
5. **Sciences**
6. **Mathématiques**
7. **Arts**

## 🚀 Installation

### Installation Locale

```bash
# Installer les dépendances Node.js
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Éditer .env et ajouter vos clés API
GEMINI_API_KEY="votre-clé-google-gemini"
MONGO_URL="mongodb+srv://..."

# Lancer le serveur de développement
npm run dev
```

### Déploiement sur Vercel

1. **Pré-requis** :
   - Compte Vercel
   - Repository GitHub

2. **Configuration** :
   ```bash
   # Configurer les variables d'environnement sur Vercel Dashboard:
   GEMINI_API_KEY=votre-clé-api
   MONGO_URL=votre-url-mongodb
   ```

3. **Déploiement** :
   - Push sur la branche `main`
   - Vercel déploie automatiquement
   - URL de production disponible immédiatement

4. **Vérification** :
   - Vérifier les logs Vercel pour confirmer le déploiement
   - Tester la génération d'unités
   - Les logs montreront quel modèle Gemini est utilisé

## 💻 Utilisation

```bash
# Lancer l'application
python app.py

# Accéder à l'interface web
# L'application sera disponible sur http://localhost:5000
```

## 📝 Processus de génération

### Étape 1: Informations générales
- Nom de l'enseignant(e)
- Matière (parmi les 7 disponibles)
- Année du PEI (1-2, 3-4, ou 5)

### Étape 2: Saisie des chapitres
- Titre du chapitre
- Contenu/Description
- Durée en heures

L'application regroupe automatiquement les chapitres similaires en unités cohérentes.

### Étape 3: Résultats
- Visualisation des unités générées
- Pour chaque unité:
  - Titre engageant
  - Durée totale
  - Concept clé et concepts connexes
  - Contexte mondial
  - Énoncé de recherche
  - Questions de recherche (factuelles, conceptuelles, débat)
  - Objectifs spécifiques
- **Export Plans d'unité** : Documents Word complets avec tous les champs remplis
  - Objectifs spécifiques
  - Évaluation sommative et formative
  - Approches de l'apprentissage
  - Contenu et processus d'apprentissage
  - Ressources pédagogiques
  - Stratégies de différenciation
  - Réflexion (avant/pendant/après l'enseignement)
- **Export Évaluations** : Documents d'évaluation critériée avec:
  - Exercices générés par IA adaptés aux critères (A, B, C, D)
  - Grilles d'évaluation avec descripteurs de niveaux (1-2, 3-4, 5-6, 7-8)
  - Espaces de travail pour les élèves

## 🤖 Intelligence Artificielle

L'application utilise **Google Gemini AI** pour:
- Analyser les chapitres fournis
- Identifier les thèmes communs
- Regrouper intelligemment les chapitres
- Générer des énoncés de recherche pertinents
- Formuler des questions de recherche appropriées
- Sélectionner les concepts et objectifs adaptés
- **Générer des exercices d'évaluation** :
  - 3-4 exercices par critère d'évaluation (A, B, C, D)
  - Adaptés au niveau de l'élève (débutant/compétent/expérimenté)
  - Basés sur les descripteurs PEI officiels
  - Alignés avec les objectifs spécifiques de l'unité

### 🛡️ Système de Fallback Robuste

L'application implémente une **stratégie de haute disponibilité** avec:

1. **Multi-Model Fallback** : Essaie automatiquement 4 modèles Gemini dans l'ordre :
   - `gemini-2.5-flash` (principal)
   - `gemini-2.0-flash` (fallback 1)
   - `gemini-2.5-flash-lite` (fallback 2)
   - `gemini-2.0-flash-lite` (fallback 3)

2. **Retry Logic Intelligent** :
   - 3 tentatives par modèle
   - Exponential backoff (1s, 2s, 4s)
   - Gestion automatique des surcharges (503)

3. **Disponibilité** : ~99.9% grâce aux 4 modèles de fallback

**Note**: Configurez `GEMINI_API_KEY` dans les variables d'environnement.

## 📄 Structure des documents Word générés

### Plan d'Unité
Le document de plan comprend **tous les champs remplis** :

1. **En-tête** : Informations enseignant, matière, année, durée
2. **Recherche** : Concepts clés, concepts connexes, contexte mondial, énoncé de recherche, questions de recherche
3. **Objectifs spécifiques** : Critères d'évaluation détaillés
4. **Évaluation sommative** : Description des évaluations selon les critères
5. **Approches de l'apprentissage** : Compétences développées (pensée critique, communication, etc.)
6. **Contenu et processus d'apprentissage** : Détails des chapitres et activités
7. **Ressources** : Manuels, ressources numériques, matériel nécessaire
8. **Différenciation** : Stratégies d'adaptation selon les besoins des élèves
9. **Évaluation formative** : Observations, questionnements, quizz formatifs
10. **Réflexion** : Sections avant/pendant/après l'enseignement

### Évaluation Critériée
Le document d'évaluation comprend :

1. **En-tête** : Titre de l'unité, matière, année, énoncé de recherche
2. **Objectifs spécifiques** : Liste des objectifs évalués
3. **Exercices d'évaluation** : Générés par IA pour chaque critère
   - 3-4 exercices par critère (A, B, C, D)
   - Adaptés au niveau et au contenu de l'unité
   - Basés sur les descripteurs PEI officiels
4. **Grilles d'évaluation** : Pour chaque critère
   - Titre du critère (ex: "Critère A : Connaissance et compréhension")
   - Tableau des descripteurs par niveaux (1-2, 3-4, 5-6, 7-8)
   - Espaces de travail pour les élèves

## 🛠️ Technologies utilisées

- **Backend**: Node.js (Vercel Serverless Functions)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **IA**: Google Gemini 2.5 Flash (avec fallback multi-modèles)
- **Base de données**: MongoDB Atlas
- **Documents**: docx (génération Word)
- **Déploiement**: Vercel
- **Gestion Excel**: xlsx (pour upload de chapitres)

## 📂 Structure du projet

```
webapp/
├── api/
│   ├── index.js                     # API Vercel serverless
│   └── descripteurs-complets.js    # Descripteurs PEI officiels
├── public/
│   ├── index.html                   # Interface utilisateur
│   ├── styles.css                   # Styles CSS
│   └── script.js                    # Logique frontend
├── package.json                     # Dépendances Node.js
├── vercel.json                      # Configuration Vercel
└── generated_units/                 # Documents générés (local)
```

## 🎓 Basé sur le Programme PEI de l'IB

Cette application respecte scrupuleusement les directives du Programme d'Éducation Intermédiaire (PEI) de l'Organisation du Baccalauréat International (IB), incluant:

- Concepts clés et concepts connexes officiels
- Contextes mondiaux
- Objectifs spécifiques par année et par matière
- Structure de recherche recommandée

## 🔧 Troubleshooting

### Erreur 404 "Model not found"
✅ **Déjà résolu** : L'application utilise maintenant des modèles Gemini 2.x (série active)
- Les modèles Gemini 1.5 sont retirés par Google
- Le système essaie automatiquement les modèles disponibles

### Erreur 503 "Service Unavailable"
✅ **Déjà résolu** : Retry automatique avec exponential backoff
- 3 tentatives par modèle
- Fallback vers d'autres modèles si nécessaire
- Délais intelligents entre tentatives (1s, 2s, 4s)

### Erreur MongoDB Connection
Vérifiez :
- `MONGO_URL` est configuré dans les variables d'environnement
- L'URL MongoDB est correcte et accessible
- IP de Vercel est whitelistée dans MongoDB Atlas

### Logs de Débogage
Sur Vercel, consultez les logs pour voir :
- Quel modèle Gemini est utilisé
- Les tentatives de retry
- Les erreurs détaillées

## 📧 Support

Pour toute question ou suggestion d'amélioration, veuillez contacter l'équipe de développement.

## 📜 Licence

Ce projet est développé pour un usage éducatif dans le cadre du Programme PEI de l'IB.
