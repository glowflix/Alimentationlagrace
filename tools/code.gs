// ===================================
// Google Apps Script - La Grace API
// ===================================

// Configuration
const SPREADSHEET_ID = '111HH1yCU1gB5Uovbcach_Olz1e3hL4-J0z8QGHoOEtI';
const SHEETS = {
  CARTON: 'Carton',
  MILLIER: 'Millier',
  PIECE: 'Piece',
  IMAGE: 'Image'
};

// ===================================
// Main doGet Function - Handle GET Requests
// ===================================
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'getProducts':
        return getProducts(e.parameter.sheet);
      case 'getImages':
        return getImages();
      case 'getProductByCode':
        return getProductByCode(e.parameter.code, e.parameter.sheet);
      case 'getAllStock':
        return getAllStock(e.parameter.code);
      default:
        return createResponse(false, 'Action non reconnue');
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse(false, 'Erreur serveur: ' + error.toString());
  }
}

// ===================================
// Get Products from Sheet
// ===================================
function getProducts(sheetName) {
  try {
    // Determine which sheet to read
    let targetSheet;
    switch(sheetName?.toLowerCase()) {
      case 'millier':
        targetSheet = SHEETS.MILLIER;
        break;
      case 'piece':
        targetSheet = SHEETS.PIECE;
        break;
      case 'carton':
      default:
        targetSheet = SHEETS.CARTON;
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(targetSheet);
    
    if (!sheet) {
      return createResponse(false, 'Feuille non trouvée: ' + targetSheet);
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Aucun produit trouvé', []);
    }
    
    // Get headers
    const headers = data[0];
    const products = [];
    
    // Find column indices
    const codeIndex = findColumnIndex(headers, ['code', 'code produit']);
    const nameIndex = findColumnIndex(headers, ['nom', 'nom du produit']);
    const stockIndex = findColumnIndex(headers, ['stock', 'stock initial']);
    const priceFCIndex = findColumnIndex(headers, ['prix de vente (fc)', 'prix de vente', 'prix vente (fc)']);
    const priceUSDIndex = findColumnIndex(headers, ['prix ventes (usd)', 'prix de vente (usd)']);
    const markIndex = findColumnIndex(headers, ['mark']);
    const dateIndex = findColumnIndex(headers, ['date', 'date de dernière mise à jour']);
    
    // Process rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row[codeIndex] && !row[nameIndex]) continue;
      
      const product = {
        code: row[codeIndex] || '',
        name: row[nameIndex] || '',
        stock: parseFloat(row[stockIndex]) || 0,
        priceFC: parseFloat(row[priceFCIndex]) || 0,
        priceUSD: parseFloat(row[priceUSDIndex]) || 0,
        mark: row[markIndex] || '',
        lastUpdate: row[dateIndex] || '',
        sheetType: targetSheet
      };
      
      products.push(product);
    }
    
    return createResponse(true, 'Produits chargés avec succès', products);
    
  } catch (error) {
    Logger.log('Error in getProducts: ' + error.toString());
    return createResponse(false, 'Erreur lors du chargement des produits: ' + error.toString());
  }
}

// ===================================
// Get Product Images
// Structure feuille: code, image, date, url, description, uid
// ===================================
function getImages() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.IMAGE);
    
    if (!sheet) {
      return createResponse(false, 'Feuille Image non trouvée');
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Aucune image trouvée', {});
    }
    
    const headers = data[0];
    const images = {};
    
    // Find column indices - colonnes: code, image, date, url, description
    const codeIndex = findColumnIndex(headers, ['code']);
    const urlIndex = findColumnIndex(headers, ['url']);  // URL de l'image
    const imageIndex = findColumnIndex(headers, ['image']); // valeur "oui" si image existe
    const descIndex = findColumnIndex(headers, ['description']);
    
    // Process rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const code = row[codeIndex];
      const hasImage = row[imageIndex]; // "oui" si image existe
      const url = row[urlIndex];
      const description = row[descIndex] || '';
      
      // Si le code existe et qu'il y a une URL valide
      if (code && url && url.toString().startsWith('http')) {
        let imageUrl = url.toString().trim();
        
        // Convertir les différents formats Google Drive
        // Format 1: https://drive.google.com/file/d/ID/view
        if (imageUrl.includes('drive.google.com/file/d/')) {
          const fileId = imageUrl.match(/\/d\/([^\/\?]+)/);
          if (fileId && fileId[1]) {
            imageUrl = `https://lh3.googleusercontent.com/d/${fileId[1]}`;
          }
        }
        // Format 2: https://drive.google.com/uc?export=view&id=ID
        else if (imageUrl.includes('drive.google.com/uc')) {
          const fileId = imageUrl.match(/id=([^&]+)/);
          if (fileId && fileId[1]) {
            imageUrl = `https://lh3.googleusercontent.com/d/${fileId[1]}`;
          }
        }
        // Format 3: https://drive.google.com/open?id=ID
        else if (imageUrl.includes('drive.google.com/open')) {
          const fileId = imageUrl.match(/id=([^&]+)/);
          if (fileId && fileId[1]) {
            imageUrl = `https://lh3.googleusercontent.com/d/${fileId[1]}`;
          }
        }
        
        images[code.toString()] = {
          url: imageUrl,
          description: description
        };
      }
    }
    
    return createResponse(true, 'Images chargées avec succès', images);
    
  } catch (error) {
    Logger.log('Error in getImages: ' + error.toString());
    return createResponse(false, 'Erreur lors du chargement des images: ' + error.toString());
  }
}

