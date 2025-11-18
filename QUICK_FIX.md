# 🚨 Fix Rapide - Erreur 500/400

## Problème Actuel

Vous voyez ces erreurs dans la console:
- ❌ **500 Internal Server Error** sur `/api/generate-plan-docx`
- ❌ **400 Bad Request** sur `/api/generate-eval`

## 🎯 Cause

Les variables d'environnement pour les templates Word ne sont **pas configurées** sur Vercel.

## ✅ Solution en 5 Minutes

### Étape 1: Préparer les URLs des Templates

Vous avez deux templates Google Drive:

1. **Template Plan d'Unité**
   - Document ID visible dans votre screenshot
   - URL à utiliser: `https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx`

2. **Template Évaluation**  
   - Document ID: `1R4wsPh9ClGrUJR46mISScRZk7DBVHBaC`
   - URL à utiliser: `https://docs.google.com/document/d/1R4wsPh9ClGrUJR46mISScRZk7DBVHBaC/export?format=docx`

**Important:** Les documents doivent être partagés publiquement:
- Clic droit sur le document
- Partager → "Tout utilisateur disposant du lien"

### Étape 2: Ajouter sur Vercel

1. **Aller sur Vercel** → Votre projet → **Settings**
2. **Environment Variables** dans le menu gauche
3. **Ajouter ces 3 variables:**

```
Variable 1:
Name: PLAN_TEMPLATE_URL
Value: https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx
Environments: ☑ Production ☑ Preview ☑ Development

Variable 2:
Name: EVAL_TEMPLATE_URL
Value: https://docs.google.com/document/d/1R4wsPh9ClGrUJR46mISScRZk7DBVHBaC/export?format=docx
Environments: ☑ Production ☑ Preview ☑ Development

Variable 3:
Name: GEMINI_API_KEY
Value: [Votre clé API Gemini]
Environments: ☑ Production ☑ Preview ☑ Development
```

### Étape 3: Redéployer

1. **Deployments** → Dernier déploiement → **•••** → **Redeploy**
2. Attendre la fin du déploiement (1-2 minutes)

### Étape 4: Tester

1. Actualiser votre application
2. Générer une unité
3. Cliquer sur "Exporter le plan (Word)" ou "Générer l'évaluation"
4. ✅ Le document Word devrait maintenant se télécharger!

## 🔍 Vérification

### Test Rapide des URLs

Ouvrez ces URLs dans votre navigateur:
- https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx
- https://docs.google.com/document/d/1R4wsPh9ClGrUJR46mISScRZk7DBVHBaC/export?format=docx

**Résultat attendu:** Un fichier .docx se télécharge immédiatement.

**Si erreur 403/404:**
- Le document n'est pas partagé publiquement
- L'ID du document est incorrect

### Logs Vercel

Après redéploiement, vous devriez voir dans les logs:

```
✅ [INFO] Environment variables check: { 
     hasTemplateUrl: true, 
     templateUrlLength: 89 
   }
✅ [INFO] Template downloaded, size: 45678 bytes
✅ [INFO] Document generated successfully, size: 52341
```

**Si vous voyez:**
```
❌ [ERROR] L'URL du modèle n'est pas configurée
```
→ Les variables ne sont pas ajoutées ou le redéploiement n'a pas été fait.

## 🆘 Si Ça Ne Marche Toujours Pas

### Checklist Complète

- [ ] Les 3 variables sont ajoutées dans Vercel Settings > Environment Variables
- [ ] Chaque variable est cochée pour Production, Preview, Development
- [ ] L'application a été redéployée après l'ajout des variables
- [ ] Les documents Google Drive sont partagés publiquement
- [ ] Les URLs se terminent bien par `/export?format=docx`
- [ ] Les URLs des templates fonctionnent quand testées dans le navigateur

### Erreurs Spécifiques

**"500: L'URL du modèle n'est pas configurée"**
→ Variable manquante ou mal nommée. Vérifier l'orthographe exacte: `PLAN_TEMPLATE_URL` et `EVAL_TEMPLATE_URL`

**"403 Forbidden"**
→ Document non partagé publiquement. Aller dans Partage → Tout utilisateur disposant du lien

**"404 Not Found"**
→ ID du document incorrect. Vérifier l'ID dans l'URL Google Drive

**"Le template téléchargé est vide"**
→ L'URL ne retourne pas un document Word valide. Tester l'URL dans le navigateur

**"400 Bad Request: Matière non trouvée"**
→ Vérifier que la matière sélectionnée est bien supportée

## 📚 Documentation Complète

Pour plus de détails:
- **CONFIGURATION.md** - Guide complet de configuration
- **TEMPLATE_STRUCTURE.md** - Structure des templates Word
- **Vercel Logs** - Pour voir les erreurs en temps réel

## 💡 Astuce

Une fois configuré, vous pouvez modifier les templates Google Drive directement sans redéployer! Les changements seront pris en compte immédiatement.
