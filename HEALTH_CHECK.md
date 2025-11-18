# 🏥 Health Check - Diagnostic des Variables d'Environnement

## 🎯 Objectif

L'endpoint `/api/health` permet de vérifier rapidement si toutes les variables d'environnement sont correctement configurées **sans avoir à consulter les logs Vercel**.

## 🔍 Comment Utiliser

### Méthode 1: Dans le Navigateur

Une fois votre application déployée sur Vercel:

```
https://votre-app.vercel.app/api/health
```

**Exemple:**
```
https://plan-d-unit-pei.vercel.app/api/health
```

### Méthode 2: Avec curl

```bash
curl https://votre-app.vercel.app/api/health
```

## 📊 Réponse Attendue

### ✅ Configuration Correcte

```json
{
  "timestamp": "2024-11-18T10:30:00.000Z",
  "environment": "production",
  "checks": {
    "PLAN_TEMPLATE_URL": {
      "configured": true,
      "length": 89,
      "preview": "https://docs.google.com/document/d/144_yU0ythmkj..."
    },
    "EVAL_TEMPLATE_URL": {
      "configured": true,
      "length": 89,
      "preview": "https://docs.google.com/document/d/1R4wsPh9ClGrU..."
    },
    "GEMINI_API_KEY": {
      "configured": true,
      "length": 39,
      "preview": "***7A-A"
    },
    "MONGODB_URI": {
      "configured": true,
      "source": "MONGODB_URI"
    }
  },
  "allConfigured": true
}
```

**Indicateurs de succès:**
- ✅ `configured: true` pour toutes les variables importantes
- ✅ `length` > 0
- ✅ `allConfigured: true`
- ✅ `preview` montre le début de l'URL (pas "NOT SET")

### ❌ Configuration Incorrecte

```json
{
  "timestamp": "2024-11-18T10:30:00.000Z",
  "environment": "production",
  "checks": {
    "PLAN_TEMPLATE_URL": {
      "configured": false,
      "length": 0,
      "preview": "NOT SET"
    },
    "EVAL_TEMPLATE_URL": {
      "configured": false,
      "length": 0,
      "preview": "NOT SET"
    },
    "GEMINI_API_KEY": {
      "configured": false,
      "length": 0,
      "preview": "NOT SET"
    },
    "MONGODB_URI": {
      "configured": false,
      "source": "NONE"
    }
  },
  "allConfigured": false
}
```

**Indicateurs de problème:**
- ❌ `configured: false`
- ❌ `length: 0`
- ❌ `allConfigured: false`
- ❌ `preview: "NOT SET"`

## 🔧 Actions Selon les Résultats

### Si `allConfigured: false`

1. **Vérifier Vercel Dashboard**
   - Settings → Environment Variables
   - S'assurer que toutes les variables sont présentes

2. **Vérifier l'Environnement**
   - Les variables doivent être cochées pour: Production, Preview, Development
   
3. **Redéployer**
   - Deployments → ••• → Redeploy
   - **IMPORTANT:** Décocher "Use existing Build Cache"

4. **Re-tester**
   - Attendre la fin du déploiement (1-2 min)
   - Actualiser `/api/health`
   - Vérifier que `allConfigured: true`

### Si `configured: true` mais App ne Fonctionne Pas

Problème possible avec les URLs de templates:

1. **Tester l'URL dans le navigateur**
   ```
   https://docs.google.com/document/d/144_yU0ythmkjTsP9PA4k5YLOpRFyV7Zv/export?format=docx
   ```
   - Devrait télécharger un fichier .docx immédiatement
   - Si erreur 403 → Document pas partagé publiquement
   - Si erreur 404 → ID du document incorrect

2. **Vérifier le Partage Google Drive**
   - Clic droit sur le document
   - Partager → "Tout utilisateur disposant du lien"

## 📋 Checklist de Diagnostic

Avant de contacter le support, vérifier:

- [ ] `/api/health` retourne `allConfigured: true`
- [ ] Toutes les variables ont `configured: true`
- [ ] Les `preview` des URLs commencent par `https://`
- [ ] Les URLs des templates fonctionnent dans le navigateur
- [ ] Le déploiement a été fait **après** l'ajout des variables
- [ ] Les variables sont cochées pour tous les environnements

## 🎯 Scénarios Courants

### Scénario 1: Première Configuration

```
État initial: allConfigured: false
Action: Ajouter les 3 variables dans Vercel
Action: Redéployer (sans cache)
Résultat attendu: allConfigured: true
```

### Scénario 2: Variables Ajoutées mais Pas Visibles

```
État: allConfigured: false malgré variables dans Vercel
Cause: Pas de redéploiement après l'ajout
Action: Redéployer (décocher cache)
Résultat attendu: allConfigured: true
```

### Scénario 3: Health OK mais App ne Fonctionne Pas

```
État: allConfigured: true
Problème: Erreur 500 lors de génération
Cause probable: URL de template invalide ou inaccessible
Action: Tester les URLs manuellement dans navigateur
Action: Vérifier partage Google Drive
```

## 💡 Conseils

### Lors du Développement

Testez `/api/health` après chaque modification de variables:

```bash
# Terminal 1: Watch les changements
watch -n 2 'curl -s https://votre-app.vercel.app/api/health | jq .'

# Terminal 2: Modifier les variables sur Vercel
# → Observer le changement après redéploiement
```

### En Production

Ajoutez un monitoring:

```javascript
// Dans votre app
fetch('/api/health')
  .then(r => r.json())
  .then(data => {
    if (!data.allConfigured) {
      console.error('⚠️  Configuration incomplète:', data);
      // Afficher un message à l'admin
    }
  });
```

## 🔒 Sécurité

L'endpoint `/api/health`:
- ✅ Ne montre que les 50 premiers caractères des URLs
- ✅ Ne montre que les 4 derniers caractères de l'API key
- ✅ Pas d'informations sensibles complètes exposées
- ⚠️ Accessible publiquement (pas d'authentification)

**Note:** C'est normal et utile pour le debugging. Les vraies valeurs ne sont jamais exposées.

## 🆘 Support

Si `/api/health` retourne `allConfigured: true` mais l'app ne fonctionne toujours pas:

1. Consulter les logs Vercel pour l'erreur exacte
2. Vérifier `QUICK_FIX.md` pour les erreurs courantes
3. Vérifier `DEBUG_MATIERES.md` si problème avec une matière spécifique
4. Consulter `CONFIGURATION.md` pour le guide complet

## 🔄 Automatisation

Pour vérifier automatiquement au démarrage de l'app:

```javascript
// Dans public/script.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const health = await fetch('/api/health').then(r => r.json());
    
    if (!health.allConfigured) {
      alert('⚠️  Configuration incomplète. Contactez l\'administrateur.');
      console.error('Health check failed:', health);
    }
  } catch (e) {
    console.error('Health check error:', e);
  }
  
  // Continuer avec le reste de l'initialisation...
});
```
