// ========================================
// AUTH.JS - ACCESS CONTROL & PIN VERIFICATION
// Dedicated file for secret code authentication
// ========================================

console.log('🔐 Auth system loading...');

// Secret code configuration
const SECRET_CODE = '927624';
let currentAccessMode = null;

// ========================================
// REQUEST ACCESS (Called when clicking Card 1 or 4)
// ========================================

function requestAccess(mode) {
    console.log(`🔐 Access requested for: ${mode}`);
    currentAccessMode = mode;
    
    const modal = document.getElementById('secretModal');
    const input = document.getElementById('secretInput');
    const errorEl = document.getElementById('secretError');
    
    if (!modal || !input || !errorEl) {
        console.error('❌ Modal elements not found!');
        alert('Error: Security modal not found. Please refresh the page.');
        return;
    }
    
    // Show modal
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Reset input
    input.value = '';
    errorEl.textContent = '';
    errorEl.style.color = '';
    
    // Focus input
    setTimeout(() => input.focus(), 100);
    
    console.log('✅ Modal opened');
}

// ========================================
// VERIFY ACCESS CODE
// ========================================

function verifyAccess() {
    const input = document.getElementById('secretInput');
    const errorEl = document.getElementById('secretError');
    
    if (!input || !errorEl) {
        console.error('❌ Input elements not found!');
        return;
    }
    
    const enteredCode = input.value.trim();
    
    console.log(`🔍 Verifying code... Length: ${enteredCode.length}`);
    
    // Validation checks
    if (!enteredCode) {
        errorEl.textContent = '⚠️ Please enter the 6-digit code';
        errorEl.style.color = '#f59e0b';
        console.log('❌ Empty input');
        return;
    }
    
    if (enteredCode.length !== 6) {
        errorEl.textContent = '⚠️ Code must be exactly 6 digits';
        errorEl.style.color = '#f59e0b';
        input.value = '';
        console.log(`❌ Wrong length: ${enteredCode.length}`);
        return;
    }
    
    // Check if code is correct
    if (enteredCode === SECRET_CODE) {
        console.log('✅ CODE CORRECT!');
        
        // Show success message
        errorEl.textContent = '✅ Access Granted!';
        errorEl.style.color = '#10b981';
        
        // Disable input
        input.disabled = true;
        
        console.log(`🔑 Code verified. Mode: "${currentAccessMode}"`);
        
        // Store mode before closing modal
        const modeToOpen = currentAccessMode;
        
        // Close modal and open view after delay
        setTimeout(() => {
            console.log(`🚀 Opening ${modeToOpen} view...`);
            closeSecretModal();
            
            // Extra delay to ensure modal is fully closed
            setTimeout(() => {
                openProtectedView(modeToOpen);
            }, 100);
        }, 800);
        
    } else {
        console.log('❌ CODE INCORRECT!');
        
        // Show error
        errorEl.textContent = '❌ Invalid Code! Access Denied.';
        errorEl.style.color = '#ef4444';
        input.value = '';
        input.focus();
        
        // Shake animation
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('shake');
            setTimeout(() => modalContent.classList.remove('shake'), 500);
        }
    }
}

// ========================================
// OPEN PROTECTED VIEW
// ========================================

function openProtectedView(mode) {
    console.log(`📂 Opening protected view: ${mode}`);
    console.log(`📂 Current mode value:`, mode, `Type:`, typeof mode);
    
    // Ensure mode is a string and trimmed
    const cleanMode = String(mode).trim().toLowerCase();
    console.log(`📂 Clean mode:`, cleanMode);
    
    if (cleanMode === 'tracker') {
        openTrackerViewNow();
    } else if (cleanMode === 'polling') {
        openPollingViewNow();
    } else {
        console.error(`❌ Unknown mode: "${cleanMode}" (original: "${mode}")`);
        alert(`Error: Unknown view mode "${mode}". Please refresh and try again.`);
    }
}

// ========================================
// OPEN TRACKER VIEW
// ========================================

