// ===================================
// Configuration du checkout - La Grace
// ===================================
const CHECKOUT_CONFIG = {
    // Numéro WhatsApp du magasin
    whatsappNumber: '243972787103',
    
    // Coordonnées de La Grace - Kisangani Makiso
    storeLocation: {
        lat: 0.5116,
        lng: 25.1926,
        address: 'Alimentation La Grace, Kisangani Makiso'
    }
};

// ===================================
// Gestionnaire du Panier
// ===================================
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.createCartUI();
        this.updateCartDisplay();
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('lagraceCart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('lagraceCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Erreur sauvegarde panier:', error);
        }
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.code === product.code);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                code: product.code,
                name: product.name,
                price: product.priceFC || 0,
                quantity: 1,
                stock: product.stock || 0,
                image: product.image || 'public/image/lagraceimage.png'
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        window.appUtils.showNotification(`${product.name} ajouté au panier`, 'success');
    }

    removeFromCart(code) {
        this.cart = this.cart.filter(item => item.code !== code);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(code, quantity) {
        const item = this.cart.find(item => item.code === code);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(code);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    createCartUI() {
        // Créer le bouton panier flottant
        const cartButton = document.createElement('div');
        cartButton.id = 'cartButton';
        cartButton.className = 'cart-button-float';
        cartButton.innerHTML = `
            <button class="cart-btn">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge" id="cartBadge">0</span>
            </button>
        `;
        document.body.appendChild(cartButton);

        // Créer le panneau panier
        const cartPanel = document.createElement('div');
        cartPanel.id = 'cartPanel';
        cartPanel.className = 'cart-panel';
        cartPanel.innerHTML = `
            <div class="cart-panel-overlay"></div>
            <div class="cart-panel-content">
                <div class="cart-panel-header">
                    <h3><i class="fas fa-shopping-cart"></i> Mon Panier</h3>
                    <button class="cart-panel-close" id="closeCartPanel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-panel-body" id="cartPanelBody">
                    <!-- Items du panier -->
                </div>
                <div class="cart-panel-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <strong id="cartTotal">0 FC</strong>
                    </div>
                    <button class="btn btn-whatsapp" id="checkoutBtn" style="width: 100%;">
                        <i class="fab fa-whatsapp"></i> Commander
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(cartPanel);

        // Event listeners
        document.querySelector('.cart-btn').addEventListener('click', () => this.openCart());
        document.querySelector('.cart-panel-overlay').addEventListener('click', () => this.closeCart());
        document.getElementById('closeCartPanel').addEventListener('click', () => this.closeCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.closeCart();
            if (window.checkoutManager) {
                window.checkoutManager.openCheckout();
            }
        });
    }

    updateCartDisplay() {
        const badge = document.getElementById('cartBadge');
        const cartBody = document.getElementById('cartPanelBody');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        if (cartBody) {
            if (this.cart.length === 0) {
                cartBody.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Votre panier est vide</p>
                    </div>
                `;
            } else {
                cartBody.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='public/image/lagraceimage.png'">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${window.appUtils.formatCurrency(item.price, 'FC')}</p>
                            <div class="cart-item-quantity">
                                <button onclick="cartManager.updateQuantity('${item.code}', ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span>${item.quantity}</span>
                                <button onclick="cartManager.updateQuantity('${item.code}', ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <p class="cart-item-total">${window.appUtils.formatCurrency(item.price * item.quantity, 'FC')}</p>
                            <button class="cart-item-remove" onclick="cartManager.removeFromCart('${item.code}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            cartTotal.textContent = window.appUtils.formatCurrency(this.getTotal(), 'FC');
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    openCart() {
        document.getElementById('cartPanel').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        document.getElementById('cartPanel').classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ===================================
// Gestionnaire du Checkout
// ===================================
class CheckoutManager {
    constructor() {
        this.storeLocation = CHECKOUT_CONFIG.storeLocation;
        this.whatsappNumber = CHECKOUT_CONFIG.whatsappNumber;
        this.mapInstance = null;
        this.storeMarker = null;
        this.userMarker = null;
        this.routePolyline = null;
        this.init();
    }

    init() {
        this.createCheckoutModal();
        this.setupEventListeners();
    }

    createCheckoutModal() {
        if (document.getElementById('checkoutModal')) return;

        const modal = document.createElement('div');
        modal.id = 'checkoutModal';
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="checkout-overlay" id="checkoutOverlay"></div>
            <div class="checkout-content">
                <div class="checkout-header">
                    <h2><i class="fas fa-shopping-bag"></i> Finaliser la commande</h2>
                    <button class="checkout-close" id="checkoutClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="checkout-body">
                    <!-- Options de paiement -->
                    <div class="checkout-options" id="checkoutOptions">
                        <div class="checkout-option" data-option="whatsapp">
                            <div class="option-icon whatsapp">
                                <i class="fab fa-whatsapp"></i>
                            </div>
                            <div class="option-content">
                                <h3>Commander via WhatsApp</h3>
                                <p>Envoyez votre commande directement sur WhatsApp</p>
                            </div>
                            <div class="option-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        
                        <div class="checkout-option" data-option="direct">
                            <div class="option-icon direct">
                                <i class="fas fa-store"></i>
                            </div>
                            <div class="option-content">
                                <h3>Payer au Magasin</h3>
                                <p>Venez récupérer votre commande et payer sur place</p>
                            </div>
                            <div class="option-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Vue WhatsApp -->
                    <div class="checkout-view" id="whatsappView" style="display: none;">
                        <div class="view-header">
                            <button class="back-btn" data-back="options">
                                <i class="fas fa-arrow-left"></i> Retour
                            </button>
                            <h3><i class="fab fa-whatsapp"></i> Commande WhatsApp</h3>
                        </div>
                        <div class="view-body">
                            <div class="order-summary" id="whatsappOrderSummary"></div>
                            <div class="whatsapp-preview">
                                <p>Votre commande sera envoyée sur WhatsApp :</p>
                                <div class="whatsapp-message" id="whatsappMessage"></div>
                            </div>
                            <button class="btn btn-whatsapp" id="sendWhatsAppBtn" style="width: 100%;">
                                <i class="fab fa-whatsapp"></i> Envoyer sur WhatsApp
                            </button>
                        </div>
                    </div>

                    <!-- Vue Payer au magasin -->
                    <div class="checkout-view" id="directView" style="display: none;">
                        <div class="view-header">
                            <button class="back-btn" data-back="options">
                                <i class="fas fa-arrow-left"></i> Retour
                            </button>
                            <h3><i class="fas fa-store"></i> Venir au Magasin</h3>
                        </div>
                        <div class="view-body">
                            <div class="order-summary" id="directOrderSummary"></div>
                            <div class="store-location">
                                <h4><i class="fas fa-map-marker-alt"></i> Notre emplacement</h4>
                                <p class="store-address">${this.storeLocation.address}</p>
                                
                                <div class="map-container" id="storeMap">
                                    <div class="map-loading">
                                        <i class="fas fa-spinner fa-spin"></i>
                                        <p>Chargement...</p>
                                    </div>
                                </div>
                                
                                <div class="route-info" id="routeInfo">
                                    <div class="route-distance">
                                        <i class="fas fa-route"></i>
                                        <span id="routeDistance">Calcul en cours...</span>
                                    </div>
                                    <div class="route-time">
                                        <i class="fas fa-clock"></i>
                                        <span id="routeTime"></span>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary" onclick="checkoutManager.openDirections()" style="width: 100%; margin-top: 1rem;">
                                    <i class="fas fa-directions"></i> Obtenir l'itinéraire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('checkoutClose');
        const overlay = document.getElementById('checkoutOverlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCheckout());
        }
        if (overlay) {
            overlay.addEventListener('click', () => this.closeCheckout());
        }

        document.querySelectorAll('.checkout-option').forEach(option => {
            option.addEventListener('click', () => {
                const optionType = option.dataset.option;
                this.showCheckoutView(optionType);
            });
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showCheckoutView('options');
            });
        });

        const whatsappBtn = document.getElementById('sendWhatsAppBtn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => this.sendWhatsApp());
        }
    }

    openCheckout() {
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;

        if (cartManager.cart.length === 0) {
            window.appUtils.showNotification('Votre panier est vide', 'error');
            return;
        }

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        this.showCheckoutView('options');
        this.updateOrderSummaries();
    }

    closeCheckout() {
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;

        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    showCheckoutView(view) {
        document.querySelectorAll('.checkout-view').forEach(v => {
            v.style.display = 'none';
        });
        document.getElementById('checkoutOptions').style.display = view === 'options' ? 'block' : 'none';

        if (view === 'whatsapp') {
            document.getElementById('whatsappView').style.display = 'block';
            this.updateWhatsAppMessage();
        } else if (view === 'direct') {
            document.getElementById('directView').style.display = 'block';
            setTimeout(() => this.loadStoreMap(), 100);
        }
    }

    updateOrderSummaries() {
        const cart = cartManager.cart;
        const total = cartManager.getTotal();
        
        const summaryHTML = `
            <div class="order-items">
                ${cart.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='public/image/lagraceimage.png'">
                        <div class="order-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.quantity} × ${window.appUtils.formatCurrency(item.price, 'FC')}</p>
                        </div>
                        <div class="order-item-total">
                            ${window.appUtils.formatCurrency(item.price * item.quantity, 'FC')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span>Total:</span>
                <strong>${window.appUtils.formatCurrency(total, 'FC')}</strong>
            </div>
        `;

        ['whatsappOrderSummary', 'directOrderSummary'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = summaryHTML;
        });
    }

    updateWhatsAppMessage() {
        const cart = cartManager.cart;
        const total = cartManager.getTotal();
        
        // Message propre sans astérisques
        let message = `🛒 Commande La Grace\n\n`;
        message += `Détails de la commande:\n\n`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Qté: ${item.quantity} x ${item.price.toLocaleString()} FC\n`;
            message += `   = ${(item.price * item.quantity).toLocaleString()} FC\n\n`;
        });
        
        message += `────────────────\n`;
        message += `💰 Total: ${total.toLocaleString()} FC\n\n`;
        message += `Merci pour votre commande!`;

        const messageEl = document.getElementById('whatsappMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }
    }

    sendWhatsApp() {
        const cart = cartManager.cart;
        const total = cartManager.getTotal();
        
        // Message propre sans astérisques
        let message = `🛒 Commande La Grace%0A%0A`;
        message += `Détails de la commande:%0A%0A`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}%0A`;
            message += `   Qté: ${item.quantity} x ${item.price.toLocaleString()} FC%0A`;
            message += `   = ${(item.price * item.quantity).toLocaleString()} FC%0A%0A`;
        });
        
        message += `────────────────%0A`;
        message += `💰 Total: ${total.toLocaleString()} FC%0A%0A`;
        message += `Merci pour votre commande!`;

        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        setTimeout(() => {
            this.closeCheckout();
            cartManager.clearCart();
            window.appUtils.showNotification('Commande envoyée ! Nous vous contacterons rapidement.', 'success');
        }, 500);
    }

    loadStoreMap() {
        const mapContainer = document.getElementById('storeMap');
        if (!mapContainer) return;

        if (mapContainer.classList.contains('map-loaded')) {
            this.requestLocationPermission();
            return;
        }

        if (typeof L === 'undefined') {
            setTimeout(() => this.loadStoreMap(), 500);
            return;
        }

        // Afficher le conteneur de la carte avec demande de permission
        mapContainer.innerHTML = `
            <div id="locationPermission" class="location-permission-box">
                <div class="permission-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h4>📍 Activer la localisation</h4>
                <p>Pour calculer l'itinéraire vers La Grace, autorisez l'accès à votre position.</p>
                <button id="requestLocationBtn" class="btn btn-primary">
                    <i class="fas fa-location-arrow"></i> Autoriser ma position
                </button>
                <button id="skipLocationBtn" class="btn btn-secondary" style="margin-top: 10px;">
                    Voir la carte sans ma position
                </button>
            </div>
            <div id="lagraceMap" style="width: 100%; height: 300px; border-radius: 12px; overflow: hidden; display: none;"></div>
        `;

        // Event listeners pour les boutons
        document.getElementById('requestLocationBtn')?.addEventListener('click', () => {
            this.requestLocationPermission();
        });

        document.getElementById('skipLocationBtn')?.addEventListener('click', () => {
            this.initializeMapWithoutUser();
        });

        mapContainer.classList.add('map-loaded');
    }

    requestLocationPermission() {
        const permissionBox = document.getElementById('locationPermission');
        const mapEl = document.getElementById('lagraceMap');
        
        if (!navigator.geolocation) {
            if (permissionBox) permissionBox.innerHTML = '<p style="color: #ef4444;">❌ Géolocalisation non disponible sur votre appareil</p>';
            this.initializeMapWithoutUser();
            return;
        }

        // Afficher un loader pendant la demande
        if (permissionBox) {
            permissionBox.innerHTML = `
                <div class="permission-loading">
                    <div class="spinner"></div>
                    <p>Obtention de votre position...</p>
                </div>
            `;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Permission accordée
                if (permissionBox) permissionBox.style.display = 'none';
                if (mapEl) mapEl.style.display = 'block';
                this.initializeMapWithUser(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Permission refusée ou erreur
                let errorMessage = 'Position non disponible';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Permission refusée. Vous pouvez toujours voir la carte.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'Délai dépassé. Réessayez ou consultez la carte.';
                }
                
                if (permissionBox) {
                    permissionBox.innerHTML = `
                        <p style="color: #f59e0b;">⚠️ ${errorMessage}</p>
                        <button id="retryLocationBtn" class="btn btn-primary btn-sm" style="margin-top: 10px;">
                            <i class="fas fa-redo"></i> Réessayer
                        </button>
                        <button id="showMapAnywayBtn" class="btn btn-secondary btn-sm" style="margin-top: 10px;">
                            Voir la carte
                        </button>
                    `;
                    document.getElementById('retryLocationBtn')?.addEventListener('click', () => this.requestLocationPermission());
                    document.getElementById('showMapAnywayBtn')?.addEventListener('click', () => this.initializeMapWithoutUser());
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    }

    initializeMapWithoutUser() {
        const permissionBox = document.getElementById('locationPermission');
        const mapEl = document.getElementById('lagraceMap');
        
        if (permissionBox) permissionBox.style.display = 'none';
        if (mapEl) mapEl.style.display = 'block';
        
        this.initializeMap();
        
        // Afficher le message d'information
        const distanceEl = document.getElementById('routeDistance');
        if (distanceEl) distanceEl.textContent = 'Position non partagée';
    }

    initializeMapWithUser(userLat, userLng) {
        this.userCoords = { lat: userLat, lng: userLng };
        this.initializeMap();
        this.addUserMarkerAndRoute(userLat, userLng);
    }

    initializeMap() {
        const mapEl = document.getElementById('lagraceMap');
        if (!mapEl || this.mapInstance) return;

        const map = L.map('lagraceMap', {
            center: [this.storeLocation.lat, this.storeLocation.lng],
            zoom: 15,
            zoomControl: true,
            attributionControl: false
        });

        // Style de carte moderne - CartoDB Voyager (clair et élégant)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Marqueur du magasin
        const storeIcon = L.divIcon({
            className: 'lagrace-marker-store',
            html: `
                <div class="lagrace-marker-inner">
                    <i class="fas fa-store"></i>
                    <div class="lagrace-marker-pulse"></div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 50]
        });

        this.storeMarker = L.marker([this.storeLocation.lat, this.storeLocation.lng], { icon: storeIcon })
            .addTo(map)
            .bindPopup(`
                <div style="text-align: center; padding: 0.5rem;">
                    <h3 style="margin: 0 0 0.5rem 0; color: #667eea;">🏪 La Grace</h3>
                    <p style="margin: 0; color: #666;">${this.storeLocation.address}</p>
                </div>
            `)
            .openPopup();

        this.mapInstance = map;
        this.userMarker = null;
        this.routePolyline = null;
    }

    addUserMarkerAndRoute(userLat, userLng) {
        if (!this.mapInstance) return;

        // Ajouter le marqueur utilisateur
        const userIcon = L.divIcon({
            className: 'lagrace-marker-user',
            html: `
                <div class="lagrace-marker-user-inner">
                    <i class="fas fa-user"></i>
                    <div class="lagrace-marker-pulse-user"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        this.userMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(this.mapInstance)
            .bindPopup('<b>📍 Votre position</b>');

        // Calculer et afficher l'itinéraire
        this.calculateAndDrawRoute(userLat, userLng);

        // Ajuster la vue pour montrer les deux marqueurs
        const group = new L.featureGroup([this.userMarker, this.storeMarker]);
        this.mapInstance.fitBounds(group.getBounds().pad(0.2));
    }

    async calculateAndDrawRoute(userLat, userLng) {
        try {
            const route = await this.getRouteFromOSRM(
                userLng, userLat,
                this.storeLocation.lng, this.storeLocation.lat
            );
            
            if (route && route.coordinates) {
                this.drawRoute(route.coordinates, route.distance, route.duration);
            } else {
                this.drawStraightRoute([userLat, userLng], [this.storeLocation.lat, this.storeLocation.lng]);
            }
        } catch (error) {
            this.drawStraightRoute([userLat, userLng], [this.storeLocation.lat, this.storeLocation.lng]);
        }
    }

    async getRouteFromOSRM(userLng, userLat, storeLng, storeLat) {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${storeLng},${storeLat}?overview=full&geometries=geojson`
            );
            
            if (!response.ok) return null;
            
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                const distance = route.distance / 1000;
                const duration = route.duration / 60;
                
                return { coordinates, distance, duration };
            }
        } catch (error) {
            return null;
        }
    }

    drawRoute(coordinates, distance, duration) {
        if (!this.mapInstance) return;

        if (this.routePolyline) {
            this.mapInstance.removeLayer(this.routePolyline);
        }

        // Ligne de contour
        L.polyline(coordinates, {
            color: '#000',
            weight: 10,
            opacity: 0.4,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.mapInstance);

        // Ligne principale
        this.routePolyline = L.polyline(coordinates, {
            color: '#667eea',
            weight: 6,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(this.mapInstance);

        this.updateRouteInfo(distance, Math.round(duration));
    }

    drawStraightRoute(start, end) {
        if (!this.mapInstance) return;

        if (this.routePolyline) {
            this.mapInstance.removeLayer(this.routePolyline);
        }

        const coordinates = [start, end];
        
        L.polyline(coordinates, {
            color: '#000',
            weight: 10,
            opacity: 0.4,
            lineCap: 'round'
        }).addTo(this.mapInstance);

        this.routePolyline = L.polyline(coordinates, {
            color: '#667eea',
            weight: 6,
            opacity: 1,
            dashArray: '10, 5',
            lineCap: 'round'
        }).addTo(this.mapInstance);

        const distance = this.calculateDistance(start[0], start[1], end[0], end[1]);
        const estimatedTime = Math.round(distance * 2);
        this.updateRouteInfo(distance, estimatedTime);
    }

    updateRouteInfo(distance, time) {
        const distanceEl = document.getElementById('routeDistance');
        const timeEl = document.getElementById('routeTime');
        
        if (distanceEl) {
            distanceEl.textContent = `${distance.toFixed(1)} km`;
        }
        if (timeEl) {
            timeEl.textContent = `~${time} min`;
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    calculateRoute() {
        this.requestLocationPermission();
    }

    // Fonction pour copier les coordonnées (sans ouvrir Google Maps)
    copyStoreAddress() {
        const address = `${this.storeLocation.address}\nCoordonnées: ${this.storeLocation.lat}, ${this.storeLocation.lng}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(() => {
                window.appUtils.showNotification('Adresse copiée ! 📋', 'success');
            });
        } else {
            window.appUtils.showNotification('Adresse: ' + this.storeLocation.address, 'success');
        }
    }

    // Afficher les directions textuelles dans la page
    showDirections() {
        const distanceEl = document.getElementById('routeDistance');
        const timeEl = document.getElementById('routeTime');
        
        // Afficher un message avec l'adresse
        const directionsHTML = `
            <div class="directions-info" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4 style="margin: 0 0 0.5rem 0;"><i class="fas fa-directions"></i> Comment nous trouver</h4>
                <p style="margin: 0 0 0.5rem 0;"><i class="fas fa-map-marker-alt"></i> ${this.storeLocation.address}</p>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
                    Coordonnées GPS: ${this.storeLocation.lat}, ${this.storeLocation.lng}
                </p>
                <button onclick="window.checkoutManager.copyStoreAddress()" class="btn btn-sm" style="margin-top: 0.5rem; background: white; color: #667eea;">
                    <i class="fas fa-copy"></i> Copier l'adresse
                </button>
            </div>
        `;
        
        const mapContainer = document.getElementById('storeMap');
        if (mapContainer) {
            const existingDirections = mapContainer.querySelector('.directions-info');
            if (!existingDirections) {
                mapContainer.insertAdjacentHTML('beforeend', directionsHTML);
            }
        }
    }
}

// ===================================
// Initialisation
// ===================================
let cartManager;
let checkoutManager;

document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    checkoutManager = new CheckoutManager();
    window.cartManager = cartManager;
    window.checkoutManager = checkoutManager;
});

