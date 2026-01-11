// ===================================
// SVG Icons par défaut pour les produits - Design Pro
// ===================================
const DEFAULT_PRODUCT_SVGS = {
    carton: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='gc1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2'/%3E%3C/linearGradient%3E%3ClinearGradient id='gc2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23gc1)'/%3E%3Crect width='200' height='100' fill='url(%23gc2)'/%3E%3Cg transform='translate(100,90)'%3E%3Cpath d='M-40,-35 L0,-50 L40,-35 L40,25 L0,40 L-40,25 Z' fill='none' stroke='white' stroke-width='2.5'/%3E%3Cpath d='M-40,-35 L0,-20 L40,-35' fill='none' stroke='white' stroke-width='2'/%3E%3Cpath d='M0,-20 L0,40' fill='none' stroke='white' stroke-width='2'/%3E%3Cpath d='M-40,25 L0,10 L40,25' fill='none' stroke='white' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3C/g%3E%3Ctext x='100' y='165' text-anchor='middle' font-family='Arial,sans-serif' font-size='14' font-weight='bold' fill='white' opacity='0.9'%3ECARTON%3C/text%3E%3C/svg%3E`,
    
    millier: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='gm1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981'/%3E%3Cstop offset='100%25' style='stop-color:%2306b6d4'/%3E%3C/linearGradient%3E%3ClinearGradient id='gm2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23gm1)'/%3E%3Crect width='200' height='100' fill='url(%23gm2)'/%3E%3Cg transform='translate(100,85)'%3E%3Crect x='-45' y='-40' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='-12' y='-40' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='21' y='-40' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='-45' y='-5' width='28' height='28' rx='4' fill='white' opacity='0.3'/%3E%3Crect x='-12' y='-5' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='21' y='-5' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='-45' y='30' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='-12' y='30' width='28' height='28' rx='4' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='21' y='30' width='28' height='28' rx='4' fill='white' opacity='0.3'/%3E%3C/g%3E%3Ctext x='100' y='170' text-anchor='middle' font-family='Arial,sans-serif' font-size='14' font-weight='bold' fill='white' opacity='0.9'%3EDETAIL%3C/text%3E%3C/svg%3E`,
    
    piece: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='gp1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f59e0b'/%3E%3Cstop offset='100%25' style='stop-color:%23ef4444'/%3E%3C/linearGradient%3E%3ClinearGradient id='gp2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23gp1)'/%3E%3Crect width='200' height='100' fill='url(%23gp2)'/%3E%3Cg transform='translate(100,85)'%3E%3Ccircle cx='0' cy='0' r='42' fill='none' stroke='white' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='25' fill='white' opacity='0.2'/%3E%3Cpath d='M0,-42 L0,42' stroke='white' stroke-width='1.5' stroke-dasharray='4,3'/%3E%3Cpath d='M-42,0 L42,0' stroke='white' stroke-width='1.5' stroke-dasharray='4,3'/%3E%3Ccircle cx='0' cy='0' r='8' fill='white'/%3E%3C/g%3E%3Ctext x='100' y='165' text-anchor='middle' font-family='Arial,sans-serif' font-size='14' font-weight='bold' fill='white' opacity='0.9'%3EUNITE%3C/text%3E%3C/svg%3E`
};

// ===================================
// Get Default Product Image by Sheet Type
// ===================================
function getDefaultProductImage(sheetType) {
    const type = (sheetType || 'carton').toLowerCase();
    
    if (type.includes('millier')) {
        return DEFAULT_PRODUCT_SVGS.millier;
    } else if (type.includes('piece') || type.includes('pièce')) {
        return DEFAULT_PRODUCT_SVGS.piece;
    } else {
        return DEFAULT_PRODUCT_SVGS.carton;
    }
}

// ===================================
// Get Sheet Display Label
// ===================================
function getSheetLabel(sheetType) {
    const type = (sheetType || 'carton').toLowerCase();
    
    if (type.includes('millier')) {
        return 'Détail';
    } else if (type.includes('piece') || type.includes('pièce')) {
        return 'Unité';
    } else {
        return 'Carton';
    }
}

// ===================================
// API Configuration & Functions
// ===================================

const API_CONFIG = {
    // Google Apps Script Web App URL - La Grace
    BASE_URL: 'https://script.google.com/macros/s/AKfycbxhLhbw54k5R7KZ0KCbi0sLbOj2LHRgchHgnA485UNo79vU0qIwHhqr9Q35raI1Se6h/exec',
    SPREADSHEET_ID: '111HH1yCU1gB5Uovbcach_Olz1e3hL4-J0z8QGHoOEtI',
    SHEETS: {
        CARTON: 'Carton',
        MILLIER: 'Millier',
        PIECE: 'Piece',
        IMAGE: 'Image'
    }
};

// Cache for products data
let productsCache = {
    carton: null,
    millier: null,
    piece: null,
    images: null,
    lastUpdate: null
};

// ===================================
// Fetch Products from Google Sheets
// ===================================
async function fetchProducts(sheetType = 'carton') {
    try {
        const cacheKey = sheetType.toLowerCase();
        const now = Date.now();
        
        // Return cached data if less than 5 minutes old
        if (productsCache[cacheKey] && productsCache.lastUpdate && (now - productsCache.lastUpdate < 300000)) {
            return productsCache[cacheKey];
        }
        
        const url = `${API_CONFIG.BASE_URL}?action=getProducts&sheet=${sheetType}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erreur de connexion au serveur');
        }
        
        const data = await response.json();
        
        if (data.success && data.products) {
            // Ajouter sheetType à chaque produit
            const productsWithType = data.products.map(product => ({
                ...product,
                sheetType: product.sheetType || sheetType
            }));
            
            productsCache[cacheKey] = productsWithType;
            productsCache.lastUpdate = now;
            return productsWithType;
        } else {
            throw new Error(data.message || 'Erreur lors du chargement des produits');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        
        // Return mock data for development/testing
        return getMockProducts(sheetType);
    }
}

