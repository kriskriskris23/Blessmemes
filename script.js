// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// DOM Elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");
const memeInput = document.getElementById("meme-url");
const updateMemeBtn = document.getElementById("update-meme");
const memeImg = document.getElementById("meme-img");

// Firestore Document References
const voteDocRef = doc(db, "votes", "meme1");
const memeDocRef = doc(db, "memes", "currentMeme");

// Fetch & Update Vote Count
async function updateVoteCount() {
    try {
        const docSnap = await getDoc(voteDocRef);
        let voteCount = docSnap.exists() ? docSnap.data().count : 0;
        
        if (!docSnap.exists()) {
            await setDoc(voteDocRef, { count: 0 });
        }

        voteCountSpan.textContent = voteCount;
    } catch (error) {
        console.error("🔥 Error fetching votes:", error);
    }
}

// Handle Vote Logic
async function vote(type) {
    try {
        const docSnap = await getDoc(voteDocRef);
        if (!docSnap.exists()) return;

        let currentVotes = docSnap.data().count || 0;

        await updateDoc(voteDocRef, { count: currentVotes + (type === "bless" ? 1 : -1) });

        alert("Thank you for voting!");
        updateVoteCount();
    } catch (error) {
        console.error("🔥 Error processing vote:", error);
    }
}

// Event Listeners for Voting
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// Initialize Vote Count on Page Load
updateVoteCount();

// Function to update meme image in Firestore
updateMemeBtn.addEventListener("click", async () => {
    const newMemeURL = memeInput.value.trim();

    if (newMemeURL) {
        try {
            await setDoc(memeDocRef, { url: newMemeURL });
            memeInput.value = ""; // Clear input after updating
        } catch (error) {
            console.error("🔥 Error updating meme URL:", error);
        }
    } else {
        alert("Please enter a valid image URL!");
    }
});

// Real-time Sync: Update meme for all users instantly
onSnapshot(memeDocRef, (docSnap) => {
    if (docSnap.exists()) {
        memeImg.src = docSnap.data().url;
    }
});

// Load meme from Firestore when page loads
async function loadMeme() {
    try {
        const docSnap = await getDoc(memeDocRef);
        if (docSnap.exists()) {
            memeImg.src = docSnap.data().url;
        }
    } catch (error) {
        console.error("🔥 Error loading meme:", error);
    }
}

// Load meme on page load
window.addEventListener("load", loadMeme);
