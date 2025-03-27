// Import Firebase SDKs
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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

// DOM Elements
const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const googleSignupBtn = document.getElementById("google-signup-btn");

// Email/Password Signup
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();  // Prevent form from submitting and refreshing the page
        const email = signupEmail.value;
        const password = signupPassword.value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            window.location.href = "index.html"; // Redirect after signup
        } catch (error) {
            alert(`🔥 Sign up failed: ${error.message}`);
        }
    });
}

// Google Sign-Up
if (googleSignupBtn) {
    googleSignupBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("Account created successfully with Google!");
            window.location.href = "index.html"; // Redirect after signup
        } catch (error) {
            alert(`🔥 Google sign-up failed: ${error.message}`);
        }
    });
}
