// ========================================
// SETTINGS & THEME MANAGEMENT
// Handles theme toggle, font size, and data reset
// ========================================

let currentTheme = 'light';
let currentFontSize = 'medium'; // small, medium, large
let autoResetEnabled = false;
let autoResetTimer = null;

// ========================================
// SETTINGS PANEL
// ========================================

function openSettings() {
    document.getElementById('settingsPanel').classList.add('active');
    loadCurrentSettings();
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('active');
}

function loadCurrentSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    setTheme(savedTheme, false);
    
    // Load font size
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    currentFontSize = savedFontSize;
    applyFontSize(savedFontSize);
    updateFontSizeDisplay();
    
    // Load auto-reset setting
    const autoReset = localStorage.getItem('autoReset') === 'true';
    autoResetEnabled = autoReset;
    document.getElementById('autoResetToggle').checked = autoReset;
    if (autoReset) {
        scheduleAutoReset();
    }
}

// ========================================
// THEME TOGGLE
// ========================================

function setTheme(theme, save = true) {
    currentTheme = theme;
    
    // Dispatch theme change event for animation module
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    // Update body class
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Update button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`)?.classList.add('active');
    
    // Save to localStorage
    if (save) {
        localStorage.setItem('theme', theme);
        console.log(`🌓 Theme changed to: ${theme}`);
    }
}

// ========================================
// FONT SIZE ADJUSTMENT
// ========================================

function adjustFontSize(change) {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(currentFontSize);
    const newIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + change));
    
    if (newIndex !== currentIndex) {
        currentFontSize = sizes[newIndex];
        applyFontSize(currentFontSize);
        updateFontSizeDisplay();
        localStorage.setItem('fontSize', currentFontSize);
        console.log(`📏 Font size changed to: ${currentFontSize}`);
    }
}

function applyFontSize(size) {
    // Remove all font size classes first
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    // Add new font size class (updates CSS variable --font-multiplier)
    document.body.classList.add(`font-${size}`);
    
    currentFontSize = size;
    console.log(`📏 Font size applied: ${size}`);
}

function updateFontSizeDisplay() {
    const display = document.getElementById('fontSizeDisplay');
    if (display) {
        const labels = {
            small: 'Small',
            medium: 'Medium',
            large: 'Large'
        };
        display.textContent = labels[currentFontSize] || 'Medium';
    }
}

// ========================================
// AUTO-RESET (24 HOURS)
// ========================================

function toggleAutoReset() {
    const checkbox = document.getElementById('autoResetToggle');
    autoResetEnabled = checkbox.checked;
    
    localStorage.setItem('autoReset', autoResetEnabled);
    
    if (autoResetEnabled) {
        scheduleAutoReset();
        console.log('⏰ Auto-reset enabled (24 hours)');
    } else {
        cancelAutoReset();
        console.log('❌ Auto-reset disabled');
    }
}

function scheduleAutoReset() {
    // Cancel existing timer
    if (autoResetTimer) {
        clearTimeout(autoResetTimer);
    }
    
    // Get last reset time
    const lastReset = localStorage.getItem('lastResetTime');
    const lastResetDate = lastReset ? new Date(lastReset) : new Date();
    
    // Calculate next reset time (24 hours from last reset)
    const nextResetTime = new Date(lastResetDate.getTime() + 24 * 60 * 60 * 1000);
    const timeUntilReset = nextResetTime - new Date();
    
    if (timeUntilReset > 0) {
        autoResetTimer = setTimeout(() => {
            performAutoReset();
        }, timeUntilReset);
        
        console.log(`⏰ Auto-reset scheduled for: ${nextResetTime.toLocaleString('en-IN')}`);
    } else {
        // If time has passed, schedule for 24 hours from now
        autoResetTimer = setTimeout(() => {
            performAutoReset();
        }, 24 * 60 * 60 * 1000);
        
        localStorage.setItem('lastResetTime', new Date().toISOString());
    }
}

function cancelAutoReset() {
    if (autoResetTimer) {
        clearTimeout(autoResetTimer);
        autoResetTimer = null;
    }
}

async function performAutoReset() {
    console.log('🔄 Performing auto-reset...');
    
    try {
        await resetAllData();
        localStorage.setItem('lastResetTime', new Date().toISOString());
        
        // Schedule next auto-reset
        if (autoResetEnabled) {
            scheduleAutoReset();
        }
        
        // Notify user if they're active
        if (!document.hidden) {
            alert('🔄 Automatic data reset completed (24-hour cycle)');
        }
        
    } catch (error) {
        console.error('Auto-reset failed:', error);
    }
}

// ========================================
// MANUAL RESET
// ========================================

function confirmReset() {
    document.getElementById('resetModal').classList.add('active');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.remove('active');
}

async function resetData() {
    closeResetModal();
    
    console.log('🗑️ Resetting all data...');
    
    try {
        const success = await resetAllData();
        
        if (success) {
            // Clear local state
            currentSubmissions = {};
            activePolls = [];
            
            // Update last reset time
            localStorage.setItem('lastResetTime', new Date().toISOString());
            
            // Refresh views if open
            const trackerView = document.getElementById('trackerView');
            const pollingView = document.getElementById('pollingView');
            
            if (trackerView && !trackerView.classList.contains('hidden')) {
                await loadSubmissions();
            }
            
            if (pollingView && !pollingView.classList.contains('hidden')) {
                await loadPolls();
            }
            
            alert('✅ All data has been reset successfully!');
            console.log('✅ Reset completed');
        } else {
            alert('❌ Reset failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Reset error:', error);
        alert('❌ Error during reset. Please check your connection.');
    }
}

// ========================================
// SETTINGS EXPORT/IMPORT
// ========================================

function exportSettings() {
    const settings = {
        theme: currentTheme,
        fontSize: currentFontSize,
        autoReset: autoResetEnabled,
        lastResetTime: localStorage.getItem('lastResetTime'),
        version: '1.0'
    };
    
    const json = JSON.stringify(settings, null, 2);
    console.log('⚙️ Current Settings:', json);
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json)
            .then(() => alert('✅ Settings copied to clipboard!'))
            .catch(() => console.log('Copy failed'));
    }
    
    return settings;
}

function importSettings(settingsJson) {
    try {
        const settings = JSON.parse(settingsJson);
        
        if (settings.theme) {
            setTheme(settings.theme);
        }
        
        if (settings.fontSize) {
            currentFontSize = settings.fontSize;
            applyFontSize(settings.fontSize);
            updateFontSizeDisplay();
            localStorage.setItem('fontSize', settings.fontSize);
        }
        
        if (settings.autoReset !== undefined) {
            autoResetEnabled = settings.autoReset;
            document.getElementById('autoResetToggle').checked = settings.autoReset;
            localStorage.setItem('autoReset', settings.autoReset);
            if (settings.autoReset) {
                scheduleAutoReset();
            }
        }
        
        alert('✅ Settings imported successfully!');
        console.log('✅ Settings imported');
        
    } catch (error) {
        console.error('Import error:', error);
        alert('❌ Invalid settings format');
    }
}

// ========================================
// RESET SETTINGS TO DEFAULT
// ========================================

function resetSettingsToDefault() {
    const confirm = window.confirm('Reset all settings to default?');
    if (!confirm) return;
    
    // Set defaults
    setTheme('light');
    currentFontSize = 'medium';
    applyFontSize('medium');
    updateFontSizeDisplay();
    autoResetEnabled = false;
    document.getElementById('autoResetToggle').checked = false;
    cancelAutoReset();
    
    // Clear localStorage settings (keep data)
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('autoReset');
    
    alert('✅ Settings reset to default');
    console.log('✅ Settings reset to default');
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K: Open settings
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSettings();
    }
    
    // Escape: Close settings
    if (e.key === 'Escape') {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel.classList.contains('active')) {
            closeSettings();
        }
    }
    
    // Ctrl+D or Cmd+D: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
});

// ========================================
// CLOSE SETTINGS ON OUTSIDE CLICK
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const settingsPanel = document.getElementById('settingsPanel');
    
    settingsPanel?.addEventListener('click', (e) => {
        if (e.target === settingsPanel) {
            closeSettings();
        }
    });
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚙️ Settings system initialized');
    
    // Load saved settings
    loadCurrentSettings();
    
    // Check for auto-reset on page load
    if (autoResetEnabled) {
        const lastReset = localStorage.getItem('lastResetTime');
        if (lastReset) {
            const lastResetDate = new Date(lastReset);
            const hoursSinceReset = (new Date() - lastResetDate) / (1000 * 60 * 60);
            
            if (hoursSinceReset >= 24) {
                console.log('⏰ Auto-reset overdue, performing now...');
                performAutoReset();
            }
        }
    }
});

// Export functions
if (typeof window !== 'undefined') {
    window.settingsUtils = {
        openSettings,
        closeSettings,
        setTheme,
        adjustFontSize,
        toggleAutoReset,
        resetData,
        confirmReset,
        exportSettings,
        importSettings,
        resetSettingsToDefault
    };
}

console.log('⚙️ Settings system loaded');
