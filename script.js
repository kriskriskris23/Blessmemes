// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const db = getFirestore(app);
window.db = db; // ✅ Make Firestore available globally

console.log("🔥 Firestore Initialized:", window.db);

// Get elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");

const docRef = doc(db, "votes", "meme1");

// Function to update vote count
async function updateVoteCount() {
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            voteCountSpan.textContent = docSnap.data().count;
        } else {
            await setDoc(docRef, { count: 0 });
            voteCountSpan.textContent = 0;
        }
    } catch (error) {
        console.error("🔥 Error updating vote count:", error);
    }
}

// Function to handle voting
async function vote(type) {
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentVotes = docSnap.data().count || 0;
            await updateDoc(docRef, { count: type === "bless" ? currentVotes + 1 : currentVotes - 1 });
            updateVoteCount();
            alert("Thank you for voting!");
        }
    } catch (error) {
        console.error("🔥 Error voting:", error);
    }
}

// Event listeners
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// Initialize vote count on page load
updateVoteCount();
