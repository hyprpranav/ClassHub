// ========================================
// ANALYTICS & STATISTICS
// Generate insights from submissions and polls
// ========================================

// ========================================
// LOAD ANALYTICS
// ========================================

function loadAnalytics() {
    const analyticsContainer = document.getElementById('analyticsData');
    if (!analyticsContainer) return;
    
    const stats = calculateAnalytics();
    renderAnalytics(stats);
}

// ========================================
// CALCULATE ANALYTICS
// ========================================

function calculateAnalytics() {
    // Submission analytics
    const totalStudents = STUDENTS.length;
    const submittedCount = Object.values(currentSubmissions).filter(s => s.submitted).length;
    const pendingCount = totalStudents - submittedCount;
    const submissionRate = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;
    
    // Gender-wise submission stats
    const boysTotal = STUDENTS.filter(s => s.gender === 'male').length;
    const girlsTotal = STUDENTS.filter(s => s.gender === 'female').length;
    
    const boysSubmitted = STUDENTS.filter(student => 
        student.gender === 'male' && currentSubmissions[student.register]?.submitted
    ).length;
    
    const girlsSubmitted = STUDENTS.filter(student => 
        student.gender === 'female' && currentSubmissions[student.register]?.submitted
    ).length;
    
    const boysSubmissionRate = boysTotal > 0 ? Math.round((boysSubmitted / boysTotal) * 100) : 0;
    const girlsSubmissionRate = girlsTotal > 0 ? Math.round((girlsSubmitted / girlsTotal) * 100) : 0;
    
    // Poll analytics
    const totalPolls = activePolls.length;
    let avgPollResponse = 0;
    
    if (totalPolls > 0) {
        const totalResponses = activePolls.reduce((sum, poll) => {
            const responses = poll.responses ? Object.keys(poll.responses).length : 0;
            return sum + responses;
        }, 0);
        avgPollResponse = Math.round(totalResponses / totalPolls);
    }
    
    // Time-based analytics
    const submissionsToday = Object.values(currentSubmissions).filter(sub => {
        if (!sub.timestamp) return false;
        const submitDate = new Date(sub.timestamp);
        const today = new Date();
        return submitDate.toDateString() === today.toDateString();
    }).length;
    
    return {
        totalStudents,
        submittedCount,
        pendingCount,
        submissionRate,
        boysTotal,
        girlsTotal,
        boysSubmitted,
        girlsSubmitted,
        boysSubmissionRate,
        girlsSubmissionRate,
        totalPolls,
        avgPollResponse,
        submissionsToday
    };
}

// ========================================
// RENDER ANALYTICS
// ========================================

function renderAnalytics(stats) {
    const analyticsContainer = document.getElementById('analyticsData');
    
    analyticsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.submissionRate}%</div>
            <div class="stat-label">Overall Submission Rate</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.submittedCount} / ${stats.totalStudents}</div>
            <div class="stat-label">Total Submissions</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.pendingCount}</div>
            <div class="stat-label">Pending Submissions</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.submissionsToday}</div>
            <div class="stat-label">Submissions Today</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.boysSubmissionRate}%</div>
            <div class="stat-label">👦 Boys Submission Rate (${stats.boysSubmitted}/${stats.boysTotal})</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.girlsSubmissionRate}%</div>
            <div class="stat-label">👧 Girls Submission Rate (${stats.girlsSubmitted}/${stats.girlsTotal})</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.totalPolls}</div>
            <div class="stat-label">Active Polls</div>
        </div>
        
        <div class="stat-card">
            <div class="stat-value">${stats.avgPollResponse}</div>
            <div class="stat-label">Avg Poll Responses</div>
        </div>
    `;
}

// ========================================
// DETAILED ANALYTICS
// ========================================

function getDetailedAnalytics() {
    const stats = calculateAnalytics();
    
    // Find top performers (students who submitted recently)
    const recentSubmissions = Object.entries(currentSubmissions)
        .filter(([_, sub]) => sub.submitted && sub.timestamp)
        .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
        .slice(0, 5)
        .map(([register]) => {
            const student = STUDENTS.find(s => s.register === register);
            return student ? student.name : register;
        });
    
    // Find pending students
    const pendingStudents = STUDENTS
        .filter(student => !currentSubmissions[student.register]?.submitted)
        .map(s => ({ register: s.register, name: s.name }));
    
    // Poll completion rates
    const pollStats = activePolls.map(poll => {
        const responseCount = poll.responses ? Object.keys(poll.responses).length : 0;
        const completionRate = Math.round((responseCount / STUDENTS.length) * 100);
        return {
            question: poll.question,
            responses: responseCount,
            completionRate
        };
    });
    
    return {
        ...stats,
        recentSubmissions,
        pendingStudents,
        pollStats
    };
}

// ========================================
// EXPORT ANALYTICS REPORT
// ========================================

function generateAnalyticsReport() {
    const analytics = getDetailedAnalytics();
    const timestamp = new Date().toLocaleString('en-IN');
    
    const report = `
