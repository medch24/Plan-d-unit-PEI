# ✅ Checklist de Vérification Vercel

## 🎯 Objectif
Vérifier que le déploiement Vercel fonctionne correctement après les corrections apportées.

---

## 📋 Étapes de Vérification

### 1. ✅ Vérifier le Redéploiement Automatique

**Action**: Aller sur votre dashboard Vercel
- URL: https://vercel.com/dashboard
- Chercher le projet: `Plan-d-unit-PEI` (ou nom similaire)

**À vérifier**:
- [ ] Un nouveau déploiement est en cours ou terminé
- [ ] Le commit affiché est `a699c57` ou plus récent
- [ ] Le statut est "Ready" (vert)
- [ ] Pas d'erreurs dans les logs de build

**Si le déploiement ne démarre pas automatiquement**:
- Cliquer sur le projet
- Aller dans l'onglet "Deployments"
- Cliquer sur "Redeploy" pour le dernier déploiement

---

### 2. ✅ Tester l'Application Déployée

**Action**: Accéder à l'URL de votre application Vercel
- Format: `https://votre-projet.vercel.app`

**Tests à effectuer**:

#### Test 1: Page d'accueil
- [ ] La page se charge correctement (pas d'erreur 404/500)
- [ ] Les 3 étapes sont visibles
- [ ] Le formulaire de l'étape 1 est fonctionnel

#### Test 2: Sélection de matière
- [ ] Le menu déroulant "Matière" affiche les 7 options:
  - Design
  - Langue et Littérature
  - Individus et Sociétés
  - Sciences
  - Mathématiques
  - Éducation Physique et à la Santé
  - Arts

#### Test 3: Ajout de chapitres
- [ ] Remplir les informations de l'étape 1:
  ```
  Enseignant: Test
  Matière: Design
  Année PEI: PEI 1-2
  ```
- [ ] Cliquer sur "Suivant ▶"
- [ ] L'étape 2 s'affiche
- [ ] Ajouter 3-4 chapitres exemple:
  ```
  Chapitre 1: Introduction au design
  Chapitre 2: Principes de conception
  Chapitre 3: Prototypage
  ```

#### Test 4: Génération des unités (CRITIQUE)
- [ ] Cliquer sur "Générer les Unités 🚀"
- [ ] Un indicateur de chargement apparaît
- [ ] Après 5-10 secondes, l'étape 3 s'affiche
- [ ] 4 unités sont générées (ou 6 si Langue et Littérature)
- [ ] Chaque unité affiche:
  - Titre de l'unité
  - Durée (en semaines)
  - Concept clé
  - Concepts connexes
  - Énoncé de recherche
  - Chapitres inclus

#### Test 5: Génération Word (PROBLÈME INITIAL)
- [ ] Pour chaque unité, un bouton "📄 Télécharger Word" est visible
- [ ] Cliquer sur un bouton
- [ ] Un fichier `.docx` est téléchargé
- [ ] Le fichier s'ouvre correctement dans Word/LibreOffice
- [ ] Les tableaux sont remplis avec les données de l'unité
- [ ] Pas de placeholders vides (`{enseignant}`, `{titre_unite}`, etc.)

---

### 3. ✅ Vérifier les Logs (Si problèmes)

**En cas d'erreur**:

#### Logs Vercel
1. Dashboard Vercel → Votre projet
2. Onglet "Deployments" → Cliquer sur le déploiement actif
3. Onglet "Build Logs" → Vérifier les erreurs de build
4. Onglet "Function Logs" → Vérifier les erreurs runtime

**Erreurs communes et solutions**:

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| `Module not found: anthropic` | requirements.txt manquant | Vérifier que `requirements.txt` est présent |
| `Template not found` | Chemin incorrect | Vérifier que `public/Unité PEI.docx` existe |
| `500 Internal Server Error` | Erreur Python | Consulter les Function Logs |
| `404 Not Found` | Routing incorrect | Vérifier `vercel.json` |

---

### 4. ✅ Configuration Optionnelle: API Claude

**Pour activer l'IA avancée** (recommandé):

1. Obtenir une clé API Claude:
   - Aller sur: https://console.anthropic.com/
   - Créer un compte (si nécessaire)
   - Générer une clé API

2. Ajouter dans Vercel:
   - Dashboard → Votre projet → Settings
   - Onglet "Environment Variables"
   - Ajouter:
     ```
     Name: ANTHROPIC_API_KEY
     Value: sk-ant-xxxxx (votre clé)
     ```
   - Sauvegarder

3. Redéployer:
   - Aller dans "Deployments"
   - Cliquer "Redeploy" sur le dernier déploiement
   - Attendre 2-3 minutes

**Avec la clé API**:
- Groupement intelligent des chapitres par thèmes
- Génération d'énoncés de recherche plus pertinents
- Sélection optimale des concepts et objectifs

**Sans la clé API**:
- Génération basique fonctionnelle
- Distribution équitable des chapitres
- Concepts et objectifs sélectionnés automatiquement

---

## 🚨 Que faire en cas de problème?

### Scénario 1: Erreur 404 sur toutes les pages
**Cause**: Vercel n'a pas redéployé ou routing incorrect

**Solution**:
```bash
# Vérifier que vercel.json existe et contient:
{
  "version": 2,
  "builds": [{"src": "api/index.py", "use": "@vercel/python"}],
  "routes": [{"src": "/(.*)", "dest": "api/index.py"}]
}
```
- Forcer un redéploiement manuel sur Vercel

### Scénario 2: Erreur lors de la génération Word
**Cause**: Template manquant ou chemin incorrect

**Solution**:
```bash
# Vérifier que le fichier existe:
cd /home/user/webapp
ls -lh public/"Unité PEI.docx"  # Devrait afficher ~39KB

# Vérifier dans app.py (ligne 337):
template_path = os.path.join(os.path.dirname(__file__), 'public', 'Unité PEI.docx')
```

### Scénario 3: Les matières ne se chargent pas
**Cause**: Fichier matieres_data_complete.py manquant

**Solution**:
```bash
# Vérifier que le fichier existe:
ls -lh matieres_data_complete.py  # Devrait afficher ~31KB
```

### Scénario 4: Build Vercel échoue
**Cause**: Dépendances Python manquantes

**Solution**:
```bash
# Vérifier requirements.txt:
cat requirements.txt
# Devrait contenir:
# Flask==3.0.0
# python-docx==1.1.0
# anthropic==0.39.0
```

---

## 📞 Informations de Diagnostic

Si vous rencontrez un problème, fournissez:

1. **URL de l'application**: `https://votre-projet.vercel.app`
2. **Message d'erreur exact**: Copier-coller le texte
3. **Capture d'écran**: De l'erreur dans le navigateur
4. **Logs Vercel**: Copier-coller les dernières lignes des Function Logs
5. **Étape où l'erreur survient**: 
   - Chargement initial
   - Sélection de matière
   - Ajout de chapitres
   - Génération des unités
   - Téléchargement Word

---

## ✅ Checklist Finale

Avant de considérer que tout fonctionne:

- [ ] ✅ Page d'accueil accessible
- [ ] ✅ 7 matières disponibles dans le menu
- [ ] ✅ Étape 1 → Étape 2 fonctionnel
- [ ] ✅ Ajout de chapitres fonctionnel
- [ ] ✅ Génération des unités réussie
- [ ] ✅ 4 unités générées (ou 6 pour Langue et Littérature)
- [ ] ✅ Boutons de téléchargement Word visibles
- [ ] ✅ Fichiers Word téléchargeables
- [ ] ✅ Contenu Word correctement rempli

**Si toutes les cases sont cochées**: 🎉 **DÉPLOIEMENT RÉUSSI!**

---

## 📚 Documentation Complémentaire

- **Statut détaillé**: `STATUT_DEPLOIEMENT.md`
- **Guide technique**: `DOCUMENTATION_TECHNIQUE.md`
- **Guide utilisateur**: `GUIDE_UTILISATION.md`
- **Déploiement GitHub**: `DEPLOIEMENT_GITHUB.md`