function openTrackerViewNow() {
    console.log('📝 Opening Submission Tracker...');
    
    // Show loader
    if (typeof HamsterLoader !== 'undefined') {
        HamsterLoader.show('Opening tracker...', 1000);
    }
    
    const trackerView = document.getElementById('trackerView');
    
    if (!trackerView) {
        console.error('❌ Tracker view element not found!');
        alert('Error: Tracker view not found. Please refresh the page.');
        return;
    }
    
    // Hide all other views
    hideAllViews();
    
    // Show tracker view
    trackerView.classList.remove('hidden');
    trackerView.style.display = 'block';
    
    console.log('✅ Tracker view displayed');
    
    // Initialize tracker
    setTimeout(() => {
        if (typeof initializeTracker === 'function') {
            initializeTracker();
        } else {
            console.log('⚠️ initializeTracker function not found, loading manually...');
            loadSubmissions();
            initializeSearch();
        }
    }, 100);
}

// ========================================
// OPEN POLLING VIEW
// ========================================

function openPollingViewNow() {
    console.log('📊 Opening Polling & Analysis...');
    
    // Show loader
    if (typeof HamsterLoader !== 'undefined') {
        HamsterLoader.show('Opening polls...', 1000);
    }
    
    const pollingView = document.getElementById('pollingView');
    
    if (!pollingView) {
        console.error('❌ Polling view element not found!');
        alert('Error: Polling view not found. Please refresh the page.');
        return;
    }
    
    // Hide all other views
    hideAllViews();
    
    // Show polling view
    pollingView.classList.remove('hidden');
    pollingView.style.display = 'block';
    
    console.log('✅ Polling view displayed');
    
    // Initialize polling
    setTimeout(() => {
        if (typeof initializePolling === 'function') {
            initializePolling();
        } else {
            console.log('⚠️ initializePolling function not found, loading manually...');
            loadPolls();
        }
    }, 100);
}

// ========================================
// HIDE ALL VIEWS
// ========================================

function hideAllViews() {
    const views = ['trackerView', 'driveView', 'pollingView'];
    
    views.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            view.classList.add('hidden');
            view.style.display = 'none';
        }
    });
    
    console.log('✅ All views hidden');
}

// ========================================
// CLOSE SECRET MODAL
// ========================================

function closeSecretModal() {
    const modal = document.getElementById('secretModal');
    const input = document.getElementById('secretInput');
    const errorEl = document.getElementById('secretError');
    
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    
    if (input) {
        input.value = '';
        input.disabled = false;
    }
    
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.color = '';
    }
    
    currentAccessMode = null;
    
    console.log('✅ Modal closed');
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Auth system initialized');
    
    // Enter key to verify
    const secretInput = document.getElementById('secretInput');
    if (secretInput) {
        secretInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyAccess();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('secretModal');
            if (modal && modal.classList.contains('active')) {
                closeSecretModal();
            }
        }
    });
    
    // Click outside modal to close
    const modal = document.getElementById('secretModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSecretModal();
            }
        });
    }
});

// ========================================
// HELPER FUNCTION: Initialize Tracker
// ========================================

function initializeTracker() {
    console.log('🔄 Initializing tracker...');
    
    // Load submissions
    if (typeof loadSubmissions === 'function') {
        loadSubmissions();
    }
    
    // Initialize search
    if (typeof initializeSearch === 'function') {
        initializeSearch();
    }
    
    // Start real-time sync if available
    if (typeof startRealtimeSync === 'function') {
        try {
            startRealtimeSync();
        } catch (e) {
            console.log('⚠️ Real-time sync not available');
        }
    }
}

// ========================================
// HELPER FUNCTION: Initialize Polling
// ========================================

function initializePolling() {
    console.log('🔄 Initializing polling...');
    
    // Load polls
    if (typeof loadPolls === 'function') {
        loadPolls();
    }
    
    // Start poll sync if available
    if (typeof startPollSync === 'function') {
        try {
            startPollSync();
        } catch (e) {
            console.log('⚠️ Poll sync not available');
        }
    }
}

console.log('✅ Auth system loaded successfully');