// ===================================
// Get Product by Code
// ===================================
function getProductByCode(code, sheetName) {
  try {
    if (!code) {
      return createResponse(false, 'Code produit requis');
    }
    
    const productsResponse = getProducts(sheetName);
    const products = JSON.parse(productsResponse.getContent()).data;
    
    const product = products.find(p => p.code === code);
    
    if (product) {
      return createResponse(true, 'Produit trouvé', product);
    } else {
      return createResponse(false, 'Produit non trouvé');
    }
    
  } catch (error) {
    Logger.log('Error in getProductByCode: ' + error.toString());
    return createResponse(false, 'Erreur: ' + error.toString());
  }
}

// ===================================
// Get All Stock Types for a Product
// ===================================
function getAllStock(code) {
  try {
    if (!code) {
      return createResponse(false, 'Code produit requis');
    }
    
    const stockData = {
      code: code,
      carton: 0,
      millier: 0,
      piece: 0
    };
    
    // Get stock from each sheet
    ['carton', 'millier', 'piece'].forEach(sheetType => {
      const productsResponse = getProducts(sheetType);
      const products = JSON.parse(productsResponse.getContent()).data;
      const product = products.find(p => p.code === code);
      
      if (product) {
        stockData[sheetType] = product.stock;
        if (!stockData.name) {
          stockData.name = product.name;
        }
      }
    });
    
    return createResponse(true, 'Stock chargé avec succès', stockData);
    
  } catch (error) {
    Logger.log('Error in getAllStock: ' + error.toString());
    return createResponse(false, 'Erreur: ' + error.toString());
  }
}

// ===================================
// Helper Functions
// ===================================

// Find column index by name
function findColumnIndex(headers, possibleNames) {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toString().toLowerCase().trim();
    for (const name of possibleNames) {
      if (header === name.toLowerCase() || header.includes(name.toLowerCase())) {
        return i;
      }
    }
  }
  return -1;
}

// Create JSON response
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    if (Array.isArray(data)) {
      response.products = data;
      response.count = data.length;
    } else if (typeof data === 'object') {
      // Pour les images ou autre objet
      response.images = data;
      response.data = data;
    } else {
      response.data = data;
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===================================
// Test Functions (for debugging)
// ===================================

function testGetProducts() {
  const result = getProducts('carton');
  Logger.log(result.getContent());
}

function testGetImages() {
  const result = getImages();
  Logger.log(result.getContent());
}

function testGetAllStock() {
  const result = getAllStock('PMI123');
  Logger.log(result.getContent());
}

// ===================================
// Deployment Instructions
// ===================================

/*
INSTRUCTIONS DE DÉPLOIEMENT:

1. Ouvrez Google Apps Script:
   - Allez sur https://script.google.com
   - Créez un nouveau projet ou ouvrez un projet existant

2. Copiez ce code:
   - Copiez tout le contenu de ce fichier
   - Collez-le dans l'éditeur Google Apps Script

3. Configurez l'ID de la feuille de calcul:
   - Vérifiez que SPREADSHEET_ID correspond à votre feuille Google Sheets
   - L'ID se trouve dans l'URL: https://docs.google.com/spreadsheets/d/[ID]/edit

4. Déployez comme Web App:
   - Cliquez sur "Déployer" > "Nouveau déploiement"
   - Sélectionnez "Application Web"
   - Configuration:
     * Description: "API La Grace"
     * Exécuter en tant que: "Moi"
     * Qui a accès: "Tout le monde"
   - Cliquez sur "Déployer"

5. Copiez l'URL du déploiement:
   - Après le déploiement, copiez l'URL fournie
   - Cette URL ressemble à: https://script.google.com/macros/s/[SCRIPT_ID]/exec

6. Mettez à jour votre fichier api.js:
   - Ouvrez assets/js/api.js
   - Remplacez BASE_URL par l'URL copiée

7. Testez l'API:
   - Ouvrez l'URL dans votre navigateur avec: ?action=getProducts&sheet=carton
   - Vous devriez voir les données JSON

8. Permissions:
   - La première fois, Google demandera des permissions
   - Autorisez l'accès à Google Sheets

STRUCTURE DES FEUILLES GOOGLE SHEETS:

Feuille "Carton":
- Colonnes: Code produit, Nom du produit, Stock initial, Prix d'achat (USD), 
  Prix de vente (FC), Mark, Date de dernière mise à jour, Prix ventes (USD)

Feuille "Millier":
- Même structure que Carton

Feuille "Piece":
- Même structure que Carton

Feuille "Image":
- Colonnes: code, image, date, url, description

REMARQUES:
- Les noms de colonnes peuvent varier légèrement
- Le script détecte automatiquement les colonnes
- Assurez-vous que la première ligne contient les en-têtes
- Les valeurs vides seront ignorées
*/

