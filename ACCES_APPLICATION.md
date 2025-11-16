# 🌐 Accès à l'Application - Générateur d'Unités PEI

## 🚀 Application en Ligne

**URL de l'application**: https://5000-idddcixnbkzu71pab7znv-5185f4aa.sandbox.novita.ai

### ✅ Statut : OPÉRATIONNEL

L'application est actuellement en ligne et prête à être utilisée !

## 📱 Comment Utiliser l'Application

### Étape 1: Accès
1. Ouvrez votre navigateur web
2. Accédez à l'URL ci-dessus
3. L'interface s'affiche automatiquement

### Étape 2: Configuration Initiale
1. **Nom de l'enseignant**: Entrez votre nom
   - Exemple: "Marie Dupont"

2. **Matière**: Choisissez parmi:
   - Design
   - Langue et littérature (génère 6 unités)
   - Acquisition de langues
   - Individus et sociétés
   - Sciences
   - Mathématiques
   - Arts

3. **Année du PEI**: Sélectionnez:
   - PEI 1 & 2 (Niveau débutant)
   - PEI 3 & 4 (Niveau intermédiaire)
   - PEI 5 (Niveau compétent)

4. Cliquez sur **"Suivant →"**

### Étape 3: Saisie des Chapitres
1. Pour chaque chapitre:
   - **Titre**: Ex: "Introduction à la programmation Python"
   - **Contenu**: Décrivez le contenu et les objectifs
   - **Durée**: Nombre d'heures (ex: 10)

2. **Ajouter d'autres chapitres**:
   - Cliquez sur **"+ Ajouter un chapitre"**
   - Minimum 2 chapitres requis

3. Cliquez sur **"Générer les Unités 🚀"**

### Étape 4: Résultats
1. **Visualisation**: Les unités générées s'affichent
2. **Téléchargement**: 
   - Clic sur **"📥 Télécharger en Word"** pour une unité
   - Ou **"Télécharger Toutes les Unités"** pour tout

## 💻 Lancer l'Application Localement

Si vous voulez exécuter l'application sur votre propre machine:

### Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Installation

```bash
# 1. Naviguer vers le dossier
cd /home/user/webapp

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. (Optionnel) Configurer la clé API Claude
export ANTHROPIC_API_KEY="votre-clé-api-ici"

# 4. Lancer l'application
python app.py
```

### Accès Local
Une fois lancée, l'application sera disponible sur:
- http://localhost:5000
- http://127.0.0.1:5000

## 🧪 Tester l'Application

Pour vérifier que tout fonctionne correctement:

```bash
# Exécuter les tests automatisés
cd /home/user/webapp
python test_generation.py
```

**Résultat attendu**: `✅ Tous les tests sont passés avec succès!`

## 🔑 Configuration API Claude (Optionnel)

L'application fonctionne en deux modes:

### Mode IA (Recommandé)
Avec une clé API Claude, l'IA analyse et regroupe intelligemment vos chapitres.

1. Obtenez une clé API sur: https://console.anthropic.com/
2. Configurez la variable d'environnement:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Ou créez un fichier `.env`:
```
ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
```

### Mode Basique (Fallback)
Sans clé API, l'application utilise un algorithme de regroupement simple mais efficace.

## 📊 Exemple d'Utilisation

### Exemple pour Design (PEI 1-2)

**Enseignant**: Jean Martin  
**Matière**: Design  
**Année**: PEI 1 & 2

**Chapitres saisis**:
1. Introduction au design thinking (8h)
2. Analyse de produits existants (10h)
3. Prototypage rapide (12h)
4. Tests et itération (8h)
5. Présentation de projet (6h)
6. Design durable (8h)

**Résultat**: 4 unités cohérentes générées avec:
- Titres engageants
- Concepts clés et connexes
- Contextes mondiaux
- Énoncés de recherche
- Questions (factuelles, conceptuelles, débat)
- Objectifs spécifiques

**Export**: 4 documents Word prêts à compléter

## 🎯 Matières Disponibles

| Matière | Nombre d'unités | Niveaux |
|---------|----------------|---------|
| Design | 4 | PEI 1-2, 3-4, 5 |
| Langue et littérature | 6 | PEI 1-2, 3-4, 5 |
| Acquisition de langues | 4 | PEI 1-2, 3-4, 5 |
| Individus et sociétés | 4 | PEI 1-2, 3-4, 5 |
| Sciences | 4 | PEI 1-2, 3-4, 5 |
| Mathématiques | 4 | PEI 1-2, 3-4, 5 |
| Arts | 4 | PEI 1-2, 3-4, 5 |

## 📁 Structure des Documents Générés

Chaque document Word contient:

### Sections Pré-remplies ✅
- Informations générales (enseignant, matière, année)
- Titre de l'unité
- Durée totale
- Concept clé
- Concepts connexes
- Contexte mondial
- Énoncé de recherche
- Questions de recherche (factuelles, conceptuelles, débat)
- Objectifs spécifiques

### Sections à Compléter ⬜
- Évaluation sommative
- Approches de l'apprentissage (ATL)
- Contenu et processus d'apprentissage
- Activités d'apprentissage
- Évaluation formative
- Différenciation
- Ressources
- Réflexions (avant, pendant, après)

## 🆘 Support et Aide

### Documentation Disponible
- 📖 **README.md**: Vue d'ensemble du projet
- 👤 **GUIDE_UTILISATION.md**: Guide utilisateur détaillé
- 💻 **DOCUMENTATION_TECHNIQUE.md**: Documentation pour développeurs
- 📋 **RESUME_PROJET.md**: Résumé du projet

### Problèmes Courants

**"Veuillez remplir tous les champs requis"**
→ Assurez-vous d'avoir rempli: nom, matière, et année PEI

**"Veuillez ajouter au moins 2 chapitres"**
→ Ajoutez au moins 2 chapitres avec des titres

**Le téléchargement ne fonctionne pas**
→ Vérifiez que les pop-ups ne sont pas bloqués dans votre navigateur

**Erreur lors de la génération**
→ Vérifiez votre connexion internet et réessayez

## 📞 Contact

Pour toute question ou suggestion:
- 📧 Email de support: support@example.com
- 📚 Documentation: Consultez les fichiers MD du projet
- 🐛 Rapporter un bug: Via le système de gestion de projet

## 🔒 Confidentialité

- Vos données ne sont pas stockées sur nos serveurs
- Les documents générés restent sur votre ordinateur
- Aucune information personnelle n'est collectée

## 🎓 À Propos du PEI

Le Programme d'Éducation Intermédiaire (PEI) de l'IB est conçu pour des élèves âgés de 11 à 16 ans. Il encourage les élèves à établir des liens concrets entre leurs études et le monde réel.

**En savoir plus**: https://www.ibo.org/fr/programmes/middle-years-programme/

---

**Version de l'application**: 1.0  
**Dernière mise à jour**: Novembre 2024  
**Statut**: ✅ OPÉRATIONNEL

---

## 🌟 Démarrage Rapide (TL;DR)

1. **Accéder**: https://5000-idddcixnbkzu71pab7znv-5185f4aa.sandbox.novita.ai
2. **Remplir**: Nom, matière, année PEI
3. **Ajouter**: Vos chapitres (titre, contenu, durée)
4. **Générer**: Cliquer sur "Générer les Unités"
5. **Télécharger**: Documents Word prêts à l'emploi

**C'est aussi simple que ça ! 🎉**