// ===================================
// Fetch Product Images
// ===================================
async function fetchProductImages() {
    try {
        if (productsCache.images) {
            return productsCache.images;
        }
        
        const url = `${API_CONFIG.BASE_URL}?action=getImages`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erreur de connexion au serveur');
        }
        
        const data = await response.json();
        
        if (data.success && data.images) {
            productsCache.images = data.images;
            return data.images;
        } else {
            throw new Error(data.message || 'Erreur lors du chargement des images');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        return {};
    }
}

// ===================================
// Get Product Image by Code
// Format images: { "8": { url: "...", description: "..." }, ... }
// ===================================
async function getProductImage(productCode, sheetType = 'carton') {
    const images = await fetchProductImages();
    const code = String(productCode);
    
    // Vérifier si l'image existe pour ce code
    if (images[code]) {
        // L'image peut être un objet {url, description} ou une string directe
        if (typeof images[code] === 'object' && images[code].url) {
            return images[code].url;
        } else if (typeof images[code] === 'string') {
            return images[code];
        }
    }
    
    // Sinon, retourner le SVG par défaut selon le type
    return getDefaultProductImage(sheetType);
}

// ===================================
// Get Product Image Info (with description)
// ===================================
async function getProductImageInfo(productCode) {
    const images = await fetchProductImages();
    const code = String(productCode);
    
    if (images[code]) {
        if (typeof images[code] === 'object') {
            return images[code];
        }
        return { url: images[code], description: '' };
    }
    
    return null;
}

// ===================================
// Search Products
// ===================================
function searchProducts(products, searchTerm) {
    if (!searchTerm || !products) return products || [];
    
    const term = String(searchTerm).toLowerCase();
    return products.filter(product => {
        if (!product) return false;
        const name = String(product.name || '').toLowerCase();
        const code = String(product.code || '').toLowerCase();
        return name.includes(term) || code.includes(term);
    });
}

