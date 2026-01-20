// ========================================
// ANIMATIONS & INTERACTIVE EFFECTS
// Enhanced UI animations and interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Animations loaded');
    
    // Add ripple effect to buttons
    addRippleEffect();
    
    // Add particle effects to cards
    initCardParticles();
    
    // Add smooth scroll behavior
    enableSmoothScroll();
    
    // Add loading animation
    initLoadingAnimation();
    
    // Add typing effect to header
    addTypingEffect();
});

// ========================================
// RIPPLE EFFECT FOR BUTTONS
// ========================================

function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger, .card');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// CARD HOVER PARTICLES
// ========================================

function initCardParticles() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createParticles(this);
        });
    });
}

function createParticles(element) {
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        
        element.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Particle styles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #667eea, transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: float-particle 1s ease-out forwards;
        z-index: 1;
    }
    
    @keyframes float-particle {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// ========================================
// SMOOTH SCROLL
// ========================================

function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// LOADING ANIMATION
// ========================================

function initLoadingAnimation() {
    // Show loading screen briefly
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">Loading ClassHub...</p>
        </div>
    `;
    document.body.appendChild(loader);
    
    // Remove after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 800);
    });
}

// Loader styles
const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    .page-loader.fade-out {
        opacity: 0;
    }
    
    .loader-content {
        text-align: center;
        color: white;
    }
    
    .loader-spinner {
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .loader-text {
        font-size: 1.2rem;
        font-weight: 600;
        animation: pulse-text 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse-text {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(loaderStyle);

// ========================================
// TYPING EFFECT FOR HEADER
// ========================================

function addTypingEffect() {
    const subtitle = document.querySelector('.header-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// ========================================
// PARALLAX EFFECT ON SCROLL
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed / 100);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// ========================================
// INTERACTIVE STUDENT ITEMS
// ========================================

function enhanceStudentItems() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.student-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });
}

// Call this when student list is rendered
window.enhanceStudentItems = enhanceStudentItems;

// ========================================
// CONFETTI EFFECT FOR SUCCESS
// ========================================

function triggerConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Confetti styles
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: fall 3s linear forwards;
        pointer-events: none;
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Export for use in other scripts
window.triggerConfetti = triggerConfetti;

// ========================================
// TOOLTIP SYSTEM
// ========================================

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Tooltip styles
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 10000;
        pointer-events: none;
        animation: tooltipFade 0.2s ease;
    }
    
    @keyframes tooltipFade {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(tooltipStyle);

// Initialize tooltips after DOM loads
setTimeout(initTooltips, 1000);

console.log('✨ Advanced animations initialized');
