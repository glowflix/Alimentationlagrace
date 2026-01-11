// ===================================
// Order Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeOrderPage();
});

// ===================================
// Initialize Order Page
// ===================================
function initializeOrderPage() {
    setupOrderForm();
}

// ===================================
// Setup Order Form
// ===================================
function setupOrderForm() {
    const orderForm = document.getElementById('quickOrderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
}

// ===================================
// Handle Order Form Submit
// ===================================
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const orderDetails = document.getElementById('orderDetails').value;
    const orderNotes = document.getElementById('orderNotes').value;
    
    // Validate form
    if (!customerName || !customerPhone || !orderDetails) {
        window.appUtils.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Create WhatsApp message
    let message = `*Nouvelle Commande - La Grace*\n\n`;
    message += `*Nom:* ${customerName}\n`;
    message += `*Téléphone:* ${customerPhone}\n\n`;
    message += `*Détails de la commande:*\n${orderDetails}\n`;
    
    if (orderNotes) {
        message += `\n*Notes:* ${orderNotes}`;
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/243972787103?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    window.appUtils.showNotification('Redirection vers WhatsApp...', 'success');
    
    // Reset form after 2 seconds
    setTimeout(() => {
        document.getElementById('quickOrderForm').reset();
    }, 2000);
}

// ===================================
// Format Phone Number
// ===================================
function formatPhoneNumber(input) {
    // Remove all non-numeric characters
    let phone = input.value.replace(/\D/g, '');
    
    // Format phone number
    if (phone.startsWith('243')) {
        phone = '+' + phone;
    } else if (phone.startsWith('0')) {
        phone = '+243' + phone.substring(1);
    } else if (!phone.startsWith('+')) {
        phone = '+243' + phone;
    }
    
    input.value = phone;
}

// Add phone number formatting
const phoneInput = document.getElementById('customerPhone');
if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        formatPhoneNumber(this);
    });
}

