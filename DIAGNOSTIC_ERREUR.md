# 🔍 Diagnostic des Erreurs - Génération d'Unités PEI

**Date**: 16 Novembre 2025  
**Commit**: `32739bd`

---

## ✅ Corrections Appliquées

### 1. **Amélioration du Logging**
- Ajout de messages `[DEBUG]` détaillés dans `app.py`
- Traceback complet en cas d'erreur
- Les logs apparaîtront dans les Function Logs de Vercel

### 2. **Meilleure Gestion du JSON**
- Utilisation de `request.get_json(force=True, silent=True)` comme fallback
- Vérification que les données ne sont pas `None`
- Message d'erreur clair si aucune donnée JSON reçue

### 3. **Affichage des Erreurs Détaillées**
- Le frontend affiche maintenant les détails complets de l'erreur
- Inclut le message d'erreur ET le traceback Python
- Facilite le diagnostic des problèmes

### 4. **Configuration Vercel Améliorée**
```json
{
  "functions": {
    "api/index.py": {
      "memory": 1024,      // Augmenté à 1GB
      "maxDuration": 60    // Timeout de 60 secondes
    }
  }
}
```

### 5. **Optimisation du Déploiement**
- Création de `.vercelignore` pour exclure les fichiers inutiles
- Réduction de la taille du package déployé

---

## 🧪 Tests à Effectuer

### Étape 1: Vérifier le Déploiement Vercel

1. **Accéder au Dashboard Vercel**:
   - URL: https://vercel.com/dashboard
   - Sélectionner le projet "Plan-d-unit-PEI"

2. **Vérifier le Statut**:
   - [ ] Un nouveau déploiement est apparu (commit `32739bd`)
   - [ ] Le statut est "Ready" ✅ (vert)
   - [ ] Pas d'erreurs dans les Build Logs

3. **Si le Build Échoue**:
   - Consulter les logs de build
   - Vérifier que tous les fichiers sont présents:
     - `api/index.py`
     - `app.py`
     - `matieres_data_complete.py`
     - `requirements.txt`
     - `public/Unité PEI.docx`

### Étape 2: Tester avec le Logging Activé

1. **Ouvrir l'Application** sur Vercel

2. **Remplir le Formulaire**:
   ```
   Enseignant: Test Debug
   Matière: Design
   Année PEI: PEI 1-2
   ```

3. **Ajouter des Chapitres**:
   ```
   Chapitre 1: Introduction - 4h
   Chapitre 2: Conception - 6h
   Chapitre 3: Prototype - 5h
   Chapitre 4: Tests - 4h
   ```

4. **Cliquer sur "Générer les Unités"**

5. **SI ERREUR APPARAÎT**:
   - Copier le message d'erreur complet (incluant le traceback)
   - Prendre une capture d'écran

6. **Consulter les Function Logs**:
   - Dashboard Vercel → Votre projet
   - Onglet "Deployments" → Cliquer sur le déploiement actif
   - Onglet "Function Logs"
   - Chercher les lignes avec `[DEBUG]` et `[ERROR]`

---

## 📊 Logs à Rechercher

### Logs Normaux (Succès)
```
[DEBUG] Received data: {...}
[DEBUG] matiere_id=design, annee_pei=pei1-2, enseignant=Test Debug
[DEBUG] chapitres count: 4
[DEBUG] Matiere data loaded: Design
[DEBUG] Generating 4 units
[DEBUG] generate_units_basic called with 4 chapitres, 4 units to generate
[DEBUG] Unit 1: chapitres from 0 to 1
[DEBUG] Unit 2: chapitres from 1 to 2
[DEBUG] Unit 3: chapitres from 2 to 3
[DEBUG] Unit 4: chapitres from 3 to 4
[DEBUG] Generated 4 units successfully
```

### Logs d'Erreur Possibles

#### Erreur 1: Données JSON Manquantes
```
[ERROR] No JSON data received
```
**Cause**: Le frontend n'envoie pas les données correctement  
**Solution**: Vérifier que le formulaire est bien rempli

#### Erreur 2: Matière Non Trouvée
```
[ERROR] Matière non trouvée: <matiere_id>
```
**Cause**: ID de matière invalide  
**Solution**: Vérifier que la matière existe dans `MATIERES_DATA`

#### Erreur 3: Import Error
```
[ERROR] ModuleNotFoundError: No module named 'anthropic'
```
**Cause**: Dépendances Python non installées  
**Solution**: Vérifier `requirements.txt` et forcer un redéploiement

