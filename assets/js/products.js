// ===================================
// Products Page JavaScript
// ===================================

let currentStockType = 'carton';
let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

// ===================================
// Initialize Products Page
// ===================================
async function initializeProductsPage() {
    setupEventListeners();
    await loadProducts(currentStockType);
    
    // Load featured products on homepage
    if (document.getElementById('featuredProducts')) {
        await loadFeaturedProducts();
    }
}

// ===================================
// Setup Event Listeners
// ===================================
function setupEventListeners() {
    // Stock type tabs
    const stockTabs = document.querySelectorAll('.stock-tab');
    stockTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const stockType = this.dataset.stock;
            switchStockType(stockType);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', window.appUtils.debounce(function(e) {
            handleSearch(e.target.value);
        }, 300));
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            handleCategoryFilter(this.dataset.category);
        });
    });
    
    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleView(this.dataset.view);
        });
    });
}

// ===================================
// Switch Stock Type
// ===================================
async function switchStockType(stockType) {
    currentStockType = stockType;
    currentPage = 1;
    
    // Update active tab
    document.querySelectorAll('.stock-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.stock === stockType);
    });
    
    await loadProducts(stockType);
}

// ===================================
// Load Products
// ===================================
async function loadProducts(stockType) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    window.appUtils.showLoading(container);
    
    try {
        const products = await window.apiService.fetchProducts(stockType);
        currentProducts = products;
        filteredProducts = products;
        
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les produits. Veuillez réessayer.</p>
            </div>
        `;
    }
}

// ===================================
// Display Products
// ===================================
async function displayProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos critères de recherche.</p>
            </div>
        `;
        return;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
    
    // Clear container
    container.innerHTML = '';
    
    // Display products
    for (const product of productsToDisplay) {
        const productCard = await createProductCard(product);
        container.appendChild(productCard);
    }
    
    // Update pagination
    updatePagination();
}

