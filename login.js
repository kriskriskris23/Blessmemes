// login.js

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const db = getFirestore(app);

// DOM Elements for login
const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Add event listener to the login button
if (loginBtn) {
    loginBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const email = loginEmail.value;
        const password = loginPassword.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);

            const user = auth.currentUser;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Check if the user is an admin
                if (userData.role !== "admin") {
                    alert("You do not have admin privileges.");
                    window.location.href = "index.html"; // Redirect to non-admin page
                } else {
                    alert("Login successful!");
                    window.location.href = "index.html"; // Redirect to home page
                }
            } else {
                alert("No user data found.");
            }

        } catch (error) {
            alert(`🔥 Login failed: ${error.message}`);
        }
    });
} else {
    console.error("Login button not found.");
}
