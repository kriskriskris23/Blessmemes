// Import Firebase SDKs
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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

// DOM Elements for login
const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const errorMessageDisplay = document.getElementById("error-message"); // Get error message element

// Add event listener to the login button
if (loginBtn) {
    loginBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const email = loginEmail.value;
        const password = loginPassword.value;

        try {
            // Attempt to sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Logged in:", user);
            alert("Logged in successfully!");
            window.location.href = "index.html"; // Redirect to the main page
        } catch (error) {
            // Handle errors during login
            console.error("Error logging in:", error);
            let errorMessage = "Login failed. Please check your email and password.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "User not found. Please check your email.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password. Please try again.";
            }
            errorMessageDisplay.textContent = errorMessage; // Display the error message
            alert(errorMessage);
        }
    });
}
```

I've added error handling and prevented the default form submissi
