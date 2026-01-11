# 🚀 GUIDE D'INSTALLATION RAPIDE - LA GRACE

## ⚡ INSTALLATION EN 5 MINUTES

### ÉTAPE 1: Préparer Google Apps Script

1. **Ouvrez votre Google Sheets:**
   - https://docs.google.com/spreadsheets/d/111HH1yCU1gB5Uovbcach_Olz1e3hL4-J0z8QGHoOEtI/edit

2. **Ouvrez Apps Script:**
   - Dans le menu: Extensions > Apps Script

3. **Copiez le code:**
   - Ouvrez le fichier `tools/code.gs` dans votre projet
   - Sélectionnez tout (Ctrl+A)
   - Copiez (Ctrl+C)
   - Collez dans l'éditeur Apps Script (Ctrl+V)

4. **Sauvegardez:**
   - Cliquez sur l'icône disquette ou Ctrl+S
   - Nommez le projet: "API La Grace"

### ÉTAPE 2: Déployer l'API

1. **Cliquez sur "Déployer"** (en haut à droite)

2. **Sélectionnez "Nouveau déploiement"**

3. **Configurez:**
   - Type: "Application Web"
   - Description: "API La Grace v1.0"
   - Exécuter en tant que: **"Moi"**
   - Qui a accès: **"Tout le monde"**

4. **Cliquez "Déployer"**

5. **Autorisez l'accès:**
   - Cliquez sur "Autoriser l'accès"
   - Sélectionnez votre compte Google
   - Cliquez "Autoriser"

6. **Copiez l'URL:**
   - Format: `https://script.google.com/macros/s/XXXXX/exec`
   - **GARDEZ CETTE URL PRÉCIEUSEMENT !**

### ÉTAPE 3: Configurer le Site Web

1. **Ouvrez le fichier `assets/js/api.js`**

2. **Trouvez cette ligne (ligne 8):**
   ```javascript
   BASE_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
   ```

3. **Remplacez `YOUR_SCRIPT_ID` par votre URL complète:**
   ```javascript
   BASE_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
   ```

4. **Sauvegardez le fichier**

### ÉTAPE 4: Tester Localement

1. **Ouvrez le fichier `index.html`** avec votre navigateur

2. **Vérifiez:**
   - ✅ La page s'affiche correctement
   - ✅ Les produits se chargent (sur la page Produits)
   - ✅ Les boutons WhatsApp fonctionnent
   - ✅ La carte GPS s'affiche (sur la page Contact)

### ÉTAPE 5: Mettre en Ligne

#### Option A: GitHub Pages (RECOMMANDÉ - GRATUIT)