#### Erreur 4: Template Non Trouvé
```
[ERROR] FileNotFoundError: [Errno 2] No such file or directory: '.../Unité PEI.docx'
```
**Cause**: Fichier template manquant  
**Solution**: Vérifier que `public/Unité PEI.docx` existe dans le dépôt

#### Erreur 5: Données Corrompues
```
[ERROR] KeyError: 'concepts_cles'
```
**Cause**: Structure des données incorrecte  
**Solution**: Vérifier `matieres_data_complete.py`

---

## 🔧 Solutions par Type d'Erreur

### Problème: Erreur 500 sans détails

**Diagnostic**:
1. Consulter les Function Logs sur Vercel
2. Chercher `[ERROR]` dans les logs
3. Identifier la ligne exacte qui échoue

**Solution Générale**:
```bash
# Forcer un redéploiement complet
# Sur Vercel Dashboard:
# Deployments → Redeploy (avec "Use existing build cache" DÉCOCHÉ)
```

### Problème: Erreur de timeout

**Symptômes**:
- La génération prend plus de 60 secondes
- Erreur "Function execution timed out"

**Solution**:
```json
// Dans vercel.json, augmenter maxDuration (déjà fait):
"maxDuration": 60
```

**Note**: Vercel Free tier limite à 10s, Pro tier jusqu'à 60s

### Problème: Out of Memory

**Symptômes**:
- Erreur "Out of memory"
- Processus tué pendant la génération

**Solution**:
```json
// Dans vercel.json, augmenter memory (déjà fait):
"memory": 1024
```

**Note**: Vercel Free tier limite à 1024MB

### Problème: Anthropic API Error

**Symptômes**:
```
[ERROR] anthropic.AuthenticationError
```

**Solution**:
1. C'est normal si la clé API n'est pas configurée
2. L'application devrait automatiquement basculer sur la génération basique
3. Pour activer l'IA: ajouter `ANTHROPIC_API_KEY` dans Vercel Environment Variables

---

## 📋 Checklist de Vérification

### Avant de Tester
- [ ] Nouveau déploiement Vercel terminé (commit `32739bd`)
- [ ] Status "Ready" dans Vercel Dashboard
- [ ] Pas d'erreurs dans les Build Logs

### Pendant le Test
- [ ] Formulaire rempli correctement
- [ ] Au moins 2 chapitres ajoutés
- [ ] Bouton "Générer les Unités" cliqué

### Après l'Erreur (Si applicable)
- [ ] Message d'erreur copié
- [ ] Capture d'écran prise
- [ ] Function Logs consultés
- [ ] Lignes `[DEBUG]` et `[ERROR]` identifiées

### Informations à Fournir
Si l'erreur persiste, fournir:
1. **Message d'erreur affiché** dans l'interface
2. **Function Logs** de Vercel (lignes avec `[DEBUG]` et `[ERROR]`)
3. **Capture d'écran** de l'erreur
4. **Données de test utilisées** (enseignant, matière, chapitres)

---

## 🎯 Résultats Attendus

### Après Génération Réussie

L'étape 3 devrait afficher 4 cartes d'unités (ou 6 pour Langue et Littérature) avec:

```
✨ Unité 1: Introduction au design
⏱️ Durée: 4 heures
🎯 Concept clé: Communautés
🔗 Concepts connexes: Adaptation, Collaboration, Durabilité
🌍 Contexte mondial: Identités et relations

📋 Énoncé de recherche:
Exploration de Introduction au design

❓ Questions factuelles:
• Quels sont les éléments clés de Introduction au design?
• Comment définir Introduction au design?

💭 Questions conceptuelles:
• Pourquoi Introduction au design est-il important?
• Comment Introduction au design influence-t-il notre compréhension?

🎙️ Questions de débat:
• Dans quelle mesure Introduction au design affecte-t-il notre société?
• Quel est l'impact de Introduction au design sur notre futur?

📄 [Bouton: Télécharger Word]
```

---

## 🆘 Besoin d'Aide?

Si après avoir suivi ce guide le problème persiste:

1. **Copier les Function Logs complets**:
   ```
   Vercel Dashboard → Deployments → Function Logs
   Copier toutes les lignes contenant [DEBUG] et [ERROR]
   ```

2. **Copier le message d'erreur frontend**:
   - Ouvrir la Console du navigateur (F12)
   - Onglet "Console"
   - Copier le message d'erreur complet

3. **Fournir ces informations** avec:
   - URL de l'application Vercel
   - Commit hash actuel
   - Données de test utilisées

---

**Dernier commit**: `32739bd` - "fix: Améliorer la gestion des erreurs et la configuration Vercel"  
**Fichiers modifiés**: `app.py`, `static/js/app.js`, `vercel.json`, `.vercelignore`
