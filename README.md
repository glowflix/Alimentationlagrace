# La Grace - Site Web Vitrine

Site web professionnel pour l'alimentation La Grace, avec intégration Google Sheets pour la gestion des produits en temps réel.

## 🌟 Fonctionnalités

- ✅ Design moderne et responsive (mobile, tablette, desktop)
- ✅ Catalogue de produits avec stock en temps réel
- ✅ 3 types de stock: Carton, Millier, Pièce
- ✅ Intégration Google Sheets pour les données
- ✅ Localisation GPS avec carte interactive
- ✅ Commande via WhatsApp
- ✅ Recherche et filtres de produits
- ✅ Animations fluides et professionnelles
- ✅ Mode hors ligne (cache)

## 📁 Structure du Projet

```
La Grace/
├── index.html              # Page d'accueil
├── produits.html           # Catalogue de produits
├── commande.html           # Page de commande
├── contact.html            # Page de contact
├── assets/
│   ├── css/
│   │   ├── main.css        # Styles principaux
│   │   ├── animations.css  # Animations CSS
│   │   ├── products.css    # Styles page produits
│   │   ├── order.css       # Styles page commande
│   │   └── contact.css     # Styles page contact
│   └── js/
│       ├── main.js         # Fonctions principales
│       ├── api.js          # Connexion Google Sheets
│       ├── products.js     # Gestion des produits
│       ├── order.js        # Gestion des commandes
│       ├── contact.js      # Page contact et carte GPS
│       └── animations.js   # Animations JavaScript
├── tools/
│   └── code.gs             # Script Google Apps Script
└── public/
    └── image/
        └── lagraceimage.png # Logo
```

## 🚀 Installation et Configuration

### 1. Configuration de Google Sheets

Votre Google Sheet doit avoir cette structure:

**Feuille "Carton":**
| Code produit | Nom du produit | Stock initial | Prix d'achat (USD) | Prix de vente (FC) | Mark | Prix ventes (USD) |
|--------------|----------------|---------------|-------------------|-------------------|------|------------------|

**Feuille "Millier":**
Même structure que Carton

**Feuille "Piece":**
Même structure que Carton

**Feuille "Image":**
| code | image | date | url | description |
|------|-------|------|-----|-------------|

### 2. Déploiement de Google Apps Script

1. **Ouvrez Google Apps Script:**
   - Allez sur https://script.google.com
   - Cliquez sur "Nouveau projet"

2. **Copiez le code:**
   - Ouvrez le fichier `tools/code.gs`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur Google Apps Script

3. **Configurez l'ID de la feuille:**
   ```javascript
   const SPREADSHEET_ID = '111HH1yCU1gB5Uovbcach_Olz1e3hL4-J0z8QGHoOEtI';
   ```

4. **Déployez comme Web App:**
   - Cliquez sur "Déployer" > "Nouveau déploiement"
   - Sélectionnez "Application Web"
   - Configuration:
     - Description: "API La Grace"
     - Exécuter en tant que: "Moi"
     - Qui a accès: "Tout le monde"
   - Cliquez sur "Déployer"

5. **Copiez l'URL du déploiement:**
   - Format: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`

### 3. Configuration du Site Web

1. **Mettez à jour l'URL de l'API:**
   - Ouvrez `assets/js/api.js`
   - Remplacez `YOUR_SCRIPT_ID` par votre URL:
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'https://script.google.com/macros/s/[VOTRE_SCRIPT_ID]/exec',
       // ...
   };
   ```

2. **Vérifiez les coordonnées GPS:**
   - Ouvrez `assets/js/contact.js`
   - Vérifiez les coordonnées:
   ```javascript
   const LOCATION = {
       lat: 0.5116,
       lng: 25.1926,
       name: 'La Grace',
       address: 'Alimentation La Grace'
   };
   ```

3. **Vérifiez le numéro WhatsApp:**
   - Cherchez dans tous les fichiers: `+243 972 787 103`
   - Assurez-vous qu'il est correct partout

## 📱 Utilisation

