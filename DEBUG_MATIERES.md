# 🐛 Debug - Problème "Matière non trouvée"

## Erreur Rencontrée

```
❌ 400 Bad Request
Matière non trouvée: Individus et sociétés
```

## ✅ Solution Implémentée

Le code essaie maintenant **plusieurs formats** de clés pour trouver les descripteurs:

1. **Minuscules avec espaces**: `individus et sociétés`
2. **Minuscules avec underscores**: `individus_et_sociétés`  
3. **Minuscules avec tirets**: `individus-et-sociétés`
4. **Format original**: `Individus et sociétés`

## 📋 Matières Supportées

Voici les matières disponibles et leurs formats de clés:

### Matières Simples (sans espaces)
- `design` → Design
- `sciences` → Sciences
- `mathématiques` → Mathématiques
- `arts` → Arts

### Matières Composées (avec espaces)
- `"langue et littérature"` → Langue et littérature
- `"individus et sociétés"` → Individus et sociétés
- `"acquisition de langues"` → Acquisition de langues

**Note:** Les clés dans `descripteurs-complets.js` sont **en minuscules**.

## 🔍 Comment Vérifier

### Dans le Frontend (public/script.js)

Vérifier que les valeurs des options correspondent:

```javascript
<select id="matiere">
    <option value="Design">Design</option>
    <option value="Langue et littérature">Langue et littérature</option>
    <option value="Acquisition de langues">Acquisition de langues</option>
    <option value="Individus et sociétés">Individus et sociétés</option>
    <option value="Sciences">Sciences</option>
    <option value="Mathématiques">Mathématiques</option>
    <option value="Arts">Arts</option>
</select>
```

### Dans les Logs Vercel

Après l'erreur, vous verrez:

```
[ERROR] Matière non trouvée: Individus et sociétés
[ERROR] Clés disponibles: ['design', 'langue et littérature', 'sciences', ...]
[INFO] Clés essayées: [
  'individus et sociétés',       ✓ Cette clé devrait matcher!
  'individus_et_sociétés',
  'individus-et-sociétés',
  'Individus et sociétés'
]
```

## 🛠️ Si le Problème Persiste

### 1. Vérifier la Clé dans descripteurs-complets.js

```bash
grep -i "individus" api/descripteurs-complets.js
```

Devrait montrer:
```javascript
"individus et sociétés": {
  pei1: { ... }
}
```

### 2. Vérifier le Format Envoyé

Dans les logs Vercel, chercher:
```
[INFO] Generate Eval Request received
```

Et voir quelle valeur de `matiere` est envoyée.

### 3. Ajouter des Alias

Si une matière utilise un format différent, ajouter un alias dans le code:

```javascript
// Dans generate-eval.js
const MATIERE_ALIASES = {
  'individus et societes': 'individus et sociétés',  // Sans accent
  'ind et soc': 'individus et sociétés',              // Abrégé
  // ...
};

const matiereNormalized = MATIERE_ALIASES[matiere.toLowerCase()] || 
                          matiere.toLowerCase();
```

## ✅ Test de Validation

Pour tester que toutes les matières fonctionnent:

1. **Frontend** - Sélectionner chaque matière une par une
2. **Générer une unité** 
3. **Cliquer sur "Générer l'évaluation"**
4. ✅ Aucune erreur 400 ne devrait apparaître

### Matières à Tester

- [ ] Design
- [ ] Langue et littérature  
- [ ] Acquisition de langues
- [ ] Individus et sociétés ← **Problème précédent ici**
- [ ] Sciences
- [ ] Mathématiques
- [ ] Arts

## 📊 Logs de Debugging

Le code affiche maintenant des logs utiles:

```
✓ [INFO] Matière trouvée: Individus et sociétés -> Key used: individus et sociétés

✗ [ERROR] Matière non trouvée: XYZ
  [ERROR] Clés disponibles: [...]
  [ERROR] Clés essayées: [...]
```

## 🔄 Prochaine Génération

Si vous ajoutez une nouvelle matière dans `descripteurs-complets.js`:

1. Utiliser **minuscules** pour la clé
2. Utiliser **guillemets** si la clé contient des espaces
3. Tester avec le frontend

Exemple:
```javascript
"éducation physique et à la santé": {
  pei1: { ... }
}
```

## 💡 Astuce

Pour éviter tout problème, utilisez des clés **cohérentes**:
- Tout en minuscules
- Espaces pour les mots séparés (pas d'underscores)
- Accents si nécessaire (é, è, à)
