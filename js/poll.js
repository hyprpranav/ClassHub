// ========================================
// POLLING SYSTEM
// Create polls, collect responses, and view results
// ========================================

let activePolls = [];
let pollResponses = {};
let pollsListener = null;

// ========================================
// POLLING VIEW MANAGEMENT
// ========================================

function openPollingView() {
    console.log('📊 Opening polling view...');
    const pollingView = document.getElementById('pollingView');
    
    if (!pollingView) {
        console.error('Polling view element not found!');
        alert('Error: Polling view not found. Please refresh the page.');
        return;
    }
    
    pollingView.classList.remove('hidden');
    pollingView.style.display = 'block';
    
    loadPolls();
    
    if (typeof subscribeToPolls === 'function' && typeof db !== 'undefined' && db) {
        startPollSync();
    }
    
    console.log('✅ Polling view opened');
}

// ========================================
// POLL CREATION
// ========================================

async function createPoll() {
    const questionInput = document.getElementById('pollQuestion');
    const question = questionInput.value.trim();
    
    if (!question) {
        alert('⚠️ Please enter a poll question');
        return;
    }
    
    try {
        const pollId = 'poll_' + Date.now();
        const pollData = {
            id: pollId,
            question: question,
            options: ['Yes', 'No'],
            responses: {},
            createdAt: new Date().toISOString(),
            active: true
        };
        
        // Save to localStorage immediately
        activePolls.unshift(pollData);
        localStorage.setItem('classHubPolls', JSON.stringify(activePolls));
        console.log('✅ Poll saved to local storage');
        
        // Try to save to Firebase if available
        if (typeof savePoll === 'function' && typeof db !== 'undefined' && db) {
            try {
                await savePoll(pollId, pollData);
                console.log('✅ Poll synced to Firebase');
            } catch (fbError) {
                console.log('⚠️ Firebase sync failed, poll saved locally');
            }
        }
        
        questionInput.value = '';
        alert('✅ Poll created successfully!');
        
        // Reload polls
        renderPolls();
        loadAnalytics();
        
    } catch (error) {
        console.error('Error creating poll:', error);
        alert('❌ Failed to create poll. Please try again.');
    }
}

// ========================================
// POLL LOADING & RENDERING
// ========================================

async function loadPolls() {
    try {
        // Load from localStorage first
        const localPolls = localStorage.getItem('classHubPolls');
        if (localPolls) {
            activePolls = JSON.parse(localPolls);
            console.log('✅ Loaded polls from local storage');
        }
        
        // Try Firebase if available
        if (typeof getAllPolls === 'function' && typeof db !== 'undefined' && db) {
            try {
                const firebasePolls = await getAllPolls();
                if (firebasePolls.length > 0) {
                    activePolls = firebasePolls;
                }
                console.log('✅ Synced polls with Firebase');
            } catch (fbError) {
                console.log('⚠️ Firebase not available for polls, using local storage');
            }
        }
        
        renderPolls();
        loadAnalytics();
    } catch (error) {
        console.error('Error loading polls:', error);
        activePolls = [];
        renderPolls();
        loadAnalytics();
    }
}

