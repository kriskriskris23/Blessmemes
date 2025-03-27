// Import Firebase SDKs
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

// Firebase Configuration
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
const provider = new GoogleAuthProvider();

// DOM Elements for login
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const googleLoginBtn = document.getElementById("google-login-btn");
const signUpBtn = document.getElementById("sign-up-btn"); // Add sign-up button element

// Email/Password Login
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            alert(`🔥 Login failed: ${error.message}`);
        }
    });
}

// Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            alert(`🔥 Google login failed: ${error.message}`);
        }
    });
}

// Redirect to Sign-up Page when Sign-up button is clicked
if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
        window.location.href = "signup.html"; // Redirect to sign-up page
    });
}
