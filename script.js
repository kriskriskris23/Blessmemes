// ✅ Fix 2: Ensure buttons are recognized
document.getElementById("bless").addEventListener("click", () => {
    console.log("Bless button clicked!");
});
document.getElementById("curse").addEventListener("click", () => {
    console.log("Curse button clicked!");
});

// ✅ Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your Firebase config
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

// ✅ Function to get and update votes
async function updateVote(type) {
    const voteDoc = doc(db, "votes", "main"); // Reference to Firestore document
    const docSnap = await getDoc(voteDoc);

    if (docSnap.exists()) {
        let votes = docSnap.data();
        let newVoteCount = votes[type] || 0;

        // Check localStorage for previous vote
        const previousVote = localStorage.getItem("userVote");
        if (previousVote === type) {
            alert("You already voted this!");
            return;
        } else if (previousVote) {
            alert("You must cancel your previous vote before voting again.");
            return;
        }

        // Update vote count
        newVoteCount++;
        await updateDoc(voteDoc, { [type]: newVoteCount });

        // Store user vote locally
        localStorage.setItem("userVote", type);

        // Update UI
        document.getElementById("vote-count").textContent = `Bless: ${votes.bless || 0} | Curse: ${votes.curse || 0}`;
        alert("Thank you for voting!");
    } else {
        console.log("No vote document found, creating one...");
        await setDoc(voteDoc, { bless: 0, curse: 0 });
    }
}

// ✅ Attach event listeners to buttons
document.getElementById("bless").addEventListener("click", () => updateVote("bless"));
document.getElementById("curse").addEventListener("click", () => updateVote("curse"));

// ✅ Load vote count on page load
async function loadVotes() {
    const voteDoc = doc(db, "votes", "main");
    const docSnap = await getDoc(voteDoc);

    if (docSnap.exists()) {
        let votes = docSnap.data();
        document.getElementById("vote-count").textContent = `Bless: ${votes.bless || 0} | Curse: ${votes.curse || 0}`;
    }
}

loadVotes();
