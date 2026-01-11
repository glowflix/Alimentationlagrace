// ===================================
// Contact Page JavaScript
// ===================================

const LOCATION = {
    lat: 0.5116,
    lng: 25.1926,
    name: 'La Grace',
    address: 'Alimentation La Grace'
};

let map = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// ===================================
// Initialize Contact Page
// ===================================
function initializeContactPage() {
    initializeMap();
    setupContactForm();
}

// ===================================
// Initialize Map with Leaflet
// ===================================
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    try {
        // Initialize map
        map = L.map('map').setView([LOCATION.lat, LOCATION.lng], 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<i class="fas fa-map-marker-alt"></i>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        // Add marker
        const marker = L.marker([LOCATION.lat, LOCATION.lng], { icon: customIcon }).addTo(map);
        
        // Add popup
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${LOCATION.name}</h3>
                <p style="margin: 0 0 10px 0;">${LOCATION.address}</p>
                <a href="https://www.google.com/maps?q=${LOCATION.lat},${LOCATION.lng}" 
                   target="_blank" 
                   style="display: inline-block; padding: 8px 16px; background: #3498db; color: white; text-decoration: none; border-radius: 6px;">
                    <i class="fas fa-directions"></i> Obtenir l'itinéraire
                </a>
            </div>
        `).openPopup();
        
        // Fix map display issues
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; padding: 2rem;">
                <i class="fas fa-map-marked-alt" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p style="color: #666; text-align: center;">Impossible de charger la carte</p>
                <a href="https://www.google.com/maps?q=${LOCATION.lat},${LOCATION.lng}" 
                   target="_blank" 
                   class="btn btn-primary" 
                   style="margin-top: 1rem;">
                    Ouvrir dans Google Maps
                </a>
            </div>
        `;
    }
}

// ===================================
// Open Location in Maps App
// ===================================
function openInMaps() {
    const url = `https://www.google.com/maps?q=${LOCATION.lat},${LOCATION.lng}`;
    window.open(url, '_blank');
}

// Make function available globally
window.openInMaps = openInMaps;

// ===================================
// Setup Contact Form
// ===================================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// ===================================
// Handle Contact Form Submit
// ===================================
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !phone || !message) {
        window.appUtils.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Get subject label
    const subjectLabels = {
        'commande': 'Commande',
        'information': 'Demande d\'information',
        'stock': 'Disponibilité produit',
        'autre': 'Autre'
    };
    
    // Create WhatsApp message - propre sans astérisques
    let whatsappMessage = `📩 Nouveau Message - La Grace\n\n`;
    whatsappMessage += `Nom: ${name}\n`;
    whatsappMessage += `Téléphone: ${phone}\n`;
    whatsappMessage += `Sujet: ${subjectLabels[subject] || subject}\n\n`;
    whatsappMessage += `Message:\n${message}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/243972787103?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    window.appUtils.showNotification('Redirection vers WhatsApp...', 'success');
    
    // Reset form after 2 seconds
    setTimeout(() => {
        document.getElementById('contactForm').reset();
    }, 2000);
}

// ===================================
// Get User Location (Optional)
// ===================================
function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Add user marker
                if (map) {
                    L.marker([userLat, userLng], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<i class="fas fa-user"></i>',
                            iconSize: [30, 30]
                        })
                    }).addTo(map).bindPopup('Votre position');
                    
                    // Draw route line
                    const latlngs = [
                        [userLat, userLng],
                        [LOCATION.lat, LOCATION.lng]
                    ];
                    
                    L.polyline(latlngs, {
                        color: '#3498db',
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '10, 10'
                    }).addTo(map);
                }
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    }
}

// ===================================
// Calculate Distance
// ===================================
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
}

