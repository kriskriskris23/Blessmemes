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
window.db = db; // ✅ Ensure Firestore is globally accessible

// Debug Firestore Setup
console.log("🔥 Firestore initialized:", window.db);

// DOM Elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCount = document.getElementById("vote-count");

// Local Storage to track votes
const userVote = localStorage.getItem("userVote");

// Check if user already voted
if (userVote) {
    blessBtn.disabled = true;
    curseBtn.disabled = true;
}

// Function to Get Firestore Document Reference
function getVoteDocRef() {
    if (!window.db) {
        console.error("🚨 Firestore is not initialized!");
        return null;
    }
    return doc(window.db, "votes", "meme1");
}

// Fetch vote count from Firestore
async function fetchVotes() {
    const docRef = getVoteDocRef();
    if (!docRef) return;

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        voteCount.textContent = docSnap.data().count;
    } else {
        await setDoc(docRef, { count: 0 });
        voteCount.textContent = 0;
    }
}

// Vote function
async function vote(type) {
    if (localStorage.getItem("userVote")) {
        alert("You have already voted.");
        return;
    }

    const docRef = getVoteDocRef();
    if (!docRef) return;

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const newCount = docSnap.data().count + 1;
        await updateDoc(docRef, { count: newCount });
        voteCount.textContent = newCount;
    }

    localStorage.setItem("userVote", type);
    blessBtn.disabled = true;
    curseBtn.disabled = true;
    alert("Thank you for voting!");
}

// Event Listeners
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// Fetch initial votes
fetchVotes();
