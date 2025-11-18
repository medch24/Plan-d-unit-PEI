# Structure des Templates Word

Ce document explique la structure des données envoyées aux templates Word et les placeholders attendus.

## 📄 Template Plan d'Unité (`PLAN_TEMPLATE_URL`)

### Placeholders Simples

```
{enseignant}              - Nom de l'enseignant
{groupe_matiere}          - Nom de la matière (ex: Sciences, Design)
{annee_pei}              - Année PEI (ex: PEI 1, PEI 3)
{titre_unite}            - Titre de l'unité
{duree}                  - Durée en heures

{concept_cle}            - Concept clé principal
{concepts_connexes}      - Liste des concepts connexes (séparés par virgule)
{contexte_mondial}       - Contexte mondial choisi
{enonce_de_recherche}    - Énoncé de recherche

{questions_factuelles}   - Questions factuelles (avec bullet points)
{questions_conceptuelles} - Questions conceptuelles (avec bullet points)
{questions_debat}        - Questions invitant au débat (avec bullet points)

{objectifs_specifiques}  - Liste des objectifs (ex: A.i, B.ii)
{evaluation_sommative}   - Description de l'évaluation sommative
{approches_apprentissage} - Approches de l'apprentissage

{contenu}                - Contenu de l'unité
{processus_apprentissage} - Processus d'apprentissage
{ressources}             - Ressources nécessaires
{differenciation}        - Stratégies de différenciation
{evaluation_formative}   - Évaluation formative

{reflexion_avant}        - Réflexion avant l'enseignement
{reflexion_pendant}      - Réflexion pendant l'enseignement
{reflexion_apres}        - Réflexion après l'enseignement
```

### Exemple d'Utilisation dans Word

```
Enseignant: {enseignant}
Titre de l'unité: {titre_unite}
Groupe de matières et discipline: {groupe_matiere}
Année du PEI: {annee_pei}
Durée de l'unité (heures): {duree}

Recherche : définition de l'objectif de l'unité
Concept clé: {concept_cle}
Concept(s) connexe(s): {concepts_connexes}
...
```

## 📝 Template Évaluation (`EVAL_TEMPLATE_URL`)

### Placeholders Simples

```
{annee_pei}              - Année PEI
{groupe_matiere}         - Matière
{titre_unite}            - Titre de l'unité
{objectifs_specifiques}  - Sous-critères évalués (texte formaté)
{enonce_de_recherche}    - Énoncé de recherche

{lettre_critere}         - Lettre du critère (A, B, C, D)
{nom_objectif_specifique} - Nom du critère (ex: "Recherche et analyse")

{exercices}              - Texte des exercices (formaté)
{descripteur_1_2}        - Descripteur niveaux 1-2
{descripteur_3_4}        - Descripteur niveaux 3-4
{descripteur_5_6}        - Descripteur niveaux 5-6
{descripteur_7_8}        - Descripteur niveaux 7-8
```

### Placeholders avec Loops (Arrays)

#### Loop pour les Tâches/Exercices

Dans le template Word:
```
{#taches}
{this.index} {this.description}
{/taches}
```

Structure de données envoyée:
```javascript
taches: [
  { index: "A.i", description: "Exercice pour le sous-critère A.i..." },
  { index: "A.ii", description: "Exercice pour le sous-critère A.ii..." },
  { index: "A.iii", description: "Exercice pour le sous-critère A.iii..." }
]
```

#### Loop pour les Descripteurs

Dans le template Word:
```
{#descripteurs}
{niveaux} | {descripteur}
{/descripteurs}
```

Structure de données envoyée:
```javascript
descripteurs: [
  { niveaux: "1-2", descripteur: "L'élève : i. indique...", descripteurs: "..." },
  { niveaux: "3-4", descripteur: "L'élève : i. résume...", descripteurs: "..." },
  { niveaux: "5-6", descripteur: "L'élève : i. explique...", descripteurs: "..." },
  { niveaux: "7-8", descripteur: "L'élève : i. explique et justifie...", descripteurs: "..." }
]
```

Note: Les deux champs `descripteur` et `descripteurs` sont fournis pour compatibilité.

### Exemple de Structure dans Word

```
Critère {lettre_critere}: {nom_objectif_specifique}

Exercices:
{#taches}
{this.index}) {this.description}
{/taches}

Descripteurs de niveau:
| Niveaux | Descripteurs de niveaux |
|---------|-------------------------|
{#descripteurs}
| {niveaux} | {descripteur} |
{/descripteurs}
```

## 🔧 Configuration des Variables d'Environnement

Dans Vercel ou votre fichier `.env`:

```bash
# URL du template Plan d'Unité (Google Drive export link)
PLAN_TEMPLATE_URL=https://docs.google.com/document/d/YOUR_DOC_ID/export?format=docx

# URL du template Évaluation (Google Drive export link)
EVAL_TEMPLATE_URL=https://docs.google.com/document/d/YOUR_DOC_ID/export?format=docx
```

## 📋 Checklist de Validation Template

Avant d'utiliser un template, vérifiez:

- [ ] Le fichier est un vrai document Word (.docx)
- [ ] Les placeholders utilisent la syntaxe `{nom_variable}`
- [ ] Les loops utilisent `{#array}...{/array}` pour les tableaux
- [ ] Pas d'espaces dans les noms de placeholders
- [ ] Les noms correspondent exactement (case-sensitive)
- [ ] Le template peut être ouvert dans Word sans erreur
- [ ] L'URL est accessible publiquement

## 🐛 Debugging

Si le document généré ne s'ouvre pas:

1. **Vérifier les logs Vercel** pour voir:
   - Template downloaded, size: X bytes
   - Missing placeholder warnings
   - Stack traces d'erreurs

2. **Tester le template manuellement**:
   - Télécharger le template depuis l'URL
   - L'ouvrir dans Word
   - Vérifier que tous les placeholders sont bien formés

3. **Vérifier la structure des données**:
   - Consulter les logs de `dataToRender`
   - S'assurer que les arrays sont bien structurés
   - Vérifier que les valeurs ne sont pas `undefined`

## 📚 Documentation docxtemplater

Pour plus d'informations sur la syntaxe des templates:
- [Docxtemplater Documentation](https://docxtemplater.com/docs/get-started/)
- [Loops and Arrays](https://docxtemplater.com/docs/tag-types/#loops)
- [Conditions](https://docxtemplater.com/docs/tag-types/#conditions)
