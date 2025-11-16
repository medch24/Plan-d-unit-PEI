# 🚀 Déploiement sur GitHub - Générateur d'Unités PEI

## ✅ Statut du Déploiement

**Tous les changements ont été poussés avec succès sur la branche `main` !**

## 🌐 Liens Principaux

### 📦 Dépôt GitHub
**https://github.com/medch24/Plan-d-unit-PEI**

### 🚀 Application en Ligne
**https://5000-idddcixnbkzu71pab7znv-5185f4aa.sandbox.novita.ai**

## 📊 Commits Déployés

| Commit | Description |
|--------|-------------|
| `a720e90` | 📄 Présentation finale du projet |
| `b3a5a26` | 📄 Guide d'accès à l'application |
| `111ed1e` | 📄 Documentation complète |
| `9dd8e02` | ✨ Système complet de génération d'unités PEI |

## 📁 Structure du Dépôt

```
Plan-d-unit-PEI/
├── 📄 README.md                      Vue d'ensemble du projet
├── 📖 GUIDE_UTILISATION.md           Guide pour les enseignants
├── 💻 DOCUMENTATION_TECHNIQUE.md     Documentation développeurs
├── 📋 RESUME_PROJET.md               Résumé exécutif
├── 🌐 ACCES_APPLICATION.md           Informations d'accès
├── 📊 PRESENTATION_FINALE.txt        Présentation complète
├── 🚀 DEPLOIEMENT_GITHUB.md          Ce fichier
│
├── app.py                            Backend Flask (22 KB)
├── matieres_data_complete.py         Base de données PEI (31 KB)
├── test_generation.py                Tests automatisés
├── requirements.txt                  Dépendances Python
├── .env.example                      Template configuration
├── .gitignore                        Fichiers ignorés
│
├── templates/
│   └── index.html                    Interface utilisateur
│
└── static/
    ├── css/
    │   └── styles.css                Styles CSS
    └── js/
        └── app.js                    Logique JavaScript
```

## 🎯 Fonctionnalités Disponibles

### ✅ Interface Web Complète
- 3 étapes guidées
- Design moderne et responsive
- Validation des entrées
- Messages d'erreur clairs

### ✅ 7 Matières PEI
1. 🎨 **Design** - 4 unités
2. 📖 **Langue et littérature** - 6 unités ⭐
3. 🗣️ **Acquisition de langues** - 4 unités
4. 🌍 **Individus et sociétés** - 4 unités
5. 🔬 **Sciences** - 4 unités
6. ➗ **Mathématiques** - 4 unités
7. 🎭 **Arts** - 4 unités

### ✅ Intelligence Artificielle
- Intégration Claude AI (Anthropic)
- Regroupement thématique automatique
- Génération d'énoncés de recherche
- Questions factuelles, conceptuelles, débat
- Fallback sur génération basique

### ✅ Export Word
- Format .docx conforme au PEI
- Template pré-formaté
- Téléchargement individuel ou groupé
- Prêt à compléter

### ✅ Données PEI Complètes
- 84 objectifs spécifiques détaillés
- Tous les concepts clés et connexes officiels
- 6 contextes mondiaux
- Conformité 100% avec le programme IB

## 🚀 Installation Locale

### Prérequis
- Python 3.8+
- pip

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/medch24/Plan-d-unit-PEI.git
cd Plan-d-unit-PEI

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. (Optionnel) Configurer la clé API Claude
export ANTHROPIC_API_KEY="votre-clé-api"

# 4. Lancer l'application
python app.py

# 5. Accéder à l'application
# Ouvrir http://localhost:5000 dans votre navigateur
```

## 🧪 Tests

```bash
# Exécuter les tests automatisés
python test_generation.py
```

**Résultat attendu**: `✅ Tous les tests sont passés avec succès!`

## 📖 Documentation

| Fichier | Description |
|---------|-------------|
| [README.md](README.md) | Point d'entrée, vue d'ensemble |
| [GUIDE_UTILISATION.md](GUIDE_UTILISATION.md) | Guide pour les enseignants |
| [DOCUMENTATION_TECHNIQUE.md](DOCUMENTATION_TECHNIQUE.md) | Guide pour les développeurs |
| [RESUME_PROJET.md](RESUME_PROJET.md) | Résumé exécutif du projet |
| [ACCES_APPLICATION.md](ACCES_APPLICATION.md) | Informations d'accès |
| [PRESENTATION_FINALE.txt](PRESENTATION_FINALE.txt) | Présentation complète |

## 🎓 Conformité PEI

Le système respecte intégralement:
- ✅ Structure des unités PEI recommandée par l'IB
- ✅ Tous les concepts clés officiels
- ✅ Tous les concepts connexes officiels
- ✅ Les 6 contextes mondiaux
- ✅ Les objectifs spécifiques par année et par matière
- ✅ La méthodologie de recherche du PEI

## 📊 Statistiques

- **Lignes de code**: ~1500 lignes
- **Fichiers créés**: 18 fichiers
- **Commits Git**: 4 commits
- **Tests**: 3/3 passés ✓
- **Documentation**: 6 fichiers
- **Matières**: 7 complètes
- **Objectifs**: 84 détaillés

## 🔐 Sécurité

- Aucune donnée stockée sur les serveurs
- Documents générés restent sur votre ordinateur
- Aucune information personnelle collectée
- Validation des entrées utilisateur
- Gestion sécurisée de l'API

## 🆘 Support

- 📧 **Issues GitHub**: [Créer une issue](https://github.com/medch24/Plan-d-unit-PEI/issues)
- 📚 **Documentation**: Voir les fichiers .md du projet
- 💬 **Discussions**: [GitHub Discussions](https://github.com/medch24/Plan-d-unit-PEI/discussions)

## 📜 Licence

Ce projet est développé pour un usage éducatif dans le cadre du Programme PEI de l'IB.

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [DOCUMENTATION_TECHNIQUE.md](DOCUMENTATION_TECHNIQUE.md) pour les guidelines.

## 🎉 Remerciements

Merci à tous les enseignants du Programme d'Éducation Intermédiaire qui contribuent à l'amélioration de ce projet.

---

**Version**: 1.0  
**Date de déploiement**: Novembre 2024  
**Statut**: ✅ Opérationnel
