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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const errorMessage = document.getElementById("error-message"); // Error message element

// Email/Password Signup
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();  // Prevent form from submitting and refreshing the page
        const email = signupEmail.value;
        const password = signupPassword.value;

        try {
            // Create user with email and password
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            window.location.href = "login.html"; // Redirect to login page after sign up
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                // Handle case when email is already registered
                errorMessage.textContent = "User with that email already exists.";
            } else {
                // Handle other errors
                errorMessage.textContent = `🔥 Sign up failed: ${error.message}`;
            }
        }
    });
}
