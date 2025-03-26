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
window.db = db; // ✅ Firestore globally accessible

console.log("🔥 Firestore Initialized:", window.db);

// Get elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");

const docRef = doc(db, "votes", "meme1");

// Store user's last vote in local storage
let lastVote = localStorage.getItem("lastVote") || null;
console.log("🔹 Last vote from storage:", lastVote);

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
    console.log("🟡 Vote button clicked:", type);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let currentVotes = docSnap.data().count || 0;
            console.log("🔹 Current vote count:", currentVotes);
            console.log("🔹 Last vote before clicking:", lastVote);

            if (lastVote === type) {
                // Cancel previous vote
                console.log("❌ Canceling vote...");
                const voteChange = type === "bless" ? -1 : +1; // Reverse effect
                await updateDoc(docRef, { count: currentVotes + voteChange });
                lastVote = null;
                localStorage.removeItem("lastVote");
                alert("Vote canceled!");
            } else {
                // Remove old vote first if the user already voted
                if (lastVote) {
                    console.log("🔄 Removing old vote:", lastVote);
                    const previousVoteChange = lastVote === "bless" ? -1 : +1;
                    currentVotes += previousVoteChange; // Undo previous vote
                }
                // Add new vote
                console.log("✅ Adding new vote:", type);
                const voteChange = type === "bless" ? +1 : -1;
                await updateDoc(docRef, { count: currentVotes + voteChange });
                lastVote = type;
                localStorage.setItem("lastVote", type);
                alert("Thank you for voting!");
            }

            console.log("🔹 Last vote after clicking:", lastVote);
            updateVoteCount();
        }
    } catch (error) {
        console.error("🔥 Error voting:", error);
    }
}

// 🔥 **Ensuring buttons stay clickable**
function enableButtons() {
    blessBtn.disabled = false;
    curseBtn.disabled = false;
}

blessBtn.addEventListener("click", () => {
    enableButtons();
    vote("bless");
});

curseBtn.addEventListener("click", () => {
    enableButtons();
    vote("curse");
});

// Initialize vote count on page load
updateVoteCount();
enableButtons(); // 🔥 Make sure buttons are always enabled
