// ========================================
// SUBMISSION TRACKER - CORE LOGIC
// Handles submission marking, search, and Firebase sync
// ========================================

// Global state
let currentSubmissions = {};
let currentStudentsList = [...STUDENTS];
let submissionsListener = null;

// Note: Access control functions are now in auth.js

// ========================================
// TRACKER VIEW MANAGEMENT
// ========================================

function openTrackerView() {
    console.log('📋 Opening tracker view...');
    const trackerView = document.getElementById('trackerView');
    
    if (!trackerView) {
        console.error('Tracker view element not found!');
        alert('Error: Tracker view not found. Please refresh the page.');
        return;
    }
    
    // Show the view
    trackerView.classList.remove('hidden');
    trackerView.style.display = 'block';
    
    // Initialize search
    initializeSearch();
    
    // Load data
    loadSubmissions();
    
    // Start real-time sync if Firebase is available
    if (typeof subscribeToSubmissions === 'function' && typeof db !== 'undefined' && db) {
        startRealtimeSync();
    }
    
    console.log('✅ Tracker view opened');
}

function closeView(viewName) {
    if (viewName === 'tracker') {
        document.getElementById('trackerView').classList.add('hidden');
        stopRealtimeSync();
    } else if (viewName === 'drive') {
        document.getElementById('driveView').classList.add('hidden');
    } else if (viewName === 'polling') {
        document.getElementById('pollingView').classList.add('hidden');
    }
}

// ========================================
// SUBMISSION LOADING & RENDERING
// ========================================

async function loadSubmissions() {
    // Show loader
    if (typeof HamsterLoader !== 'undefined') {
        HamsterLoader.show('Loading submissions...');
    }
    
    try {
        // Try to load from localStorage first (works without Firebase)
        const localData = localStorage.getItem('classHubSubmissions');
        if (localData) {
            currentSubmissions = JSON.parse(localData);
            console.log('✅ Loaded submissions from local storage');
        }
        
        // Try Firebase if available
        if (typeof db !== 'undefined' && db) {
            try {
                const firebaseData = await getAllSubmissions();
                currentSubmissions = { ...currentSubmissions, ...firebaseData };
                console.log('✅ Synced with Firebase');
            } catch (fbError) {
                console.log('⚠️ Firebase not available, using local storage only');
            }
        }
        
        renderStudentList();
        
        // Hide loader
        if (typeof HamsterLoader !== 'undefined') {
            HamsterLoader.hide();
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        // Continue anyway with empty submissions
        currentSubmissions = {};
        renderStudentList();
        
        // Hide loader
        if (typeof HamsterLoader !== 'undefined') {
            HamsterLoader.hide();
        }
    }
}

function renderStudentList(students = currentStudentsList) {
    const listContainer = document.getElementById('studentList');
    
    if (students.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No students found</p>';
        return;
    }
    
    listContainer.innerHTML = students.map(student => {
        const submission = currentSubmissions[student.register];
        const isSubmitted = submission?.submitted || false;
        const timestamp = submission?.timestamp || null;
        
        return `
            <div class="student-item" data-register="${student.register}">
                <div class="student-info">
                    <div class="student-register">${student.register}</div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-gender">${student.gender === 'male' ? '👦 Boy' : '👧 Girl'}</div>
                    ${timestamp ? `<div class="student-time">✅ ${formatTimestamp(timestamp)}</div>` : ''}
                </div>
                <div class="student-actions">
                    <label class="switch">
                        <input type="checkbox" 
                               ${isSubmitted ? 'checked' : ''} 
                               onchange="toggleSubmission('${student.register}', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// SUBMISSION TOGGLE
// ========================================

async function toggleSubmission(registerNumber, isChecked) {
    try {
        const timestamp = isChecked ? new Date().toISOString() : null;
        
        // Update local state
        if (isChecked) {
            currentSubmissions[registerNumber] = {
                registerNumber,
                submitted: true,
                timestamp
            };
        } else {
            if (currentSubmissions[registerNumber]) {
                currentSubmissions[registerNumber].submitted = false;
                currentSubmissions[registerNumber].timestamp = null;
            }
        }
        
        // Save to localStorage immediately
        localStorage.setItem('classHubSubmissions', JSON.stringify(currentSubmissions));
        console.log('✅ Saved to local storage');
        
        // Try to save to Firebase if available
        if (typeof updateSubmissionStatus === 'function' && typeof db !== 'undefined' && db) {
            try {
                await updateSubmissionStatus(registerNumber, isChecked, timestamp);
                console.log('✅ Synced to Firebase');
            } catch (fbError) {
                console.log('⚠️ Firebase sync failed, data saved locally');
            }
        }
        
        // Re-render to update UI
        renderStudentList(currentStudentsList);
        
    } catch (error) {
        console.error('Error toggling submission:', error);
        alert('Failed to update submission. Please try again.');
        // Revert checkbox
        const checkbox = document.querySelector(`input[onchange*="${registerNumber}"]`);
        if (checkbox) checkbox.checked = !isChecked;
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
}

function handleSearch(query) {
    if (!query.trim()) {
        currentStudentsList = [...STUDENTS];
        renderStudentList();
        return;
    }
    
    // Check if it's a register number search
    const isRegisterSearch = /^\d+$/.test(query);
    
    if (isRegisterSearch) {
        // Direct register match
        const student = STUDENTS.find(s => s.register.includes(query));
        if (student) {
            currentStudentsList = [student];
            renderStudentList();
            // Scroll to and highlight
            setTimeout(() => {
                const element = document.querySelector(`[data-register="${student.register}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight');
                    setTimeout(() => element.classList.remove('highlight'), 2000);
                }
            }, 100);
        } else {
            currentStudentsList = [];
            renderStudentList();
        }
    } else {
        // Name search
        currentStudentsList = searchStudents(query);
        renderStudentList();
    }
}

