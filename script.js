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
        voteCountDisplay.textContent = docSnap.data().count;
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
        let userVote = data.voters ? data.voters[userId] : null;

        // 🛑 If user clicks the same vote again, cancel it
        if (userVote === type) {
            let newCount = data.count - (type === "bless" ? 1 : -1);
            let updatedVoters = { ...data.voters };
            delete updatedVoters[userId]; // Remove user vote

            await updateDoc(voteDoc, { count: newCount, voters: updatedVoters });
            localStorage.removeItem("hasVoted");
            alert("Your vote has been canceled.");
            return;
        }

        // ✅ If user has already voted, prevent voting again until canceled
        if (userVote !== null) {
            alert("You must cancel your previous vote before voting again.");
            return;
        }

        // ✅ Register new vote
        let newCount = data.count + (type === "bless" ? 1 : -1);
        let updatedVoters = { ...data.voters, [userId]: type };

        await updateDoc(voteDoc, { count: newCount, voters: updatedVoters });
        localStorage.setItem("hasVoted", type);
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
blessBtn.addEventListener("click", () => vote("bless"));
curseBtn.addEventListener("click", () => vote("curse"));

// ✅ Load initial votes
loadVotes();
