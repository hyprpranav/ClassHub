// ========================================
// GLOBAL HAMSTER LOADER
// Universal loading animation for all async operations
// ========================================

const HamsterLoader = {
    element: null,
    text: null,
    timeout: null,

    init() {
        this.element = document.getElementById('globalLoader');
        this.text = this.element?.querySelector('.loading-text');
        console.log('🐹 Hamster Loader initialized');
    },

    show(message = 'Loading...', autoHide = 0) {
        if (!this.element) this.init();
        
        if (this.text) {
            this.text.textContent = message;
        }
        
        this.element?.classList.remove('hidden');
        console.log('🐹 Loader shown:', message);

        // Auto-hide after timeout
        if (autoHide > 0) {
            this.timeout = setTimeout(() => this.hide(), autoHide);
        }
    },

    hide() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        
        this.element?.classList.add('hidden');
        console.log('🐹 Loader hidden');
    },

    // Show with custom message
    showCustom(message, duration = 0) {
        this.show(message, duration);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    HamsterLoader.init();
    
    // Hide initial page loader after everything loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            HamsterLoader.hide();
            console.log('🐹 Initial page load complete');
        }, 500);
    });
});

// Export globally
window.HamsterLoader = HamsterLoader;

console.log('✅ Hamster Loader module loaded');
