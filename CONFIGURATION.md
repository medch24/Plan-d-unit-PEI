# Configuration des Variables d'Environnement

Ce guide explique comment configurer les variables d'environnement nécessaires pour le bon fonctionnement de l'application.

## 🔑 Variables Requises

### 1. GEMINI_API_KEY
**Obligatoire** pour la génération d'unités et d'exercices avec IA.

```bash
GEMINI_API_KEY=votre_clé_api_gemini
```

**Où obtenir la clé:**
- Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
- Créer une nouvelle clé API
- Copier la clé

### 2. PLAN_TEMPLATE_URL
**Obligatoire** pour la génération de documents Word "Plan d'Unité".

```bash
PLAN_TEMPLATE_URL=https://docs.google.com/document/d/YOUR_DOC_ID/export?format=docx
```

**Comment obtenir l'URL:**
1. Créer un document Word sur Google Drive avec les placeholders (voir TEMPLATE_STRUCTURE.md)
2. Clic droit sur le document → Partager → "Obtenir le lien"
3. Choisir "Tout utilisateur disposant du lien"
4. Copier l'ID du document (partie après `/d/` dans l'URL)
5. Former l'URL: `https://docs.google.com/document/d/ID_DU_DOCUMENT/export?format=docx`

**Exemple:**
- Lien Google Drive: `https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/edit`
- URL à utiliser: `https://docs.google.com/document/d/144_yUOythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx`

### 3. EVAL_TEMPLATE_URL
**Obligatoire** pour la génération de documents Word "Évaluation".

```bash
EVAL_TEMPLATE_URL=https://docs.google.com/document/d/YOUR_DOC_ID/export?format=docx
```

Même procédure que pour PLAN_TEMPLATE_URL.

### 4. MONGO_URL ou MONGODB_URI
**Optionnel** mais recommandé pour sauvegarder les sessions.

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Où obtenir l'URL:**
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Obtenir la connection string
5. Remplacer `<password>` par votre mot de passe

## 📋 Configuration sur Vercel

### Étape 1: Accéder aux Variables d'Environnement

1. Aller sur votre projet Vercel
2. Cliquer sur **Settings** (Paramètres)
3. Cliquer sur **Environment Variables** dans le menu latéral

### Étape 2: Ajouter les Variables

Pour chaque variable:
1. Cliquer sur **Add New**
2. **Name**: Nom de la variable (ex: `PLAN_TEMPLATE_URL`)
3. **Value**: Valeur de la variable
4. **Environment**: Sélectionner tous les environnements (Production, Preview, Development)
5. Cliquer sur **Save**

### Étape 3: Variables à Ajouter

```
Name: GEMINI_API_KEY
Value: [votre clé API Gemini]
Environments: Production, Preview, Development

Name: PLAN_TEMPLATE_URL
Value: https://docs.google.com/document/d/[ID]/export?format=docx
Environments: Production, Preview, Development

Name: EVAL_TEMPLATE_URL
Value: https://docs.google.com/document/d/[ID]/export?format=docx
Environments: Production, Preview, Development

Name: MONGODB_URI
Value: mongodb+srv://[connection string]
Environments: Production, Preview, Development
```

### Étape 4: Redéployer

Après avoir ajouté les variables:
1. Aller dans l'onglet **Deployments**
2. Cliquer sur les trois points du dernier déploiement
3. Cliquer sur **Redeploy**
4. Confirmer le redéploiement

## ✅ Vérification

### Test des Variables d'Environnement

Vous pouvez vérifier que les variables sont bien configurées en consultant les logs Vercel:

```
[INFO] Environment variables check: {
  hasTemplateUrl: true,
  templateUrlLength: 89
}
```

Si vous voyez `hasTemplateUrl: false`, c'est que la variable n'est pas définie.

### Test des URLs de Templates

Pour vérifier qu'une URL de template est valide:
1. Ouvrir l'URL dans un navigateur
2. Un fichier .docx devrait se télécharger automatiquement
3. Ouvrir le fichier dans Word pour vérifier qu'il contient bien les placeholders

### Erreurs Courantes

#### ❌ "L'URL du modèle n'est pas configurée"
**Solution:** Ajouter la variable d'environnement correspondante dans Vercel et redéployer.

#### ❌ "Erreur lors du téléchargement du modèle: 403 Forbidden"
**Solution:** Le document Google Drive n'est pas partagé publiquement. Aller dans les paramètres de partage et choisir "Tout utilisateur disposant du lien".

#### ❌ "Erreur lors du téléchargement du modèle: 404 Not Found"
**Solution:** L'ID du document est incorrect ou le document n'existe pas. Vérifier l'URL.

#### ❌ "Le template téléchargé est vide"
**Solution:** L'URL ne pointe pas vers un document valide. Vérifier le format de l'URL (doit finir par `/export?format=docx`).

#### ❌ "GEMINI_API_KEY manquant"
**Solution:** Ajouter la clé API Gemini dans les variables d'environnement.

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais committer les clés API** dans le code
2. **Utiliser des variables d'environnement** pour toutes les configurations sensibles
3. **Restreindre l'accès aux templates** si nécessaire (bien que publics pour le téléchargement)
4. **Renouveler les clés API** régulièrement
5. **Monitorer l'usage** des APIs pour détecter tout abus

### Variables Sensibles

Les variables suivantes contiennent des informations sensibles:
- ✅ `GEMINI_API_KEY` - Ne jamais exposer
- ✅ `MONGODB_URI` - Contient username/password
- ⚠️ `PLAN_TEMPLATE_URL` - URL publique mais peut contenir des infos sensibles
- ⚠️ `EVAL_TEMPLATE_URL` - URL publique mais peut contenir des infos sensibles

## 📞 Support

En cas de problème:
1. Consulter les logs Vercel pour voir les erreurs détaillées
2. Vérifier que toutes les variables sont définies
3. Tester les URLs de templates manuellement
4. Consulter TEMPLATE_STRUCTURE.md pour la structure des templates

## 🔄 Mise à Jour des Templates

Pour mettre à jour un template sans redéployer:
1. Modifier le document Google Drive
2. Les changements seront pris en compte immédiatement
3. Pas besoin de redéployer l'application

**Note:** Si vous changez l'ID du document, vous devrez mettre à jour la variable d'environnement et redéployer.
