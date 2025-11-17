# Documentation Technique - Générateur d'Unités PEI

## 🏗️ Architecture de l'Application

### Vue d'ensemble

L'application est construite avec une architecture client-serveur classique :

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   Flask     │────────▶│   Claude    │
│  (Browser)  │         │   Server    │         │     AI      │
│  HTML/CSS/JS│◀────────│   Python    │◀────────│  (Anthropic)│
└─────────────┘         └─────────────┘         └─────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │  python-docx│
                        │   (Export)  │
                        └─────────────┘
```

## 📁 Structure des Fichiers

```
webapp/
├── app.py                          # Application Flask principale
├── matieres_data_complete.py       # Base de données des matières PEI
├── requirements.txt                # Dépendances Python
├── test_generation.py              # Tests automatisés
├── .env.example                    # Template de configuration
├── .gitignore                      # Fichiers à ignorer par Git
├── README.md                       # Documentation générale
├── GUIDE_UTILISATION.md            # Guide utilisateur
├── DOCUMENTATION_TECHNIQUE.md      # Ce fichier
│
├── templates/
│   └── index.html                  # Interface utilisateur
│
├── static/
│   ├── css/
│   │   └── styles.css              # Styles CSS
│   └── js/
│       └── app.js                  # Logique client JavaScript
│
└── generated_units/                # Documents Word générés (gitignore)
```

## 🔧 Composants Principaux

### 1. Backend (app.py)

#### Routes API

**GET /**
- **Description**: Page principale de l'application
- **Retour**: HTML de l'interface utilisateur

**GET /api/matieres**
- **Description**: Liste toutes les matières disponibles
- **Retour**: JSON `{"matiere_id": {"nom": "Nom de la matière"}}`

**GET /api/matiere/{matiere_id}**
- **Description**: Détails d'une matière spécifique
- **Paramètres**: `matiere_id` (string)
- **Retour**: JSON avec concepts, objectifs, etc.

**POST /api/generate-units**
- **Description**: Génère les unités PEI
- **Body JSON**:
  ```json
  {
    "matiere": "design",
    "annee_pei": "pei1-2",
    "enseignant": "Marie Dupont",
    "chapitres": [
      {
        "id": 0,
        "titre": "Titre du chapitre",
        "contenu": "Description...",
        "duree": 10
      }
    ]
  }
  ```
- **Retour**: JSON avec les unités générées

**POST /api/generate-document**
- **Description**: Génère un document Word pour une unité
- **Body JSON**:
  ```json
  {
    "unite": {...},
    "matiere": "design",
    "annee_pei": "pei1-2",
    "enseignant": "Marie Dupont"
  }
  ```
- **Retour**: JSON avec URL de téléchargement

**GET /download/{filename}**
- **Description**: Télécharge un document généré
- **Paramètres**: `filename` (string)
- **Retour**: Fichier Word

#### Fonctions Principales

**generate_units_with_ai()**
- Utilise Claude AI pour analyser et regrouper les chapitres
- Fallback sur `generate_units_basic()` si pas d'API
- Génère les énoncés de recherche et questions

**create_word_document()**
- Charge le template Word
- Remplace les placeholders par les données de l'unité
- Sauvegarde le document généré

**format_objectifs_specifiques()**
- Formate les objectifs selon la matière et l'année
- Retourne un texte structuré par critère (A, B, C, D)

### 2. Frontend (HTML/CSS/JS)

#### Structure HTML (index.html)

- **Step 1**: Formulaire d'informations générales
- **Step 2**: Saisie des chapitres (dynamique)
- **Step 3**: Affichage des résultats

#### Logique JavaScript (app.js)

**État de l'application**
```javascript
const appState = {
    currentStep: 1,
    enseignant: '',
    matiere: '',
    annee_pei: '',
    chapitres: [],
    units: []
};
```

**Fonctions principales**:
- `goToStep1/2/3()`: Navigation entre étapes
- `addChapitre()`: Ajoute un champ de chapitre
- `removeChapitre()`: Supprime un chapitre
- `collectChapitres()`: Collecte les données des chapitres
- `generateUnits()`: Envoie la requête de génération
- `displayUnits()`: Affiche les unités générées
- `downloadUnitDocument()`: Télécharge un document

### 3. Base de Données (matieres_data_complete.py)

#### Structure des données

```python
MATIERES_DATA_COMPLETE = {
    "matiere_id": {
        "nom": "Nom de la matière",
        "concepts_cles": ["Concept1", "Concept2", ...],
        "concepts_connexes": ["Concept1", "Concept2", ...],
        "criteres": ["A: ...", "B: ...", "C: ...", "D: ..."],
        "objectifs": {
            "pei1-2": {
                "A": ["i. ...", "ii. ...", ...],
                "B": [...],
                "C": [...],
                "D": [...]
            },
            "pei3-4": {...},
            "pei5": {...}
        }
    }
}
```

## 🤖 Intégration Claude AI

### Prompt Structure

Le prompt envoyé à Claude contient:
1. Rôle: Expert en pédagogie PEI
2. Contexte: Chapitres, concepts disponibles
3. Tâche: Regrouper en N unités cohérentes
4. Format: JSON structuré

### Exemple de prompt

```
Tu es un expert en pédagogie du Programme d'Éducation 
Intermédiaire (PEI) de l'IB.

Voici les chapitres d'un programme pour la matière 
"Design" en année pei1-2:

[JSON des chapitres]

Voici les concepts clés disponibles: ...
Voici les concepts connexes disponibles: ...
Voici les contextes mondiaux disponibles: ...

Tu dois générer EXACTEMENT 4 unités pédagogiques en 
regroupant les chapitres par thèmes cohérents.

