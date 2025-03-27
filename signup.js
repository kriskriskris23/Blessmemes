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

// Email/Password Signup
if (signupForm) {
    signupForm.addEventListener("submit", async (event) => { // Changed from e to event
        event.preventDefault();  // Prevent form from submitting and refreshing the page
        const email = signupEmail.value;
        const password = signupPassword.value;

        try {
            // Attempt to create the user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Get user object
            console.log("User created:", user);
            alert("Account created successfully!");
            window.location.href = "login.html"; // Redirect to login page after successful signup
        } catch (error) {
            console.error("Error creating account:", error);
             let errorMessage = "Signup failed. Please check your information."; // Default error message.
              if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email address is already in use.";
              } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address.";
              } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak.  It must be at least 6 characters long.";
              }
            alert(errorMessage); // Show error to the user
        }
    });
}
