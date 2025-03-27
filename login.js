// Import Firebase Authentication SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDI_fGu98sgzr8ie4DphTFFkApEbwwdSyk",
    authDomain: "blessmemes.firebaseapp.com",
    projectId: "blessmemes",
    storageBucket: "blessmemes.appspot.com",
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
const authMessage = document.getElementById("auth-message");

// Login User
loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        authMessage.textContent = "✅ Logged in successfully!";
    } catch (error) {
        authMessage.textContent = "❌ Error: " + error.message;
    }
});

// Sign Up User
signupBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        authMessage.textContent = "✅ Account created! You are now logged in.";
    } catch (error) {
        authMessage.textContent = "❌ Error: " + error.message;
    }
});

// Logout User
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        authMessage.textContent = "✅ Logged out successfully!";
    } catch (error) {
        authMessage.textContent = "❌ Error: " + error.message;
    }
});

// Track Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        authMessage.textContent = `👤 Logged in as: ${user.email}`;
        logoutBtn.style.display = "block";
    } else {
        authMessage.textContent = "🔒 Not logged in.";
        logoutBtn.style.display = "none";
    }
});
