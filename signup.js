// Import Firebase SDKs
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
let app, auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// DOM Elements
const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");

// Email/Password Signup
if (signupForm && signupEmail && signupPassword) {
    console.log("Signup form elements found");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();

        console.log("Signup attempt with:", email);

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Signup error:", error);
            if (error.code === "auth/email-already-in-use") {
                alert("🔥 User with that email already exists.");
            } else if (error.code === "auth/invalid-email") {
                alert("🔥 Invalid email format.");
            } else {
                alert(`🔥 Sign up failed: ${error.message}`);
            }
        }
    });
} else {
    console.error("Signup form elements not found:", {
        signupForm: !!signupForm,
        signupEmail: !!signupEmail,
        signupPassword: !!signupPassword
    });
}
