// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Voting Logic
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountEl = document.getElementById("vote-count");

async function fetchVotes() {
    const docRef = doc(db, "votes", "meme1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        voteCountEl.textContent = docSnap.data().count;
    }
}

async function vote(type) {
    const userVoted = localStorage.getItem("hasVoted");

    if (userVoted) {
        alert("You have already voted.");
        return;
    }

    const docRef = doc(db, "votes", "meme1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        await updateDoc(docRef, { count: docSnap.data().count + (type === "bless" ? 1 : -1) });
    } else {
        await setDoc(docRef, { count: type === "bless" ? 1 : -1 });
    }

    localStorage.setItem("hasVoted", "true");
    fetchVotes();
    alert("Thank you for voting!");
}

// Event Listeners
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// Initial Fetch
fetchVotes();
