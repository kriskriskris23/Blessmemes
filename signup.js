// signup.js

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// DOM Elements
const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");

// Email/Password Signup
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();  // Prevent form from submitting and refreshing the page
        const email = signupEmail.value;
        const password = signupPassword.value;

        try {
            // Attempt to create the user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Assign admin role to yourself or a specific UID (replace 'your-uid-here' with actual UID)
            const userRole = (user.uid === "your-uid-here") ? "admin" : "user"; 

            await setDoc(doc(db, "users", user.uid), { role: userRole });
            alert("Account created successfully!");
            window.location.href = "login.html"; // Redirect to login page after sign-up

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("🔥 User with that email already exists.");
            } else {
                alert(`🔥 Sign up failed: ${error.message}`);
            }
        }
    });
}
