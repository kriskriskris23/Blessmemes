import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("You must be logged in to access this page.");
        window.location.href = "login.html"; // Redirect to login
    }
});
// Import Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDI_fGu98sgzr8ie4DphTFFkApEbwwdSyk",
    authDomain: "blessmemes.firebaseapp.com",
    projectId: "blessmemes",
    storageBucket: "blessmemes.firebasestorage.app",
    messagingSenderId: "647948484551",
    appId: "1:647948484551:web:db884bd3346d838737e3e2",
    measurementId: "G-0GY321M1ML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const errorMessage = document.getElementById("error-message");

// Handle Login
loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to main page
    } catch (error) {
        errorMessage.textContent = "🔥 Error: " + error.message;
    }
});

// Handle Signup
signupBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully! Please log in.");
    } catch (error) {
        errorMessage.textContent = "🔥 Error: " + error.message;
    }
});

// Handle Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        logoutBtn.style.display = "none";
    } catch (error) {
        errorMessage.textContent = "🔥 Error: " + error.message;
    }
});

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        logoutBtn.style.display = "block";
    } else {
        console.log("No user logged in.");
        logoutBtn.style.display = "none";
    }
});
