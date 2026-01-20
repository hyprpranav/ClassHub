// ========================================
// STUDENT DATASET - LOCKED & FINAL
// Total: 62 Students (33 Boys, 29 Girls)
// Register Numbers: 927624BEC064 - 927624BEC126
// Excluded: 927624BEC077 (Left college)
// ========================================

const STUDENTS = [
    // === BOYS (33) ===
    { register: "927624BEC064", name: "HARIPRASANTH K", gender: "male" },
    { register: "927624BEC065", name: "HARISH N", gender: "male" },
    { register: "927624BEC066", name: "HARISH PRANAV S", gender: "male" },
    { register: "927624BEC067", name: "HARISHWAR S", gender: "male" },
    { register: "927624BEC072", name: "HEMANATHAN A", gender: "male" },
    { register: "927624BEC074", name: "INPAASUGAN C", gender: "male" },
    { register: "927624BEC078", name: "JEEVA D", gender: "male" },
    { register: "927624BEC079", name: "JEYA KRISHNAN T", gender: "male" },
    { register: "927624BEC080", name: "JEYAHARISH T", gender: "male" },
    { register: "927624BEC081", name: "KAISER RAHMAN M", gender: "male" },
    { register: "927624BEC083", name: "KALAIPRIYAN K", gender: "male" },
    { register: "927624BEC088", name: "KANSUL AASIF A", gender: "male" },
    { register: "927624BEC091", name: "KARNAN S", gender: "male" },
    { register: "927624BEC092", name: "KARTHICK B", gender: "male" },
    { register: "927624BEC093", name: "KARTHICK BALAJI V", gender: "male" },
    { register: "927624BEC094", name: "KARTHICK R", gender: "male" },
    { register: "927624BEC095", name: "KARTHICKVEL C", gender: "male" },
    { register: "927624BEC098", name: "KAVIN KUMAR P", gender: "male" },
    { register: "927624BEC099", name: "KAVIN VARSAN M", gender: "male" },
    { register: "927624BEC101", name: "KAVIRAJ A", gender: "male" },
    { register: "927624BEC103", name: "KAVIVENDAN S", gender: "male" },
    { register: "927624BEC108", name: "KEVIN ANDREWS S", gender: "male" },
    { register: "927624BEC109", name: "KIRAN T", gender: "male" },
    { register: "927624BEC111", name: "KISHOR K", gender: "male" },
    { register: "927624BEC112", name: "KISHORE S", gender: "male" },
    { register: "927624BEC113", name: "LEANDER SHYAM S", gender: "male" },
    { register: "927624BEC115", name: "LOGINATH A", gender: "male" },
    { register: "927624BEC117", name: "MADHAN S", gender: "male" },
    { register: "927624BEC121", name: "MAHIL RAM E K", gender: "male" },
    { register: "927624BEC123", name: "MANISH S", gender: "male" },
    { register: "927624BEC124", name: "MANOJ KUMAR S", gender: "male" },
    { register: "927624BEC125", name: "MANOJ S", gender: "male" },
    { register: "927624BEC126", name: "MANOJ KUMAR S", gender: "male" },

    // === GIRLS (29) ===
    { register: "927624BEC068", name: "HARSHINI E", gender: "female" },
    { register: "927624BEC069", name: "HARSHITHA V", gender: "female" },
    { register: "927624BEC070", name: "HARSITHAASREE P", gender: "female" },
    { register: "927624BEC071", name: "HEARTLIN RENOFER FERNANDO I", gender: "female" },
    { register: "927624BEC073", name: "HEMAVATHY P", gender: "female" },
    { register: "927624BEC075", name: "JANANI B", gender: "female" },
    { register: "927624BEC076", name: "JANANI N", gender: "female" },
    { register: "927624BEC082", name: "KALAI T", gender: "female" },
    { register: "927624BEC084", name: "KALAISELVI A", gender: "female" },
    { register: "927624BEC085", name: "KALESWARI M", gender: "female" },
    { register: "927624BEC086", name: "KAMALI G", gender: "female" },
    { register: "927624BEC087", name: "KANIMOZHI T", gender: "female" },
    { register: "927624BEC089", name: "KARISHMA M", gender: "female" },
    { register: "927624BEC090", name: "KARJITHA K", gender: "female" },
    { register: "927624BEC096", name: "KARTHIKA S", gender: "female" },
    { register: "927624BEC097", name: "KARTHIKAA S", gender: "female" },
    { register: "927624BEC100", name: "KAVIPRIYA N", gender: "female" },
    { register: "927624BEC102", name: "KAVISHKA B", gender: "female" },
    { register: "927624BEC104", name: "KAVIYA G", gender: "female" },
    { register: "927624BEC105", name: "KAVIYA T", gender: "female" },
    { register: "927624BEC106", name: "KAVIYA V", gender: "female" },
    { register: "927624BEC107", name: "KEERTHANA S", gender: "female" },
    { register: "927624BEC110", name: "KIRUTHIKA S", gender: "female" },
    { register: "927624BEC114", name: "LOGAVARSHINI P", gender: "female" },
    { register: "927624BEC116", name: "LUCKSHANA G", gender: "female" },
    { register: "927624BEC118", name: "MADHUMITHA E", gender: "female" },
    { register: "927624BEC119", name: "MADHUMITHA M", gender: "female" },
    { register: "927624BEC120", name: "MAHALAKSHMI R", gender: "female" },
    { register: "927624BEC122", name: "MANASA T P", gender: "female" }
];