╔════════════════════════════════════════════════════════════╗
║           CLASSHUB ANALYTICS REPORT                        ║
║           Generated: ${timestamp}                          ║
╚════════════════════════════════════════════════════════════╝

📊 SUBMISSION STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Students:              ${analytics.totalStudents}
Submitted:                   ${analytics.submittedCount}
Pending:                     ${analytics.pendingCount}
Overall Submission Rate:     ${analytics.submissionRate}%
Submissions Today:           ${analytics.submissionsToday}

👦 BOYS STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Boys:                  ${analytics.boysTotal}
Boys Submitted:              ${analytics.boysSubmitted}
Boys Submission Rate:        ${analytics.boysSubmissionRate}%

👧 GIRLS STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Girls:                 ${analytics.girlsTotal}
Girls Submitted:             ${analytics.girlsSubmitted}
Girls Submission Rate:       ${analytics.girlsSubmissionRate}%

📋 POLL STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active Polls:                ${analytics.totalPolls}
Avg Poll Responses:          ${analytics.avgPollResponse}

${analytics.pollStats.length > 0 ? `
POLL BREAKDOWN:
${analytics.pollStats.map(p => 
    `  • ${p.question}\n    Responses: ${p.responses}/${analytics.totalStudents} (${p.completionRate}%)`
).join('\n')}
` : ''}

⏳ PENDING STUDENTS (${analytics.pendingStudents.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${analytics.pendingStudents.length > 0 ? 
    analytics.pendingStudents.slice(0, 10).map(s => `  • ${s.register} - ${s.name}`).join('\n') +
    (analytics.pendingStudents.length > 10 ? `\n  ... and ${analytics.pendingStudents.length - 10} more` : '')
    : '  ✅ All students have submitted!'}

╚════════════════════════════════════════════════════════════╝
    `;
    
    console.log(report);
    
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(report)
            .then(() => alert('✅ Analytics report copied to clipboard!'))
            .catch(() => console.log('Copy failed'));
    }
    
    return report;
}

// ========================================
// COMPARISON ANALYTICS
// ========================================

function compareGenderPerformance() {
    const stats = calculateAnalytics();
    
    const comparison = {
        boys: {
            total: stats.boysTotal,
            submitted: stats.boysSubmitted,
            pending: stats.boysTotal - stats.boysSubmitted,
            rate: stats.boysSubmissionRate
        },
        girls: {
            total: stats.girlsTotal,
            submitted: stats.girlsSubmitted,
            pending: stats.girlsTotal - stats.girlsSubmitted,
            rate: stats.girlsSubmissionRate
        },
        difference: Math.abs(stats.boysSubmissionRate - stats.girlsSubmissionRate),
        leader: stats.boysSubmissionRate > stats.girlsSubmissionRate ? 'Boys' : 
                stats.girlsSubmissionRate > stats.boysSubmissionRate ? 'Girls' : 'Tied'
    };
    
    console.log('📊 Gender Performance Comparison:', comparison);
    return comparison;
}

// ========================================
// TREND ANALYSIS
// ========================================

function analyzeSubmissionTrend() {
    const submissions = Object.values(currentSubmissions)
        .filter(sub => sub.submitted && sub.timestamp)
        .map(sub => new Date(sub.timestamp));
    
    if (submissions.length === 0) {
        return { trend: 'No data', peakTime: null };
    }
    
    // Group by hour
    const hourCounts = {};
    submissions.forEach(date => {
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // Find peak hour
    const peakHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Calculate trend (last 24 hours vs previous)
    const now = new Date();
    const last24h = submissions.filter(date => 
        (now - date) < 24 * 60 * 60 * 1000
    ).length;
    
    return {
        peakHour: peakHour ? `${peakHour[0]}:00 (${peakHour[1]} submissions)` : 'N/A',
        last24Hours: last24h,
        totalSubmissions: submissions.length,
        trend: last24h > submissions.length / 2 ? 'Increasing' : 'Stable'
    };
}

// ========================================
// INITIALIZE ANALYTICS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📈 Analytics system initialized');
    
    // Auto-refresh analytics every 30 seconds when polling view is open
    setInterval(() => {
        const pollingView = document.getElementById('pollingView');
        if (pollingView && !pollingView.classList.contains('hidden')) {
            loadAnalytics();
        }
    }, 30000);
});

// Export functions
if (typeof window !== 'undefined') {
    window.analyticsUtils = {
        loadAnalytics,
        calculateAnalytics,
        getDetailedAnalytics,
        generateAnalyticsReport,
        compareGenderPerformance,
        analyzeSubmissionTrend
    };
}

console.log('📊 Analytics system loaded');
