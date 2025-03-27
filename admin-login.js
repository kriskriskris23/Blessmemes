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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Admin Identifier
const ADMIN_ID = "admin@example.com"; // Replace with your admin email

// DOM Elements
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminEmail = document.getElementById("admin-email");
const adminPassword = document.getElementById("admin-password");
const errorMessage = document.getElementById("error-message");

if (adminLoginBtn && adminEmail && adminPassword && errorMessage) {
    adminLoginBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = adminEmail.value.trim();
        const password = adminPassword.value.trim();

        if (!email || !password) {
            errorMessage.textContent = "Please enter both email and password.";
            return;
        }

        try {
            // Attempt to sign in
            await signInWithEmailAndPassword(auth, email, password);
            
            // Check if the email matches the admin ID
            if (email === ADMIN_ID) {
                alert("Admin login successful!");
                window.location.href = "index.html"; // Redirect back to main page
            } else {
                errorMessage.textContent = "This account is not an admin.";
                await auth.signOut(); // Sign out non-admin user
            }
        } catch (error) {
            errorMessage.textContent = `🔥 Login failed: ${error.message}`;
        }
    });
} else {
    console.error("Admin login elements not found.");
}