Pour chaque unité, fournis:
1. titre_unite: Un titre engageant
2. chapitres_inclus: Les identifiants des chapitres
3. duree: Durée totale en heures
4. concept_cle: Un concept clé
5. concepts_connexes: 2-3 concepts connexes
6. contexte_mondial: Un contexte mondial
7. enonce_recherche: Énoncé de recherche stimulant
8. questions_factuelles: 2-3 questions
9. questions_conceptuelles: 2-3 questions
10. questions_debat: 2-3 questions
11. objectifs_specifiques: Les objectifs (format: "A.i, A.ii, ...")

Réponds UNIQUEMENT en JSON valide.
```

### Gestion des erreurs

```python
try:
    # Utiliser Claude AI
    response = client.messages.create(...)
    result = json.loads(response_text)
except Exception as e:
    print(f"Erreur IA: {e}")
    # Fallback vers génération basique
    return generate_units_basic(...)
```

## 📄 Génération de Documents Word

### Template PEI

Le template Word (`Unité PEI.docx`) contient:
- Tableaux avec placeholders `{variable}`
- Structure conforme au PEI
- Sections pré-formatées

### Placeholders

- `{enseignant}`: Nom de l'enseignant
- `{groupe_matiere}`: Nom de la matière
- `{titre_unite}`: Titre de l'unité
- `{annee_pei}`: Année PEI (1-2, 3-4, 5)
- `{duree}`: Durée en heures
- `{concept_cle}`: Concept clé
- `{concepts_connexes}`: Liste des concepts connexes
- `{contexte_mondial}`: Contexte mondial
- `{enonce_de_recherche}`: Énoncé de recherche
- `{questions_factuelles}`: Questions factuelles
- `{questions_conceptuelles}`: Questions conceptuelles
- `{questions_debat}`: Questions de débat
- `{objectifs_specifiques}`: Objectifs formatés

### Processus de remplacement

```python
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            text = cell.text
            text = text.replace('{placeholder}', value)
            cell.text = text
```

## 🧪 Tests

### Tests automatisés (test_generation.py)

1. **Test de récupération des matières**
   - Vérifie que toutes les 7 matières sont disponibles

2. **Test de génération Design**
   - Génère 4 unités pour Design (PEI 1-2)
   - Vérifie la structure des unités

3. **Test de génération Langue et littérature**
   - Génère 6 unités pour Langue et littérature (PEI 3-4)
   - Vérifie que le nombre est correct

### Exécution des tests

```bash
cd /home/user/webapp
python test_generation.py
```

## 🔐 Sécurité

### Variables d'environnement

```bash
export ANTHROPIC_API_KEY="votre-clé-api"
```

### Validation des entrées

- Vérification des champs requis côté client et serveur
- Validation du format JSON
- Sanitization des données utilisateur

### Limitations

- Maximum 100 chapitres par génération
- Durée maximale: 1000 heures par chapitre
- Taille maximale du titre: 200 caractères

## 🚀 Déploiement

### Développement

```bash
python app.py
# Serveur accessible sur http://localhost:5000
```

### Production (exemple avec Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (optionnel)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🔧 Configuration

### Variables d'environnement

- `ANTHROPIC_API_KEY`: Clé API Claude (optionnel)
- `FLASK_ENV`: `development` ou `production`
- `FLASK_DEBUG`: `True` ou `False`

### Paramètres de l'application

Dans `app.py`:
```python
app.config['GENERATED_UNITS_FOLDER'] = 'generated_units'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
```

## 📊 Performance

### Temps de réponse typiques

- Génération sans IA: < 1 seconde
- Génération avec IA: 3-10 secondes (selon Claude)
- Génération Word: < 2 secondes

### Optimisations possibles

1. **Cache**: Mettre en cache les générations similaires
2. **Async**: Utiliser asyncio pour les appels IA
3. **Worker**: Queue system (Celery) pour génération en arrière-plan
4. **CDN**: Servir les assets statiques via CDN

## 🐛 Dépannage

### Erreur: "Module not found"
```bash
pip install -r requirements.txt
```

### Erreur: "Template not found"
- Vérifier que le fichier `Unité PEI.docx` est présent
- Vérifier le chemin dans `app.py`

### Génération basique utilisée
- Vérifier la clé API Claude
- Vérifier la connexion internet
- Vérifier les logs pour les erreurs API

### Documents Word corrompus
- Vérifier que python-docx est à jour
- Vérifier que le template est valide
- Essayer de régénérer le template

## 📝 Maintenance

### Mise à jour des objectifs PEI

1. Modifier `matieres_data_complete.py`
2. Ajouter/modifier les objectifs par année
3. Tester avec `test_generation.py`
4. Commiter les changements

### Ajout d'une nouvelle matière

1. Ajouter dans `MATIERES_DATA_COMPLETE`
2. Définir concepts clés, concepts connexes
3. Définir objectifs pour chaque année PEI
4. Ajouter dans le select HTML
5. Tester la génération

### Mise à jour du template Word

1. Modifier `Unité PEI.docx`
2. Conserver les placeholders `{variable}`
3. Tester la génération
4. Vérifier le formatage

## 📚 Références

- [Flask Documentation](https://flask.palletsprojects.com/)
- [python-docx Documentation](https://python-docx.readthedocs.io/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Programme PEI de l'IB](https://www.ibo.org/fr/programmes/middle-years-programme/)

## 🤝 Contribution

### Guidelines

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

### Code Style

- Python: PEP 8
- JavaScript: ES6+
- CSS: BEM notation

### Tests

- Ajouter des tests pour toute nouvelle fonctionnalité
- S'assurer que tous les tests passent avant de commit

---

**Version**: 1.0  
**Dernière mise à jour**: Novembre 2024  
**Maintenu par**: Équipe de développement
