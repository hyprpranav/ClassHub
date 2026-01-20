# 🎓 ClassHub - Classroom Management System

**A private, front-end-only web application for managing classroom submissions and student polls.**

![ClassHub](https://img.shields.io/badge/Version-1.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📌 Overview

ClassHub is a secure, mobile-friendly classroom management tool designed for:
- **2 Class Representatives (CRs)** to track student submissions
- **1 Faculty Member** to view analytics and polls
- **62 Students** in the classroom

### Key Features
✅ Real-time submission tracking  
✅ Smart search by register number or name  
✅ Gender-wise filtering (Boys/Girls)  
✅ Student polling system  
✅ Advanced analytics dashboard  
✅ Light/Dark theme support  
✅ Mobile-responsive design  
✅ Auto-reset functionality (24 hours)  

---

## 🛠 Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling (Mobile-first design)
- **Vanilla JavaScript** - Logic & Interactions
- **Firebase Firestore** - Real-time database
- **GitHub Pages** - Hosting (free)

**No backend, no server, no domain purchase required!**

---

## 📂 Project Structure

```
classhub/
│
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Complete stylesheet
├── js/
│   ├── firebase.js        # Firebase configuration
│   ├── students.js        # Student dataset (62 students)
│   ├── tracker.js         # Submission tracking logic
│   ├── filters.js         # Filtering & sorting
│   ├── analytics.js       # Statistics & analytics
│   ├── poll.js            # Polling system
│   └── settings.js        # Theme & settings
├── assets/
│   └── icons/             # (Optional icons)
└── README.md              # This file
```

---

## 🚀 Setup Instructions

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `classhub` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### **Step 2: Enable Firestore Database**

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location (closest to India: `asia-south1`)
5. Click **"Enable"**

### **Step 3: Get Firebase Configuration**

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll down to **"Your apps"**
3. Click **"Web"** icon (`</>`)
4. Register app with nickname: `ClassHub`
5. Copy the `firebaseConfig` object

### **Step 4: Configure Firebase in Project**

1. Open `js/firebase.js`
2. Replace the placeholder configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Paste your actual Firebase config here!**

### **Step 5: Set Firestore Security Rules**

1. In Firebase Console, go to **Firestore Database**
2. Click **"Rules"** tab
3. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For testing only
    }
  }
}
```

⚠️ **Note:** For production, implement proper authentication and restrict access.

### **Step 6: Configure Google Drive Links**

1. Create 3 Google Drive folders:
   - Staff Materials
   - Student Materials
   - Photos & Events

2. Make folders **publicly accessible** (Anyone with the link can view)

3. Open `js/tracker.js`

4. Find the `DRIVE_LINKS` object and update:

```javascript
const DRIVE_LINKS = {
    staff: 'https://drive.google.com/drive/folders/YOUR_STAFF_FOLDER_ID',
    student: 'https://drive.google.com/drive/folders/YOUR_STUDENT_FOLDER_ID',
    photos: 'https://drive.google.com/drive/folders/YOUR_PHOTOS_FOLDER_ID'
};
```

### **Step 7: Configure PlaySphere Link** (Optional)

1. Open `js/tracker.js`
2. Find the `openPlaySphere()` function
3. Replace the URL:

```javascript
function openPlaySphere() {
    const playspherURL = 'https://your-playsphere-url.com';
    window.open(playspherURL, '_blank');
}
```

---

## 🌐 Deployment to GitHub Pages

### **Method 1: Using GitHub Web Interface**

1. Create a new repository on GitHub (e.g., `classhub`)
2. Upload all project files
3. Go to **Settings** > **Pages**
4. Under **Source**, select `main` branch
5. Click **Save**
6. Your site will be live at: `https://yourusername.github.io/classhub/`

### **Method 2: Using Git Command Line**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial ClassHub setup"

