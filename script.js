// ✅ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// ✅ Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDI_fGu98sgzr8ie4DphTFFkApEbwwdSyk",
    authDomain: "blessmemes.firebaseapp.com",
    projectId: "blessmemes",
    storageBucket: "blessmemes.firebasestorage.app",
    messagingSenderId: "647948484551",
    appId: "1:647948484551:web:db884bd3346d838737e3e2",
    measurementId: "G-0GY321M1ML"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const voteDoc = doc(db, "votes", "main"); // Firestore document reference

// HTML elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountDisplay = document.getElementById("vote-count");

// Track if user has voted
let hasVoted = localStorage.getItem("hasVoted") === "true";

// ✅ Fetch the current vote count from Firebase
async function loadVotes() {
    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        voteCountDisplay.textContent = docSnap.data().count;
    } else {
        await setDoc(voteDoc, { count: 0 }); // Initialize vote count if not present
    }
}

// ✅ Function to handle voting
async function vote(change) {
    if (hasVoted) {
        alert("You have already voted.");
        return;
    }

    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        let newCount = docSnap.data().count + change;
        await updateDoc(voteDoc, { count: newCount }); // 🔥 Update vote count in Firebase
        localStorage.setItem("hasVoted", "true"); // Mark user as voted
        alert("Thank you for voting!");
    } else {
        await setDoc(voteDoc, { count: change }); // If document doesn't exist, create it
    }
}

// ✅ Real-time vote updates
onSnapshot(voteDoc, (docSnap) => {
    if (docSnap.exists()) {
        voteCountDisplay.textContent = docSnap.data().count;
    }
});

// ✅ Event listeners
blessBtn.addEventListener("click", () => vote(1));
curseBtn.addEventListener("click", () => vote(-1));

// ✅ Load initial votes
loadVotes();
