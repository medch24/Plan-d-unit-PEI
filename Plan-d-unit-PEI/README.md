# Générateur d'Unités PEI

Application web pour générer automatiquement des unités d'enseignement du Programme d'Éducation Intermédiaire (PEI) de l'IB.

## 🎯 Fonctionnalités

- **Interface intuitive** : Saisie facile des informations enseignant et des chapitres du programme
- **Génération automatique** : L'IA regroupe intelligemment les chapitres en unités cohérentes
- **Supports multiples** : 7 matières PEI supportées (Design, Langue et littérature, Acquisition de langues, etc.)
- **Export Word** : Génération de documents Word formatés selon le template PEI
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

```bash
# Installer les dépendances
pip install -r requirements.txt

# Configurer la clé API Claude (optionnel mais recommandé)
export ANTHROPIC_API_KEY="your-api-key-here"
```

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
- Téléchargement individuel ou groupé en format Word

## 🤖 Intelligence Artificielle

L'application utilise Claude AI (Anthropic) pour:
- Analyser les chapitres fournis
- Identifier les thèmes communs
- Regrouper intelligemment les chapitres
- Générer des énoncés de recherche pertinents
- Formuler des questions de recherche appropriées
- Sélectionner les concepts et objectifs adaptés

**Note**: Si la clé API Claude n'est pas configurée, l'application bascule sur un mode de génération basique.

## 📄 Structure du document Word généré

Le document Word généré comprend:

1. **En-tête** : Informations enseignant, matière, année, durée
2. **Recherche** : Concepts clés, concepts connexes, contexte mondial, énoncé de recherche, questions de recherche
3. **Objectifs spécifiques** : Critères d'évaluation détaillés
4. **Sections vides** : À compléter par l'enseignant
   - Évaluation sommative
   - Approches de l'apprentissage
   - Contenu et processus d'apprentissage
   - Ressources
   - Réflexions

## 🛠️ Technologies utilisées

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **IA**: Claude 3.5 Sonnet (Anthropic)
- **Documents**: python-docx

## 📂 Structure du projet

```
webapp/
├── app.py                      # Application Flask principale
├── matieres_data_complete.py   # Données complètes des matières PEI
├── requirements.txt            # Dépendances Python
├── templates/
│   └── index.html             # Interface utilisateur
├── static/
│   ├── css/
│   │   └── styles.css         # Styles CSS
│   └── js/
│       └── app.js             # Logique JavaScript
└── generated_units/           # Documents Word générés
```

## 🎓 Basé sur le Programme PEI de l'IB

Cette application respecte scrupuleusement les directives du Programme d'Éducation Intermédiaire (PEI) de l'Organisation du Baccalauréat International (IB), incluant:

- Concepts clés et concepts connexes officiels
- Contextes mondiaux
- Objectifs spécifiques par année et par matière
- Structure de recherche recommandée

## 📧 Support

Pour toute question ou suggestion d'amélioration, veuillez contacter l'équipe de développement.

## 📜 Licence

Ce projet est développé pour un usage éducatif dans le cadre du Programme PEI de l'IB.