# Add GitHub remote
git remote add origin https://github.com/yourusername/classhub.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages in repository settings
```

---

## 🔐 Secret Access Code

**Protected Features:**
- Card 1: Submission Tracker
- Card 4: Polling & Analysis

**Secret Code:** `927624`

⚠️ **Keep this code private!** Only share with CRs and Faculty.

**To change the code:**
1. Open `js/tracker.js`
2. Find this line:
```javascript
const SECRET_PARTS = ['927', '624'];
```
3. Modify the parts to create a new 6-digit code

---

## 📊 Student Dataset

**Total Students:** 62 (35 Boys, 27 Girls)  
**Register Numbers:** 927624BEC064 → 927624BEC126  
**Excluded:** 927624BEC077 (Left college)

The complete student list is stored in `js/students.js`.

---

## 🎯 Feature Guide

### **Card 1: Submission Tracker** 🔒

**Purpose:** Track student note submissions

**Features:**
- ✅ Toggle submission status
- 🔍 Smart search (register number or name)
- 🎯 Filters: All / Boys / Girls
- 📊 Filters: All / Submitted / Pending
- 🔄 Sort by: Register / Name / Time
- 📱 Mobile summary popup
- 🔴 Real-time sync across devices

**Usage:**
1. Click on "Submission Tracker" card
2. Enter secret code: `927624`
3. Search for student by register or name
4. Toggle switch to mark submission
5. Timestamp is automatically captured

### **Card 2: Class Drive Hub** 🌐

**Purpose:** Quick access to shared materials

**Links:**
- 👨‍🏫 Staff Materials
- 📚 Student Materials
- 📷 Photos & Events

All links open in new tabs.

### **Card 3: PlaySphere** 🎮

**Purpose:** Redirect to gaming platform

Opens external PlaySphere website in new tab.

### **Card 4: Polling & Analysis** 🔒

**Purpose:** Create polls and view analytics

**Features:**
- 📋 Create Yes/No polls
- 📊 View response statistics
- 👥 Gender-wise breakdown
- 📈 Completion rates
- 📉 Pending students list
- 🔍 Detailed response view

**Usage:**
1. Click "Polling & Analysis" card
2. Enter secret code: `927624`
3. Type poll question (e.g., "Have you completed the assignment?")
4. Click "Create Poll"
5. View real-time responses and analytics

---

## ⚙️ Settings

**Access:** Click ⚙️ icon in header

**Available Settings:**
- 🌓 **Theme:** Light / Dark mode
- 📏 **Font Size:** Small / Medium / Large
- 🔄 **Auto-Reset:** Enable/Disable 24-hour reset
- 🗑️ **Manual Reset:** Clear all data

**Keyboard Shortcuts:**
- `Ctrl+K` / `Cmd+K` - Open settings
- `Ctrl+D` / `Cmd+D` - Toggle theme
- `Escape` - Close settings

---

## 🔧 Troubleshooting

### **Firebase Connection Failed**
- ✅ Check if Firebase config is correctly pasted in `js/firebase.js`
- ✅ Ensure Firestore is enabled in Firebase Console
- ✅ Verify internet connection

### **Data Not Syncing**
- ✅ Check browser console for errors (F12)
- ✅ Ensure Firestore rules allow read/write
- ✅ Refresh the page

### **Secret Code Not Working**
- ✅ Verify code is exactly `927624`
- ✅ Check for extra spaces
- ✅ Clear browser cache

### **Drive Links Not Working**
- ✅ Ensure folders are set to "Anyone with the link"
- ✅ Check if links are correctly pasted in `js/tracker.js`

---

## 📱 Mobile Usage

ClassHub is fully optimized for mobile devices:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Smooth animations
- ✅ Mobile summary popups

**Recommended Browsers:**
- Chrome (Mobile/Desktop)
- Safari (iOS)
- Edge (Mobile/Desktop)

---

## 🔒 Security Notes

1. **Access Control:**
   - Only CRs and Faculty know the secret code
   - Code is obfuscated in JavaScript
   - Not visible in UI or Inspect Element

2. **Firebase Security:**
   - Use Firestore security rules to restrict access
   - Consider implementing authentication for production
   - Enable App Check for additional security

3. **GitHub Pages:**
   - Make repository **private** if possible (requires GitHub Pro)
   - Share URL only with authorized users
   - Change secret code periodically

---

## 📝 Maintenance Tasks

### **Weekly:**
- ✅ Check Firebase usage quota
- ✅ Review submission analytics
- ✅ Backup important data

### **Monthly:**
- ✅ Update Firestore security rules
- ✅ Review student dataset
- ✅ Clear old poll data

### **As Needed:**
- ✅ Add/remove students (edit `js/students.js`)
- ✅ Update Drive links
- ✅ Change secret code
- ✅ Update theme colors in `css/style.css`

---

## 🆘 Support & Contact

For issues or questions:
1. Check browser console (F12) for errors
2. Review Firebase Console for data issues
3. Contact the developer/CR team

---

## 📄 License

**Private Use Only**  
This application is for internal classroom use only.  
Not for commercial distribution.

---

## 🎉 Credits

**Developed for:** Classroom Management  
**Version:** 1.0  
**Last Updated:** January 2026  

---

## ✅ Quick Checklist

Before going live, ensure:

- [ ] Firebase project created and Firestore enabled
- [ ] Firebase config updated in `js/firebase.js`
- [ ] Firestore security rules configured
- [ ] Google Drive folders created and links updated
- [ ] PlaySphere URL configured (if applicable)
- [ ] Secret code shared only with CRs and Faculty
- [ ] Deployed to GitHub Pages
- [ ] Tested on mobile devices
- [ ] All 62 students verified in dataset

---

## 🚧 Future Enhancements (Optional)

- [ ] User authentication (Firebase Auth)
- [ ] Push notifications for submissions
- [ ] Export data to Excel
- [ ] Advanced analytics charts
- [ ] Student self-service portal
- [ ] Attendance tracking
- [ ] Assignment deadline reminders

---

**🎓 Happy Managing with ClassHub!**
