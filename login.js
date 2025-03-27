// Import Firebase SDKs
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
    console.log("Firebase initialized successfully in login.js");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// DOM Elements for login
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn"); // Added
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Add event listener to the login button
if (loginBtn && loginEmail && loginPassword) {
    console.log("Login elements found");
    loginBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        console.log("Login attempt with:", email);

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect to home page after login
        } catch (error) {
            console.error("Login error:", error);
            alert(`🔥 Login failed: ${error.message}`);
        }
    });
} else {
    console.error("Login elements not found:", {
        loginBtn: !!loginBtn,
        loginEmail: !!loginEmail,
        loginPassword: !!loginPassword
    });
}

// Add event listener to the signup button
if (signupBtn) {
    console.log("Signup button found");
    signupBtn.addEventListener("click", () => {
        console.log("Signup button clicked, redirecting to signup.html");
        window.location.href = "signup.html"; // Redirect to signup page
    });
} else {
    console.error("Signup button not found");
}