// ========================================
// STUDENT UTILITY FUNCTIONS
// ========================================

// Get total count
function getTotalStudents() {
    return STUDENTS.length;
}

// Get boys count
function getBoysCount() {
    return STUDENTS.filter(s => s.gender === "male").length;
}

// Get girls count
function getGirlsCount() {
    return STUDENTS.filter(s => s.gender === "female").length;
}

// Get student by register number
function getStudentByRegister(registerNumber) {
    return STUDENTS.find(s => s.register === registerNumber);
}

// Search students by name or register
function searchStudents(query) {
    const lowerQuery = query.toLowerCase();
    return STUDENTS.filter(student => 
        student.name.toLowerCase().includes(lowerQuery) ||
        student.register.toLowerCase().includes(lowerQuery)
    );
}

// Filter students by gender
function filterByGender(gender) {
    if (gender === 'all') return STUDENTS;
    return STUDENTS.filter(s => s.gender === gender);
}

// Get students sorted by register number
function sortByRegister(ascending = true) {
    return [...STUDENTS].sort((a, b) => {
        return ascending ? 
            a.register.localeCompare(b.register) : 
            b.register.localeCompare(a.register);
    });
}

// Get students sorted by name
function sortByName(ascending = true) {
    return [...STUDENTS].sort((a, b) => {
        return ascending ? 
            a.name.localeCompare(b.name) : 
            b.name.localeCompare(a.name);
    });
}

// Validate register number exists
function isValidRegister(registerNumber) {
    return STUDENTS.some(s => s.register === registerNumber);
}

// Get student display info
function getStudentDisplayInfo(student) {
    return {
        register: student.register,
        name: student.name,
        gender: student.gender,
        genderIcon: student.gender === 'male' ? '👦' : '👧',
        genderLabel: student.gender === 'male' ? 'Boy' : 'Girl'
    };
}

// Get statistics
function getStudentStats() {
    return {
        total: getTotalStudents(),
        boys: getBoysCount(),
        girls: getGirlsCount(),
        excluded: 1, // 927624BEC077
        excludedRegister: "927624BEC077"
    };
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.STUDENTS = STUDENTS;
    window.studentUtils = {
        getTotalStudents,
        getBoysCount,
        getGirlsCount,
        getStudentByRegister,
        searchStudents,
        filterByGender,
        sortByRegister,
        sortByName,
        isValidRegister,
        getStudentDisplayInfo,
        getStudentStats
    };
}

console.log(`✅ Student dataset loaded: ${STUDENTS.length} students`);
console.log(`   👦 Boys: ${getBoysCount()}`);
console.log(`   👧 Girls: ${getGirlsCount()}`);
