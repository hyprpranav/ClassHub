// ========================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ========================================

// Firebase Configuration from Firebase Console
// Project: ClassHub (classhub-157ab)
// Configured on: January 20, 2026

const firebaseConfig = {
    apiKey: "AIzaSyCNNfGtx-pugDbXUedf24LIGIx5ef4vI",
    authDomain: "classhub-157ab.firebaseapp.com",
    projectId: "classhub-157ab",
    storageBucket: "classhub-157ab.firebasestorage.app",
    messagingSenderId: "635801720533",
    appId: "1:635801720533:web:30894ec3367b6c1b31745c",
    measurementId: "G-SWGLlV7FM7"
};

// Initialize Firebase
let db;
let firebaseInitialized = false;

try {
    // Check if config is properly set
    if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_')) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        firebaseInitialized = true;
        console.log("✅ Firebase initialized successfully");
        
        // Update connection status
        setTimeout(() => {
            const statusEl = document.getElementById('connectionStatus');
            if (statusEl) {
                statusEl.classList.add('online');
                statusEl.title = 'Connected to Firebase';
            }
        }, 1000);
    } else {
        console.warn("⚠️ Firebase not configured. App will work in offline mode with localStorage.");
        console.log("💡 To enable Firebase: Update firebaseConfig in js/firebase.js");
        
        // Update connection status
        setTimeout(() => {
            const statusEl = document.getElementById('connectionStatus');
            if (statusEl) {
                statusEl.title = 'Offline mode (localStorage only)';
            }
        }, 1000);
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    console.log("⚠️ App will continue in offline mode");
}

// ========================================
// FIRESTORE HELPER FUNCTIONS
// ========================================

// Get all students from Firestore
async function getStudentsFromFirestore() {
    try {
        const snapshot = await db.collection('students').get();
        const students = [];
        snapshot.forEach(doc => {
            students.push({ id: doc.id, ...doc.data() });
        });
        return students;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}

// Update student submission status
async function updateSubmissionStatus(registerNumber, status, timestamp) {
    try {
        await db.collection('submissions').doc(registerNumber).set({
            registerNumber: registerNumber,
            submitted: status,
            timestamp: timestamp,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`✅ Updated submission for ${registerNumber}`);
    } catch (error) {
        console.error("Error updating submission:", error);
        throw error;
    }
}

// Get submission status for a student
async function getSubmissionStatus(registerNumber) {
    try {
        const doc = await db.collection('submissions').doc(registerNumber).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting submission status:", error);
        return null;
    }
}

// Get all submissions
async function getAllSubmissions() {
    try {
        const snapshot = await db.collection('submissions').get();
        const submissions = {};
        snapshot.forEach(doc => {
            submissions[doc.id] = doc.data();
        });
        return submissions;
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return {};
    }
}

// Create or update poll
async function savePoll(pollId, pollData) {
    try {
        await db.collection('polls').doc(pollId).set({
            ...pollData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`✅ Poll saved: ${pollId}`);
    } catch (error) {
        console.error("Error saving poll:", error);
        throw error;
    }
}

// Get all polls
async function getAllPolls() {
    try {
        const snapshot = await db.collection('polls').orderBy('createdAt', 'desc').get();
        const polls = [];
        snapshot.forEach(doc => {
            polls.push({ id: doc.id, ...doc.data() });
        });
        return polls;
    } catch (error) {
        console.error("Error fetching polls:", error);
        return [];
    }
}

// Save poll response
async function savePollResponse(pollId, registerNumber, response) {
    try {
        await db.collection('pollResponses').doc(`${pollId}_${registerNumber}`).set({
            pollId: pollId,
            registerNumber: registerNumber,
            response: response,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`✅ Poll response saved for ${registerNumber}`);
    } catch (error) {
        console.error("Error saving poll response:", error);
        throw error;
    }
}

// Get poll responses
async function getPollResponses(pollId) {
    try {
        const snapshot = await db.collection('pollResponses')
            .where('pollId', '==', pollId)
            .get();
        const responses = [];
        snapshot.forEach(doc => {
            responses.push(doc.data());
        });
        return responses;
    } catch (error) {
        console.error("Error fetching poll responses:", error);
        return [];
    }
}

// Reset all data (submissions and polls)
async function resetAllData() {
    try {
        // Delete all submissions
        const submissionsSnapshot = await db.collection('submissions').get();
        const submissionBatch = db.batch();
        submissionsSnapshot.forEach(doc => {
            submissionBatch.delete(doc.ref);
        });
        await submissionBatch.commit();

        // Delete all poll responses
        const responsesSnapshot = await db.collection('pollResponses').get();
        const responsesBatch = db.batch();
        responsesSnapshot.forEach(doc => {
            responsesBatch.delete(doc.ref);
        });
        await responsesBatch.commit();

        console.log("✅ All data reset successfully");
        return true;
    } catch (error) {
        console.error("Error resetting data:", error);
        return false;
    }
}

// Real-time listener for submissions
function subscribeToSubmissions(callback) {
    return db.collection('submissions').onSnapshot(snapshot => {
        const submissions = {};
        snapshot.forEach(doc => {
            submissions[doc.id] = doc.data();
        });
        callback(submissions);
    }, error => {
        console.error("Error in submissions listener:", error);
    });
}

// Real-time listener for polls
function subscribeToPolls(callback) {
    return db.collection('polls').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const polls = [];
        snapshot.forEach(doc => {
            polls.push({ id: doc.id, ...doc.data() });
        });
        callback(polls);
    }, error => {
        console.error("Error in polls listener:", error);
    });
}

// Initialize Firestore collections (run once)
async function initializeCollections() {
    try {
        // Check if students collection exists, if not create it
        const studentsSnapshot = await db.collection('students').limit(1).get();
        if (studentsSnapshot.empty) {
            console.log("Initializing students collection...");
            // Students will be added from students.js
        }
        
        // Create empty submissions collection if needed
        const submissionsSnapshot = await db.collection('submissions').limit(1).get();
        if (submissionsSnapshot.empty) {
            console.log("Submissions collection ready");
        }
        
        // Create empty polls collection if needed
        const pollsSnapshot = await db.collection('polls').limit(1).get();
        if (pollsSnapshot.empty) {
            console.log("Polls collection ready");
        }
        
        return true;
    } catch (error) {
        console.error("Error initializing collections:", error);
        return false;
    }
}

// Auto-initialize on load
if (typeof firebase !== 'undefined' && db) {
    initializeCollections();
}
