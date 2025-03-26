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
const voteDoc = doc(db, "votes", "main");

// HTML elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountDisplay = document.getElementById("vote-count");

// ✅ Get a unique identifier for each user
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);
    }
    return userId;
}
const userId = getUserId(); // Get unique user ID

// ✅ Load votes from Firestore
async function loadVotes() {
    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        voteCountDisplay.textContent = docSnap.data().count || 0;
    } else {
        await setDoc(voteDoc, { count: 0, voters: {} });
        voteCountDisplay.textContent = 0;
    }
}

// ✅ Function to handle voting
async function vote(type) {
    const docSnap = await getDoc(voteDoc);
    if (docSnap.exists()) {
        let data = docSnap.data();
        let userVote = data.voters?.[userId] || null;
        let newCount = data.count || 0;
        let updatedVoters = { ...data.voters };

        // 🛑 If user clicks the same vote again, cancel it
        if (userVote === type) {
            newCount += type === "bless" ? -1 : 1; // Remove vote
            delete updatedVoters[userId];

            await updateDoc(voteDoc, { count: newCount, voters: updatedVoters });
            localStorage.removeItem("hasVoted");
            alert("Your vote has been canceled.");
            return;
        }

        // ✅ If user has already voted for the other option, prevent voting without canceling first
        if (userVote !== null) {
            alert("You must cancel your previous vote before voting again.");
            return;
        }

        // ✅ Register new vote
        newCount += type === "bless" ? 1 : -1;
        updatedVoters[userId] = type;

        await updateDoc(voteDoc, { count: newCount, voters: updatedVoters });
        localStorage.setItem("hasVoted", type);
        alert("Thank you for voting!");
    }
}

// ✅ Real-time vote updates
onSnapshot(voteDoc, (docSnap) => {
    if (docSnap.exists()) {
        voteCountDisplay.textContent = docSnap.data().count || 0;
    }
});

// ✅ Event listeners
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// ✅ Load initial votes
loadVotes();