// ===================================
// Filter Products by Category
// ===================================
function filterProductsByCategory(products, category) {
    if (category === 'all') return products;
    
    // Simple category detection based on product name
    return products.filter(product => {
        const name = (product.name || '').toLowerCase();
        
        switch(category) {
            case 'boissons':
                return name.includes('vin') || name.includes('jus') || name.includes('eau') || 
                       name.includes('coca') || name.includes('sprite') || name.includes('biere') ||
                       name.includes('pepsi') || name.includes('mirinda');
            case 'hygiene':
                return name.includes('savon') || name.includes('bross') || name.includes('vasailine') ||
                       name.includes('pepsodent') || name.includes('sleeping') || name.includes('pomade');
            case 'alimentaire':
                return name.includes('farine') || name.includes('sel') || name.includes('huile') ||
                       name.includes('spagh') || name.includes('lait') || name.includes('biscuit');
            default:
                return true;
        }
    });
}

// ===================================
// Sort Products
// ===================================
function sortProducts(products, sortBy = 'name') {
    return [...products].sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return (a.name || '').localeCompare(b.name || '');
            case 'price-asc':
                return (a.priceFC || 0) - (b.priceFC || 0);
            case 'price-desc':
                return (b.priceFC || 0) - (a.priceFC || 0);
            case 'stock':
                return (b.stock || 0) - (a.stock || 0);
            default:
                return 0;
        }
    });
}

// ===================================
// Get Stock Status
// ===================================
function getStockStatus(stock) {
    if (!stock || stock <= 0) {
        return { status: 'unavailable', label: 'Rupture de stock', color: '#ef4444' };
    } else if (stock < 10) {
        return { status: 'low', label: 'Stock faible', color: '#f59e0b' };
    } else {
        return { status: 'available', label: 'En stock', color: '#10b981' };
    }
}

// ===================================
// Mock Data for Development
// ===================================
function getMockProducts(sheetType) {
    const mockProducts = [
        {
            code: 'PMI123',
            name: 'Vin Kolo mboka',
            stock: 318,
            priceFC: 40432,
            priceUSD: 14.44,
            mark: 'CARTON',
            lastUpdate: '2026-01-10',
            sheetType: sheetType
        },
        {
            code: 'PMI456',
            name: 'Savon monganga',
            stock: 85,
            priceFC: 30912,
            priceUSD: 13.44,
            mark: 'CARTON',
            lastUpdate: '2026-01-09',
            sheetType: sheetType
        },
        {
            code: 'PMI789',
            name: 'Vasailine Movit 200g',
            stock: 9965,
            priceFC: 91839,
            priceUSD: 39.93,
            mark: 'CARTON',
            lastUpdate: '2026-01-05',
            sheetType: sheetType
        },
        {
            code: 'PMI101',
            name: 'Lava',
            stock: 4880,
            priceFC: 297712,
            priceUSD: 129.44,
            mark: 'CARTON',
            lastUpdate: '2026-01-08',
            sheetType: sheetType
        },
        {
            code: 'PMI202',
            name: 'EAU JAMBO GF',
            stock: 104,
            priceFC: 6555,
            priceUSD: 2.85,
            mark: 'BOX',
            lastUpdate: '2026-01-07',
            sheetType: sheetType
        }
    ];
    
    return mockProducts;
}

// ===================================
// Clear Cache
// ===================================
function clearProductsCache() {
    productsCache = {
        carton: null,
        millier: null,
        piece: null,
        images: null,
        lastUpdate: null
    };
}

// ===================================
// Export API functions
// ===================================
window.apiService = {
    fetchProducts,
    fetchProductImages,
    getProductImage,
    getProductImageInfo,
    searchProducts,
    filterProductsByCategory,
    sortProducts,
    getStockStatus,
    clearProductsCache,
    getDefaultProductImage,
    getSheetLabel,
    API_CONFIG
};
