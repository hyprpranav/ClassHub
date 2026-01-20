// ========================================
// FILTERS & SORTING SYSTEM
// Handles gender filters, submission filters, and sorting
// ========================================

let activeGenderFilter = 'all';
let activeSubmissionFilter = 'all';
let activeSortBy = 'register';

// ========================================
// GENDER FILTER
// ========================================

function filterGender(gender) {
    activeGenderFilter = gender;
    
    // Update button states
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${gender}"]`)?.classList.add('active');
    
    // Save to localStorage
    localStorage.setItem('filterGender', gender);
    
    // Apply all filters
    applyAllFilters();
}

// ========================================
// SUBMISSION STATUS FILTER
// ========================================

function filterSubmission(status) {
    activeSubmissionFilter = status;
    
    // Update button states
    document.querySelectorAll('[data-submission]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-submission="${status}"]`)?.classList.add('active');
    
    // Save to localStorage
    localStorage.setItem('filterSubmission', status);
    
    // Apply all filters
    applyAllFilters();
}

// ========================================
// APPLY ALL FILTERS
// ========================================

function applyAllFilters() {
    let filteredStudents = [...STUDENTS];
    
    // Apply gender filter
    if (activeGenderFilter !== 'all') {
        filteredStudents = filteredStudents.filter(student => 
            student.gender === activeGenderFilter
        );
    }
    
    // Apply submission filter
    if (activeSubmissionFilter !== 'all') {
        filteredStudents = filteredStudents.filter(student => {
            const isSubmitted = currentSubmissions[student.register]?.submitted || false;
            if (activeSubmissionFilter === 'submitted') {
                return isSubmitted;
            } else if (activeSubmissionFilter === 'pending') {
                return !isSubmitted;
            }
            return true;
        });
    }
    
    // Update current list
    currentStudentsList = filteredStudents;
    
    // Apply sorting
    sortStudents();
}

// ========================================
// SORTING SYSTEM
// ========================================

function sortStudents() {
    const sortBy = document.getElementById('sortSelect')?.value || activeSortBy;
    activeSortBy = sortBy;
    
    let sortedStudents = [...currentStudentsList];
    
    switch (sortBy) {
        case 'register':
            sortedStudents.sort((a, b) => a.register.localeCompare(b.register));
            break;
            
        case 'name':
            sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
            break;
            
        case 'time':
            sortedStudents.sort((a, b) => {
                const timeA = currentSubmissions[a.register]?.timestamp;
                const timeB = currentSubmissions[b.register]?.timestamp;
                
                // Handle null/undefined timestamps
                if (!timeA && !timeB) return 0;
                if (!timeA) return 1; // Put unsubmitted at end
                if (!timeB) return -1;
                
                // Sort by most recent first
                return new Date(timeB) - new Date(timeA);
            });
            break;
    }
    
    currentStudentsList = sortedStudents;
    renderStudentList(sortedStudents);
}

// ========================================
// QUICK FILTERS
// ========================================

// Filter to show only pending submissions
function showPendingOnly() {
    filterSubmission('pending');
}

// Filter to show only submitted
function showSubmittedOnly() {
    filterSubmission('submitted');
}

// Filter to show boys only
function showBoysOnly() {
    filterGender('male');
}

// Filter to show girls only
function showGirlsOnly() {
    filterGender('female');
}

// Reset all filters
function resetFilters() {
    activeGenderFilter = 'all';
    activeSubmissionFilter = 'all';
    activeSortBy = 'register';
    
    // Update UI
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]')?.classList.add('active');
    
    document.querySelectorAll('[data-submission]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-submission="all"]')?.classList.add('active');
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'register';
    
    // Clear localStorage
    localStorage.removeItem('filterGender');
    localStorage.removeItem('filterSubmission');
    
    // Apply
    applyAllFilters();
}

// ========================================
// FILTER STATISTICS
// ========================================

function getFilteredStats() {
    const total = currentStudentsList.length;
    const submitted = currentStudentsList.filter(student => 
        currentSubmissions[student.register]?.submitted
    ).length;
    const pending = total - submitted;
    
    const boys = currentStudentsList.filter(s => s.gender === 'male').length;
    const girls = currentStudentsList.filter(s => s.gender === 'female').length;
    
    return {
        total,
        submitted,
        pending,
        boys,
        girls,
        submissionRate: total > 0 ? Math.round((submitted / total) * 100) : 0
    };
}

// Display filter stats
function displayFilterStats() {
    const stats = getFilteredStats();
    console.log('📊 Filter Statistics:', stats);
    return stats;
}

// ========================================
// ADVANCED FILTERS
// ========================================

// Filter by submission date range
function filterByDateRange(startDate, endDate) {
    const filtered = currentStudentsList.filter(student => {
        const submission = currentSubmissions[student.register];
        if (!submission?.timestamp) return false;
        
        const submitDate = new Date(submission.timestamp);
        return submitDate >= startDate && submitDate <= endDate;
    });
    
    currentStudentsList = filtered;
    renderStudentList(filtered);
}