function renderPolls() {
    const pollsList = document.getElementById('activePollsList');
    
    if (activePolls.length === 0) {
        pollsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No active polls yet. Create one above!</p>';
        return;
    }
    
    pollsList.innerHTML = activePolls.map(poll => {
        const responseCount = poll.responses ? Object.keys(poll.responses).length : 0;
        const yesCount = poll.responses ? Object.values(poll.responses).filter(r => r === 'Yes').length : 0;
        const noCount = poll.responses ? Object.values(poll.responses).filter(r => r === 'No').length : 0;
        
        return `
            <div class="poll-item">
                <h4 class="poll-question">${poll.question}</h4>
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                    📊 ${responseCount} / ${STUDENTS.length} responses
                </p>
                
                <div class="poll-results">
                    <div style="margin-bottom: 0.5rem;">
                        <strong>✅ Yes:</strong> ${yesCount} (${Math.round((yesCount / STUDENTS.length) * 100)}%)
                        <div style="background: var(--bg-secondary); height: 8px; border-radius: 4px; margin-top: 4px; overflow: hidden;">
                            <div style="background: var(--success); height: 100%; width: ${(yesCount / STUDENTS.length) * 100}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <div>
                        <strong>❌ No:</strong> ${noCount} (${Math.round((noCount / STUDENTS.length) * 100)}%)
                        <div style="background: var(--bg-secondary); height: 8px; border-radius: 4px; margin-top: 4px; overflow: hidden;">
                            <div style="background: var(--danger); height: 100%; width: ${(noCount / STUDENTS.length) * 100}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button onclick="viewPollDetails('${poll.id}')" class="btn-primary" style="flex: 1; padding: 0.5rem;">
                        View Details
                    </button>
                    <button onclick="deletePoll('${poll.id}')" class="btn-danger" style="flex: 1; padding: 0.5rem;">
                        Delete Poll
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// POLL RESPONSE (For Students - future use)
// ========================================

async function respondToPoll(pollId, registerNumber, response) {
    try {
        await savePollResponse(pollId, registerNumber, response);
        
        // Update local poll data
        const poll = activePolls.find(p => p.id === pollId);
        if (poll) {
            if (!poll.responses) poll.responses = {};
            poll.responses[registerNumber] = response;
        }
        
        console.log(`✅ Response saved: ${registerNumber} → ${response}`);
        renderPolls();
        
    } catch (error) {
        console.error('Error saving response:', error);
        alert('❌ Failed to save response. Please try again.');
    }
}

// ========================================
// POLL DETAILS VIEW
// ========================================

function viewPollDetails(pollId) {
    const poll = activePolls.find(p => p.id === pollId);
    if (!poll) return;
    
    const responses = poll.responses || {};
    
    // Separate students by response
    const yesStudents = STUDENTS.filter(s => responses[s.register] === 'Yes');
    const noStudents = STUDENTS.filter(s => responses[s.register] === 'No');
    const pendingStudents = STUDENTS.filter(s => !responses[s.register]);
    
    let detailsHTML = `
        <div style="max-height: 70vh; overflow-y: auto; padding: 1rem;">
            <h3 style="margin-bottom: 1rem;">${poll.question}</h3>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--success); margin-bottom: 0.5rem;">✅ Yes (${yesStudents.length})</h4>
                ${yesStudents.length > 0 ? 
                    yesStudents.map(s => `<div style="padding: 0.5rem; background: var(--bg-secondary); margin-bottom: 0.25rem; border-radius: 4px;">${s.register} - ${s.name}</div>`).join('') 
                    : '<p style="color: var(--text-secondary);">No responses yet</p>'
                }
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--danger); margin-bottom: 0.5rem;">❌ No (${noStudents.length})</h4>
                ${noStudents.length > 0 ? 
                    noStudents.map(s => `<div style="padding: 0.5rem; background: var(--bg-secondary); margin-bottom: 0.25rem; border-radius: 4px;">${s.register} - ${s.name}</div>`).join('') 
                    : '<p style="color: var(--text-secondary);">No responses yet</p>'
                }
            </div>
            
            <div>
                <h4 style="color: var(--warning); margin-bottom: 0.5rem;">⏳ Pending (${pendingStudents.length})</h4>
                ${pendingStudents.length > 0 ? 
                    pendingStudents.map(s => `<div style="padding: 0.5rem; background: var(--bg-secondary); margin-bottom: 0.25rem; border-radius: 4px;">${s.register} - ${s.name}</div>`).join('') 
                    : '<p style="color: var(--text-secondary);">All students responded!</p>'
                }
            </div>
        </div>
    `;
    
    const modal = document.getElementById('summaryModal');
    const content = document.getElementById('summaryContent');
    content.innerHTML = detailsHTML;
    modal.classList.add('active');
}

// ========================================
// DELETE POLL
// ========================================

async function deletePoll(pollId) {
    const confirmation = confirm('Are you sure you want to delete this poll?');
    if (!confirmation) return;
    
    try {
        // Delete from Firestore
        await db.collection('polls').doc(pollId).delete();
        
        // Delete all responses for this poll
        const responsesSnapshot = await db.collection('pollResponses')
            .where('pollId', '==', pollId)
            .get();
        
        const batch = db.batch();
        responsesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        
        alert('✅ Poll deleted successfully');
        await loadPolls();
        
    } catch (error) {
        console.error('Error deleting poll:', error);
        alert('❌ Failed to delete poll. Please try again.');
    }
}

// ========================================
// REAL-TIME POLL SYNC
// ========================================

function startPollSync() {
    if (pollsListener) return;
    
    // Only start if Firebase is available
    if (typeof subscribeToPolls !== 'function' || typeof db === 'undefined' || !db) {
        console.log('⚠️ Firebase not available for polls, real-time sync disabled');
        return;
    }
    
    try {
        pollsListener = subscribeToPolls((polls) => {
            activePolls = polls;
            localStorage.setItem('classHubPolls', JSON.stringify(polls));
            renderPolls();
            loadAnalytics();
            console.log('📡 Polls updated in real-time');
        });
    } catch (error) {
        console.error('Error starting poll sync:', error);
    }
}

function stopPollSync() {
    if (pollsListener) {
        pollsListener();
        pollsListener = null;
    }
}

// ========================================
// EXPORT POLL DATA
// ========================================

function exportPollData(pollId) {
    const poll = activePolls.find(p => p.id === pollId);
    if (!poll) return;
    
    const responses = poll.responses || {};
    const csv = STUDENTS.map(student => {
        return `"${student.register}","${student.name}","${responses[student.register] || 'No Response'}"`;
    }).join('\n');
    
    const fullCSV = `"Register Number","Name","Response"\n${csv}`;
    
    console.log('📋 Poll Data (CSV):\n', fullCSV);
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullCSV)
            .then(() => alert('✅ Poll data copied to clipboard!'))
            .catch(() => console.log('Copy failed'));
    }
    
    return fullCSV;
}

console.log('📊 Polling system initialized');