// ========================================
// SUMMARY DISPLAY
// ========================================

function showSummary() {
    const total = STUDENTS.length;
    const submitted = Object.values(currentSubmissions).filter(s => s.submitted).length;
    const pending = total - submitted;
    
    const boysSubmitted = STUDENTS.filter(student => 
        student.gender === 'male' && currentSubmissions[student.register]?.submitted
    ).length;
    
    const girlsSubmitted = STUDENTS.filter(student => 
        student.gender === 'female' && currentSubmissions[student.register]?.submitted
    ).length;
    
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
        <div class="summary-stat">
            <span>Total Students:</span>
            <strong>${total}</strong>
        </div>
        <div class="summary-stat">
            <span>✅ Submitted:</span>
            <strong style="color: var(--success)">${submitted}</strong>
        </div>
        <div class="summary-stat">
            <span>⏳ Pending:</span>
            <strong style="color: var(--warning)">${pending}</strong>
        </div>
        <div class="summary-stat">
            <span>👦 Boys Submitted:</span>
            <strong>${boysSubmitted} / ${getBoysCount()}</strong>
        </div>
        <div class="summary-stat">
            <span>👧 Girls Submitted:</span>
            <strong>${girlsSubmitted} / ${getGirlsCount()}</strong>
        </div>
        <div class="summary-stat">
            <span>📊 Completion Rate:</span>
            <strong>${total > 0 ? Math.round((submitted / total) * 100) : 0}%</strong>
        </div>
    `;
    
    document.getElementById('summaryModal').classList.add('active');
}

function closeSummary() {
    document.getElementById('summaryModal').classList.remove('active');
}

// ========================================
// REAL-TIME SYNC
// ========================================

function startRealtimeSync() {
    if (submissionsListener) return; // Already listening
    
    // Only start if Firebase is available
    if (typeof subscribeToSubmissions !== 'function' || typeof db === 'undefined' || !db) {
        console.log('⚠️ Firebase not available, real-time sync disabled');
        return;
    }
    
    try {
        submissionsListener = subscribeToSubmissions((submissions) => {
            currentSubmissions = submissions;
            // Also save to localStorage
            localStorage.setItem('classHubSubmissions', JSON.stringify(submissions));
            renderStudentList(currentStudentsList);
            console.log('📡 Real-time update received');
        });
    } catch (error) {
        console.error('Error starting real-time sync:', error);
    }
}

function stopRealtimeSync() {
    if (submissionsListener) {
        submissionsListener(); // Unsubscribe
        submissionsListener = null;
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTimestamp(isoString) {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    
    // Format: "Jan 21, 2026 8:45 AM" or "21 Jan, 8:45 AM" (Indian format)
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// ========================================
// DRIVE HUB
// ========================================

function openDriveHub() {
    document.getElementById('driveView').classList.remove('hidden');
}

// Google Drive Links (Configured)
const DRIVE_LINKS = {
    staff: 'https://drive.google.com/drive/folders/1UYlnkot40auUm-jNt2K19B0Fn3pQkjgl',
    student: 'https://drive.google.com/drive/folders/1WCPoi4u_zVGIEAybTRBzwN47mD10R-Y2',
    photos: 'https://drive.google.com/drive/folders/1oF4fJ0kkCHV1CTPp2MV4sj-JEYEl3qhC'
};

function openLink(type) {
    const url = DRIVE_LINKS[type];
    if (url.includes('YOUR_')) {
        alert('⚠️ Drive link not configured yet. Please update DRIVE_LINKS in tracker.js');
        return;
    }
    window.open(url, '_blank');
}

// ========================================
// PLAYSPHERE
// ========================================

function openPlaySphere() {
    const playspherURL = 'https://hyprpranav.github.io/PlaySphere/';
    window.open(playspherURL, '_blank');
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 ClassHub Tracker initialized');
    initializeSearch();
    
    // Apply stored filters if any
    const storedGender = localStorage.getItem('filterGender') || 'all';
    const storedSubmission = localStorage.getItem('filterSubmission') || 'all';
    
    if (storedGender !== 'all') filterGender(storedGender);
    if (storedSubmission !== 'all') filterSubmission(storedSubmission);
});
