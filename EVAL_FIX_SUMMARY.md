# Corrections Apportées au Système d'Évaluation

## Problème Initial
- Le document Word d'évaluation généré était complètement vide
- Les balises du template n'étaient pas remplies

## Causes Identifiées

### 1. Structure de données incorrecte
Le template utilisait une boucle parente `{#objectifs}` qui englobait tout le contenu, mais le code fournissait un objet au lieu d'un tableau.

**Solution**: Transformer `objectifs` en tableau à un élément : `objectifs: [{...}]`

### 2. Syntaxe incompatible des balises
Le template original utilisait `{this.index}` et `{this.description}` dans la boucle `{#taches}`, ce qui n'est pas supporté par docxtemplater standard.

**Solution**: Modifier le template Word pour utiliser `{index}` et `{description}` (sans `this.`)

### 3. Imbrication des boucles
Le template a cette structure :
```
{annee_pei}                  <- racine
{#objectifs}                 <- boucle parent
  {groupe_matiere}
  {titre_unite}
  {objectifs_specifiques}
  {enonce_de_recherche}
  {lettre_critere}
  {nom_objectif_specifique}
  {#taches}                  <- boucle imbriquée
    {index}
    {description}
  {/taches}
  {#descripteurs}            <- boucle imbriquée
    {niveaux}
    {descripteur}
  {/descripteurs}
{/objectifs}
```

**Solution**: Structurer les données exactement selon cette hiérarchie avec `objectifs` comme tableau contenant un objet avec toutes les propriétés et sous-boucles

## Résultat

✅ Les évaluations se génèrent maintenant avec tous les champs remplis :
- Année PEI (classe)
- Matière
- Titre de l'unité
- Objectifs spécifiques (sous-critères)
- Énoncé de recherche
- Critère et nom de l'objectif
- Liste des tâches/exercices (boucle sur sous-critères)
- Descripteurs de niveaux 1-2, 3-4, 5-6, 7-8

## Génération des Exercices

Deux modes disponibles :

1. **Avec GEMINI_API_KEY** : Génération d'exercices détaillés via IA pour chaque sous-critère
2. **Sans clé API** : Exercices "fallback" détaillés construits à partir des descripteurs officiels

## Fichiers Modifiés

- `public/templates/evaluation_template.docx` - Template corrigé (balises {index} et {description})
- `api/generate-eval.js` - Structure de données corrigée + fallback robuste

## Test

Un document de test a été généré avec succès contenant :
- Toutes les métadonnées (PEI 3, Sciences, etc.)
- 3 exercices détaillés (D.i, D.ii, D.iii)
- 4 niveaux de descripteurs
- Contenu complet et structuré

## Pull Request

https://github.com/medch24/Plan-d-unit-PEI/pull/20

Tous les commits sont poussés sur la branche `feature/eval-template-and-fallback`
