// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your Firebase project config
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

console.log("🔥 Firebase initialized:", db);

// Select elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountElem = document.getElementById("vote-count");

// Debug: Check if buttons exist
if (!blessBtn || !curseBtn || !voteCountElem) {
    console.error("❌ ERROR: Buttons or vote count element not found!");
} else {
    console.log("✅ Buttons and vote count found!");
}

// Function to get current vote count
async function getVoteCount() {
    const voteDoc = doc(db, "votes", "voteCount");
    const snapshot = await getDoc(voteDoc);

    if (snapshot.exists()) {
        return snapshot.data().count || 0;
    } else {
        console.log("ℹ️ No vote count found, setting to 0.");
        await setDoc(voteDoc, { count: 0 });
        return 0;
    }
}

// Function to update vote count
async function updateVoteCount(change) {
    const voteDoc = doc(db, "votes", "voteCount");
    const snapshot = await getDoc(voteDoc);

    if (snapshot.exists()) {
        const currentCount = snapshot.data().count || 0;
        const newCount = currentCount + change;

        await updateDoc(voteDoc, { count: newCount });
        console.log(`✅ Vote count updated: ${newCount}`);
        voteCountElem.textContent = newCount;
    }
}

// Load vote count on page load
async function loadVoteCount() {
    const count = await getVoteCount();
    voteCountElem.textContent = count;
    console.log("✅ Loaded vote count:", count);
}

loadVoteCount(); // Call this when the page loads

// Add event listeners
blessBtn.addEventListener("click", async () => {
    console.log("👍 Bless button clicked!");
    await updateVoteCount(1);
});

curseBtn.addEventListener("click", async () => {
    console.log("👎 Curse button clicked!");
    await updateVoteCount(-1);
});