1. **Créez un compte GitHub** (si vous n'en avez pas):
   - https://github.com/signup

2. **Créez un nouveau repository:**
   - Cliquez sur "New repository"
   - Nom: `la-grace-website`
   - Public
   - Cliquez "Create repository"

3. **Uploadez vos fichiers:**
   - Cliquez "uploading an existing file"
   - Glissez tous vos fichiers
   - Cliquez "Commit changes"

4. **Activez GitHub Pages:**
   - Settings > Pages
   - Source: "main branch"
   - Cliquez "Save"

5. **Votre site est en ligne !**
   - URL: `https://[votre-username].github.io/la-grace-website`

#### Option B: Netlify (GRATUIT)

1. **Allez sur** https://netlify.com

2. **Créez un compte gratuit**

3. **Glissez-déposez votre dossier** sur Netlify

4. **Votre site est en ligne en 30 secondes !**

---

## 🔧 CONFIGURATION GOOGLE SHEETS

### Structure Requise

Votre Google Sheet doit avoir ces 4 feuilles:

#### 1. Feuille "Carton"

```
| Code produit | Nom du produit | Stock initial | Prix d'achat (USD) | Prix de vente (FC) | Mark | Prix ventes (USD) |
```

**Exemple:**
```
| PMIH123 | Vin Kolo mboka | 318 | 13 | 40432 | CARTON | 14.44 |
```

#### 2. Feuille "Millier"

Même structure que Carton

#### 3. Feuille "Piece"

Même structure que Carton

#### 4. Feuille "Image"

```
| code | image | date | url | description |
```

**Exemple:**
```
| PMIH123 | https://drive.google.com/... | 2026-01-11 | ... | Vin rouge |
```

### Notes Importantes:

- ✅ Les noms de colonnes DOIVENT être exacts
- ✅ La première ligne = en-têtes (ne pas modifier)
- ✅ Les codes produits doivent correspondre entre les feuilles
- ✅ Les prix peuvent être vides (0 sera affiché)

---

## 📞 CONFIGURATION WHATSAPP

### Vérifier le Numéro

Le numéro WhatsApp est: **+243 972 787 103**

Si vous voulez le changer:

1. **Recherchez dans tous les fichiers:**
   - Utilisez Ctrl+Shift+F (VS Code)
   - Cherchez: `243972787103`

2. **Remplacez par votre numéro:**
   - Format: `243XXXXXXXXX` (sans +, sans espaces)

3. **Fichiers à vérifier:**
   - `index.html`
   - `produits.html`
   - `commande.html`
   - `contact.html`
   - `assets/js/order.js`
   - `assets/js/contact.js`

---

## 🗺️ CONFIGURATION GPS

### Coordonnées Actuelles

```javascript
lat: 0.5116,
lng: 25.1926
```

### Pour Changer les Coordonnées:

1. **Trouvez vos coordonnées:**
   - Allez sur Google Maps
   - Clic droit sur votre emplacement
   - Cliquez sur les coordonnées pour les copier

2. **Ouvrez `assets/js/contact.js`**

3. **Modifiez les lignes 4-5:**
   ```javascript
   const LOCATION = {
       lat: VOTRE_LATITUDE,
       lng: VOTRE_LONGITUDE,
       name: 'La Grace',
       address: 'Alimentation La Grace'
   };
   ```

---

## ❌ DÉPANNAGE

### Problème: "Les produits ne se chargent pas"

**Solution:**

1. Testez l'API directement:
   ```
   https://script.google.com/macros/s/VOTRE_ID/exec?action=getProducts&sheet=carton
   ```

2. Vous devriez voir du JSON avec vos produits

3. Si erreur 404: Vérifiez l'URL dans `api.js`

4. Si erreur permission: Redéployez l'Apps Script

### Problème: "La carte GPS ne s'affiche pas"

**Solution:**

1. Vérifiez votre connexion Internet

2. Ouvrez la console (F12) et regardez les erreurs

3. Vérifiez que Leaflet.js est chargé:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
   <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
   ```

### Problème: "WhatsApp ne s'ouvre pas"

**Solution:**

1. Testez le lien manuellement:
   ```
   https://wa.me/243972787103
   ```

2. Vérifiez que le numéro est au bon format (pas de + dans l'URL)

3. Assurez-vous que WhatsApp est installé

---

## 📝 CHECKLIST FINALE

Avant de mettre en ligne, vérifiez:

- [ ] Google Apps Script est déployé
- [ ] L'URL de l'API est configurée dans `api.js`
- [ ] Le numéro WhatsApp est correct
- [ ] Les coordonnées GPS sont correctes
- [ ] Le logo est en place (`public/image/lagraceimage.png`)
- [ ] Les 4 feuilles Google Sheets existent
- [ ] Les colonnes sont nommées correctement
- [ ] Le site fonctionne en local
- [ ] Tous les liens sont testés

---

## 🎉 FÉLICITATIONS !

Votre site est maintenant prêt !

### Prochaines Étapes:

1. **Partagez votre site:**
   - Sur Facebook
   - Sur WhatsApp Status
   - Imprimez l'URL sur vos factures

2. **Mettez à jour régulièrement:**
   - Ajoutez de nouveaux produits dans Google Sheets
   - Les changements sont instantanés sur le site !

3. **Suivez vos commandes:**
   - Toutes les commandes arrivent sur WhatsApp
   - Répondez rapidement à vos clients

---

## 📞 BESOIN D'AIDE ?

**WhatsApp:** +243 972 787 103

**Email:** Ajoutez votre email ici

---

**Créé avec ❤️ pour La Grace**

*Dernière mise à jour: Janvier 2026*

