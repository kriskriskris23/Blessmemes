// Import Firebase SDKs
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
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
const signupButton = document.getElementById("signup-btn"); // Correct ID

// Email/Password Signup
if (signupButton) { // Changed from signupForm to signupButton
    signupButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = signupEmail.value;
        const password = signupPassword.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User created:", user);
            alert("Account created successfully!");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error creating account:", error);
            let errorMessage = "Signup failed. Please check your information.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email address is already in use.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. It must be at least 6 characters long.";
            }
            alert(errorMessage);
        }
    });
}
