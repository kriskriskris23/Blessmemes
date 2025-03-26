import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Config
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
window.db = getFirestore(app);

console.log("Firestore Initialized:", window.db);

// Get references to DOM elements
const blessButton = document.getElementById("bless");
const curseButton = document.getElementById("curse");
const voteCountElement = document.getElementById("vote-count");

let userVote = localStorage.getItem("userVote") || null;

// Function to update vote display
async function updateVoteDisplay() {
    const docRef = doc(window.db, "votes", "meme1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        voteCountElement.textContent = docSnap.data().count;
    } else {
        await setDoc(docRef, { count: 0 });
        voteCountElement.textContent = 0;
    }
}

// Function to handle voting
async function handleVote(voteType) {
    const docRef = doc(window.db, "votes", "meme1");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(docRef, { count: 0 });
    }

    let currentVotes = docSnap.data().count;

    if (userVote === voteType) {
        // If clicking the same button again, cancel the vote
        currentVotes += voteType === "bless" ? -1 : 1;
        userVote = null;
        localStorage.removeItem("userVote");
    } else if (userVote === null) {
        // If first-time voting
        currentVotes += voteType === "bless" ? 1 : -1;
        userVote = voteType;
        localStorage.setItem("userVote", voteType);
    } else {
        // If user has already voted, show an alert
        alert("You must cancel your previous vote before voting again.");
        return;
    }

    await updateDoc(docRef, { count: currentVotes });
    voteCountElement.textContent = currentVotes;
}

// Event listeners
blessButton.addEventListener("click", () => handleVote("bless"));
curseButton.addEventListener("click", () => handleVote("curse"));

// Initialize vote count display
updateVoteDisplay();