// ===================================
// Create Product Card - Design Ligne
// ===================================
async function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Valeurs sécurisées
    const productName = String(product.name || 'Sans nom');
    const productCode = String(product.code || 'N/A');
    const productStock = Number(product.stock) || 0;
    const productPriceFC = Number(product.priceFC) || 0;
    
    const stockInfo = window.apiService.getStockStatus(productStock);
    const imageUrl = await window.apiService.getProductImage(productCode, product.sheetType || currentStockType);
    const defaultImg = window.apiService.getDefaultProductImage(product.sheetType || currentStockType);
    
    // Design en ligne simple et propre
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${imageUrl}" alt="${productName}" class="product-image" 
                 onerror="this.src='${defaultImg}'">
        </div>
        <div class="product-info">
            <h3 class="product-name">${productName}</h3>
            <span class="product-meta">
                <span class="product-code">${productCode}</span>
                <span class="product-stock" style="color: ${stockInfo.color}">
                    ${productStock > 0 ? productStock + ' en stock' : 'Rupture'}
                </span>
                ${productPriceFC > 0 ? `<span class="product-price">${productPriceFC.toLocaleString('fr-FR')} FC</span>` : ''}
            </span>
        </div>
        ${stockInfo.status !== 'unavailable' ? `
            <button class="btn-add-to-cart" onclick="event.stopPropagation(); addProductToCart('${productCode}')">
                <i class="fas fa-plus"></i>
            </button>
        ` : `
            <button class="btn-add-to-cart" disabled>
                <i class="fas fa-times"></i>
            </button>
        `}
    `;
    
    // Clic sur la carte pour voir les détails
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-add-to-cart')) {
            showProductDetails(product);
        }
    });
    
    return card;
}

// ===================================
// Add Product to Cart - Amélioré
// ===================================
function addProductToCart(productCode) {
    // Chercher le produit par code (string ou number)
    const product = currentProducts.find(p => 
        String(p.code) === String(productCode) || 
        p.code === productCode
    );
    
    if (!product) {
        console.error('Produit non trouvé:', productCode);
        if (window.appUtils) {
            window.appUtils.showNotification('Produit non trouvé', 'error');
        }
        return;
    }
    
    if (window.cartManager) {
        // Préparer le produit pour le panier
        const cartProduct = {
            code: String(product.code),
            name: String(product.name || 'Sans nom'),
            price: Number(product.priceFC) || 0,
            stock: Number(product.stock) || 0,
            image: null, // Sera chargé
            sheetType: product.sheetType || currentStockType
        };
        
        window.cartManager.addToCart(cartProduct);
    } else {
        console.error('CartManager non initialisé');
        if (window.appUtils) {
            window.appUtils.showNotification('Erreur panier', 'error');
        }
    }
}

// Rendre la fonction globale
window.addProductToCart = addProductToCart;

// ===================================
// Show Product Details Modal - Design Pro
// ===================================
async function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const productName = String(product.name || 'Sans nom');
    const productCode = String(product.code || 'N/A');
    const productStock = Number(product.stock) || 0;
    const productPriceFC = Number(product.priceFC) || 0;
    const productPriceUSD = Number(product.priceUSD) || 0;
    const productMark = String(product.mark || '');
    
    const imageUrl = await window.apiService.getProductImage(productCode, product.sheetType || currentStockType);
    const defaultImg = window.apiService.getDefaultProductImage(product.sheetType || currentStockType);
    const stockInfo = window.apiService.getStockStatus(productStock);
    const sheetLabel = window.apiService.getSheetLabel(product.sheetType || currentStockType);
    
    modalBody.innerHTML = `
        <div class="modal-product-pro">
            <div class="modal-image-section">
                <img src="${imageUrl}" alt="${productName}" class="modal-product-image"
                     onerror="this.src='${defaultImg}'">
                <span class="modal-type-badge">${sheetLabel}</span>
            </div>
            
            <div class="modal-details-section">
                <div class="modal-header-info">
                    <span class="modal-code">${productCode}</span>
                    <span class="modal-stock-badge" style="background: ${stockInfo.color}">
                        ${stockInfo.label}
                    </span>
                </div>
                
                <h2 class="modal-title">${productName}</h2>
                
                <div class="modal-price-box">
                    ${productPriceFC > 0 ? `
                        <div class="modal-price-main">
                            <span class="price-amount">${productPriceFC.toLocaleString('fr-FR')}</span>
                            <span class="price-currency">FC</span>
                        </div>
                    ` : ''}
                    ${productPriceUSD > 0 ? `
                        <div class="modal-price-usd">
                            ≈ ${productPriceUSD.toFixed(2)} USD
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-info-grid">
                    <div class="modal-info-item">
                        <i class="fas fa-box"></i>
                        <span>Stock: <strong>${productStock.toLocaleString('fr-FR')}</strong></span>
                    </div>
                    ${productMark ? `
                        <div class="modal-info-item">
                            <i class="fas fa-tag"></i>
                            <span>Unité: <strong>${productMark}</strong></span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-actions">
                    ${stockInfo.status !== 'unavailable' ? `
                        <button class="btn-modal-cart" onclick="addProductToCart('${productCode}'); closeProductModal();">
                            <i class="fas fa-cart-plus"></i> Ajouter au panier
                        </button>
                    ` : `
                        <button class="btn-modal-cart disabled" disabled>
                            <i class="fas fa-times"></i> Rupture de stock
                        </button>
                    `}
                    <a href="https://wa.me/243972787103?text=Bonjour, je souhaite commander ${encodeURIComponent(productName)} (${productCode})" 
                       target="_blank" class="btn-modal-whatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fermer le modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// Close Modal Events
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.getElementById('closeModal');
    const productModal = document.getElementById('productModal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProductModal);
    }
    
    if (productModal) {
        const overlay = productModal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeProductModal);
        }
    }
    
    // Fermer avec Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
});

// Rendre la fonction globale
window.closeProductModal = closeProductModal;

// ===================================
// Handle Search
// ===================================
function handleSearch(searchTerm) {
    filteredProducts = window.apiService.searchProducts(currentProducts, searchTerm);
    currentPage = 1;
    displayProducts();
}

// ===================================
// Handle Category Filter
// ===================================
function handleCategoryFilter(category) {
    filteredProducts = window.apiService.filterProductsByCategory(currentProducts, category);
    currentPage = 1;
    displayProducts();
}

// ===================================
// Toggle View (Grid/List)
// ===================================
function toggleView(view) {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        if (view === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.remove('list-view');
        }
    }
}

// ===================================
// Update Pagination
// ===================================
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Précédent
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            Suivant <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// ===================================
// Change Page
// ===================================
function changePage(page) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Load Featured Products (Homepage)
// ===================================
async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    window.appUtils.showLoading(container);
    
    try {
        const products = await window.apiService.fetchProducts('carton');
        const featuredProducts = products.slice(0, 6); // Get first 6 products
        
        container.innerHTML = '';
        
        for (const product of featuredProducts) {
            const productCard = await createProductCard(product);
            container.appendChild(productCard);
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les produits.</p>
            </div>
        `;
    }
}

// Make changePage available globally
window.changePage = changePage;

