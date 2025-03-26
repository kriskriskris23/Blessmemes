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

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;

// DOM Elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");

// Firestore Document Reference
const docRef = doc(db, "votes", "meme1");

// Load the last vote from local storage
let lastVote = localStorage.getItem("lastVote") || null;

// Fetch & Update Vote Count
async function updateVoteCount() {
    try {
        const docSnap = await getDoc(docRef);
        let voteCount = 0;

        if (docSnap.exists()) {
            voteCount = docSnap.data().count;
        } else {
            await setDoc(docRef, { count: 0 });
        }

        voteCountSpan.textContent = voteCount;
    } catch (error) {
        console.error("🔥 Error fetching votes:", error);
    }
}

// Handle Vote Logic
async function vote(type) {
    try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return;

        let currentVotes = docSnap.data().count || 0;

        if (lastVote === type) {
            // Cancel the previous vote
            await updateDoc(docRef, { count: currentVotes + (type === "bless" ? -1 : 1) });
            lastVote = null;
            localStorage.removeItem("lastVote");
            alert("Vote canceled!");
        } else if (lastVote === null) {
            // Cast a new vote
            await updateDoc(docRef, { count: currentVotes + (type === "bless" ? 1 : -1) });
            lastVote = type;
            localStorage.setItem("lastVote", type);
            alert("Thank you for voting!");
        } else {
            alert("You must cancel your previous vote before voting again.");
        }

        updateVoteCount();
    } catch (error) {
        console.error("🔥 Error processing vote:", error);
    }
}

// Event Listeners
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// Initialize Vote Count on Page Load
updateVoteCount();