### Pages Disponibles

1. **Accueil (index.html)**
   - Présentation de l'entreprise
   - Services offerts
   - Produits en vedette
   - Catégories

2. **Produits (produits.html)**
   - Catalogue complet
   - 3 onglets: Carton, Millier, Pièce
   - Recherche par nom/code
   - Filtres par catégorie
   - Stock en temps réel

3. **Commander (commande.html)**
   - Formulaire de commande rapide
   - Envoi direct sur WhatsApp
   - FAQ sur les commandes

4. **Contact (contact.html)**
   - Informations de contact
   - Carte GPS interactive
   - Formulaire de contact
   - Heures d'ouverture

### Fonctionnalités WhatsApp

Le site envoie automatiquement des messages formatés sur WhatsApp:

**Format de commande:**
```
*Nouvelle Commande - La Grace*

*Nom:* [Nom du client]
*Téléphone:* [Numéro]

*Détails de la commande:*
[Détails]

*Notes:* [Notes additionnelles]
```

## 🎨 Personnalisation

### Couleurs

Modifiez les couleurs dans `assets/css/main.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    --accent-color: #3498db;
    --success-color: #27ae60;
    --whatsapp-color: #25D366;
}
```

### Logo

Remplacez `public/image/lagraceimage.png` par votre logo.

### Contenu

Modifiez directement les fichiers HTML pour personnaliser:
- Textes
- Images
- Sections

## 🌐 Déploiement en Ligne

### Option 1: GitHub Pages (Gratuit)

1. Créez un repository GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans les paramètres
4. Votre site sera disponible sur: `https://[votre-username].github.io/[nom-repo]`

### Option 2: Netlify (Gratuit)

1. Allez sur https://netlify.com
2. Glissez-déposez votre dossier projet
3. Votre site sera en ligne en quelques secondes

### Option 3: Hébergement Web Classique

1. Uploadez tous les fichiers via FTP
2. Assurez-vous que `index.html` est à la racine
3. Vérifiez que tous les chemins sont corrects

## 📊 Structure des Données Google Sheets

### Colonnes Obligatoires

**Carton/Millier/Piece:**
- `Code produit`: Identifiant unique
- `Nom du produit`: Nom complet
- `Stock initial`: Quantité disponible
- `Prix de vente (FC)`: Prix en Francs Congolais
- `Prix ventes (USD)`: Prix en dollars (optionnel)
- `Mark`: Unité de mesure (CARTON, PQT, DZ, etc.)

**Image:**
- `code`: Code produit (doit correspondre)
- `image`: URL de l'image ou chemin Drive

## 🔧 Dépannage

### Les produits ne se chargent pas

1. Vérifiez l'URL de l'API dans `api.js`
2. Testez l'API directement dans le navigateur
3. Vérifiez les permissions Google Apps Script
4. Regardez la console du navigateur (F12)

### La carte GPS ne s'affiche pas

1. Vérifiez la connexion Internet
2. Vérifiez les coordonnées GPS
3. Assurez-vous que Leaflet.js est chargé

### WhatsApp ne s'ouvre pas

1. Vérifiez le format du numéro: `243972787103`
2. Testez le lien directement
3. Vérifiez que WhatsApp est installé

## 📞 Support

Pour toute question ou problème:
- **Téléphone:** +243 972 787 103
- **WhatsApp:** https://wa.me/243972787103

## 📝 Licence

Ce projet est créé pour La Grace. Tous droits réservés © 2026.

## 🙏 Crédits

- **Design:** Bootstrap-inspired, personnalisé
- **Icons:** Font Awesome 6.4.0
- **Maps:** Leaflet.js + OpenStreetMap
- **Backend:** Google Apps Script + Google Sheets

## 🔄 Mises à Jour

### Version 1.0.0 (Janvier 2026)
- ✅ Version initiale
- ✅ Intégration Google Sheets
- ✅ Design responsive
- ✅ GPS et WhatsApp
- ✅ 3 types de stock

---

**Développé avec ❤️ pour La Grace**

