import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ADMIN_ID = "adminaccount@gmail.com"; // Match the email from Firebase

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
            await signInWithEmailAndPassword(auth, email, password);
            if (email === ADMIN_ID) {
                alert("Admin login successful!");
                window.location.href = "index.html";
            } else {
                errorMessage.textContent = "This account is not an admin.";
                await auth.signOut();
            }
        } catch (error) {
            errorMessage.textContent = `🔥 Login failed: ${error.message}`;
        }
    });
} else {
    console.error("Admin login elements not found.");
}
