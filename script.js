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

// ✅ Get a unique identifier for each user
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9); // Random unique ID
        localStorage.setItem("userId", userId);
    }
    return userId;
}
const userId = getUserId(); // Get unique user ID

// ✅ Load votes from Firestore
async function loadVotes() {
    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        voteCountDisplay.textContent = docSnap.data().count;
    } else {
        await setDoc(voteDoc, { count: 0, voters: {} }); // Initialize with voters list
        voteCountDisplay.textContent = 0;
    }
}

// ✅ Function to handle voting
async function vote(change) {
    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        let data = docSnap.data();
        if (data.voters && data.voters[userId]) {
            alert("You have already voted.");
            return;
        }

        let newCount = data.count + change;
        let updatedVoters = { ...data.voters, [userId]: change };

        await updateDoc(voteDoc, { count: newCount, voters: updatedVoters }); // 🔥 Save vote & prevent spam
        localStorage.setItem("hasVoted", "true"); // Store in local storage
        alert("Thank you for voting!");
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