// Filter by recent submissions (last N hours)
function filterRecentSubmissions(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const filtered = currentStudentsList.filter(student => {
        const submission = currentSubmissions[student.register];
        if (!submission?.timestamp) return false;
        
        const submitDate = new Date(submission.timestamp);
        return submitDate >= cutoffTime;
    });
    
    currentStudentsList = filtered;
    renderStudentList(filtered);
}

// ========================================
// BULK OPERATIONS
// ========================================

// Select all filtered students
function selectAllFiltered() {
    const registerNumbers = currentStudentsList.map(s => s.register);
    return registerNumbers;
}

// Mark all filtered as submitted
async function markAllFilteredAsSubmitted() {
    const confirmation = confirm(`Mark all ${currentStudentsList.length} filtered students as submitted?`);
    if (!confirmation) return;
    
    try {
        const timestamp = new Date().toISOString();
        const promises = currentStudentsList.map(student => 
            updateSubmissionStatus(student.register, true, timestamp)
        );
        
        await Promise.all(promises);
        alert(`✅ Marked ${currentStudentsList.length} students as submitted`);
        await loadSubmissions(); // Refresh
    } catch (error) {
        console.error('Error in bulk update:', error);
        alert('❌ Failed to update all students. Please try again.');
    }
}

// Clear all filtered submissions
async function clearAllFilteredSubmissions() {
    const confirmation = confirm(`Clear submissions for all ${currentStudentsList.length} filtered students?`);
    if (!confirmation) return;
    
    try {
        const promises = currentStudentsList.map(student => 
            updateSubmissionStatus(student.register, false, null)
        );
        
        await Promise.all(promises);
        alert(`✅ Cleared ${currentStudentsList.length} submissions`);
        await loadSubmissions(); // Refresh
    } catch (error) {
        console.error('Error in bulk clear:', error);
        alert('❌ Failed to clear all submissions. Please try again.');
    }
}

// ========================================
// EXPORT FILTERS
// ========================================

// Export filtered list to CSV format (for console/clipboard)
function exportFilteredToCSV() {
    const headers = ['Register Number', 'Name', 'Gender', 'Submitted', 'Timestamp'];
    const rows = currentStudentsList.map(student => {
        const submission = currentSubmissions[student.register];
        return [
            student.register,
            student.name,
            student.gender === 'male' ? 'Boy' : 'Girl',
            submission?.submitted ? 'Yes' : 'No',
            submission?.timestamp || 'N/A'
        ];
    });
    
    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    console.log('📋 Filtered List (CSV):\n', csv);
    
    // Copy to clipboard if possible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(csv)
            .then(() => alert('✅ Filtered list copied to clipboard!'))
            .catch(() => console.log('Copy to clipboard failed'));
    }
    
    return csv;
}

// ========================================
// INITIALIZATION
// ========================================

// Restore filters on page load
function restoreFilters() {
    const savedGender = localStorage.getItem('filterGender') || 'all';
    const savedSubmission = localStorage.getItem('filterSubmission') || 'all';
    
    if (savedGender !== 'all') {
        activeGenderFilter = savedGender;
        document.querySelector(`[data-filter="${savedGender}"]`)?.classList.add('active');
        document.querySelector('[data-filter="all"]')?.classList.remove('active');
    }
    
    if (savedSubmission !== 'all') {
        activeSubmissionFilter = savedSubmission;
        document.querySelector(`[data-submission="${savedSubmission}"]`)?.classList.add('active');
        document.querySelector('[data-submission="all"]')?.classList.remove('active');
    }
}

// Update filter counts dynamically
function updateFilterCounts() {
    const allCount = STUDENTS.length;
    const boysCount = STUDENTS.filter(s => s.gender === 'male').length;
    const girlsCount = STUDENTS.filter(s => s.gender === 'female').length;
    
    const allBtn = document.querySelector('[data-filter="all"]');
    const boysBtn = document.querySelector('[data-filter="male"]');
    const girlsBtn = document.querySelector('[data-filter="female"]');
    
    if (allBtn) allBtn.textContent = `All (${allCount})`;
    if (boysBtn) boysBtn.textContent = `Boys (${boysCount})`;
    if (girlsBtn) girlsBtn.textContent = `Girls (${girlsCount})`;
}

// Initialize filters when tracker loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Filters system initialized');
    updateFilterCounts();
});

// Export functions for external use
if (typeof window !== 'undefined') {
    window.filterUtils = {
        filterGender,
        filterSubmission,
        sortStudents,
        resetFilters,
        getFilteredStats,
        displayFilterStats,
        showPendingOnly,
        showSubmittedOnly,
        showBoysOnly,
        showGirlsOnly,
        exportFilteredToCSV,
        markAllFilteredAsSubmitted,
        clearAllFilteredSubmissions
    };
}
