// ===================================
// Animations JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeHoverEffects();
});

// ===================================
// Initialize Scroll Animations
// ===================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add stagger delay for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in-up, .slide-down');
    animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Initialize Hover Effects
// ===================================
function initializeHoverEffects() {
    // Parallax effect on mouse move
    const parallaxElements = document.querySelectorAll('.parallax');
    
    document.addEventListener('mousemove', function(e) {
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 5;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            el.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
    
    // Tilt effect on cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===================================
// Animate Counter
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ===================================
// Animate Progress Bar
// ===================================
function animateProgressBar(element, target) {
    let width = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
        width += increment;
        if (width >= target) {
            element.style.width = target + '%';
            clearInterval(timer);
        } else {
            element.style.width = width + '%';
        }
    }, 20);
}

// ===================================
// Typing Animation
// ===================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===================================
// Reveal on Scroll
// ===================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// ===================================
// Export animation functions
// ===================================
window.animations = {
    animateCounter,
    animateProgressBar,
    typeWriter,
    revealOnScroll
};

