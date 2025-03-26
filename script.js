// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const deleteMemeBtn = document.getElementById("delete-meme");
const memeImg = document.getElementById("meme-img");

// Firestore Document References
const voteDocRef = doc(db, "votes", "meme1");
const memeDocRef = doc(db, "memes", "currentMeme");

// Admin Identifier (Replace with your actual admin ID or email)
const ADMIN_ID = "your_admin_id_or_email"; // Change this

// Unique device identifier stored in localStorage
let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
    deviceId = crypto.randomUUID(); // Generate unique ID for device
    localStorage.setItem("deviceId", deviceId);
}

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

// Handle Vote Logic with Spam Prevention
async function vote(type) {
    try {
        const docSnap = await getDoc(voteDocRef);
        if (!docSnap.exists()) return;

        let currentVotes = docSnap.data().count || 0;

        // Get the last vote from localStorage
        let lastVote = localStorage.getItem("lastVote");

        if (lastVote === type) {
            // Cancel the previous vote
            await updateDoc(voteDocRef, { count: currentVotes + (type === "bless" ? -1 : 1) });
            localStorage.removeItem("lastVote");
            alert("Vote canceled!");
        } else if (lastVote === null) {
            // Cast a new vote
            await updateDoc(voteDocRef, { count: currentVotes + (type === "bless" ? 1 : -1) });
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
            await setDoc(memeDocRef, { url: newMemeURL, uploadedBy: deviceId });
            memeInput.value = ""; // Clear input after updating
        } catch (error) {
            console.error("🔥 Error updating meme URL:", error);
        }
    } else {
        alert("Please enter a valid image URL!");
    }
});

// Function to delete meme (Only for uploader or admin)
deleteMemeBtn.addEventListener("click", async () => {
    try {
        await deleteDoc(memeDocRef);
        memeImg.src = "default-meme.jpg"; // Reset to default image
        deleteMemeBtn.style.display = "none"; // Hide button after deletion
        alert("Meme deleted!");
    } catch (error) {
        console.error("🔥 Error deleting meme:", error);
    }
});

// Real-time Sync: Update meme for all users instantly
onSnapshot(memeDocRef, (docSnap) => {
    if (docSnap.exists()) {
        const memeData = docSnap.data();
        memeImg.src = memeData.url;

        // Show delete button only for the uploader or admin
        if (memeData.uploadedBy === deviceId || deviceId === ADMIN_ID) {
            deleteMemeBtn.style.display = "block";
        } else {
            deleteMemeBtn.style.display = "none";
        }
    } else {
        memeImg.src = "default-meme.jpg"; // No meme found, show default
        deleteMemeBtn.style.display = "none";
    }
});

// Load meme from Firestore when page loads
async function loadMeme() {
    try {
        const docSnap = await getDoc(memeDocRef);
        if (docSnap.exists()) {
            const memeData = docSnap.data();
            memeImg.src = memeData.url;

            // Show delete button only for the uploader or admin
            if (memeData.uploadedBy === deviceId || deviceId === ADMIN_ID) {
                deleteMemeBtn.style.display = "block";
            }
        }
    } catch (error) {
        console.error("🔥 Error loading meme:", error);
    }
}

// Load meme on page load
window.addEventListener("load", loadMeme);
