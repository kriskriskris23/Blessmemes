import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const blessButton = document.getElementById("bless");
    const curseButton = document.getElementById("curse");
    const voteCountDisplay = document.getElementById("vote-count");

    const db = window.db; // Firebase Firestore
    const voteDocRef = doc(db, "votes", "main");

    let userVote = localStorage.getItem("userVote"); // Check if user already voted

    // Load the current vote count
    async function loadVoteCount() {
        const voteDoc = await getDoc(voteDocRef);
        if (voteDoc.exists()) {
            voteCountDisplay.textContent = voteDoc.data().count || 0;
        } else {
            await setDoc(voteDocRef, { count: 0 }); // Create vote doc if not exist
            voteCountDisplay.textContent = 0;
        }
    }

    await loadVoteCount(); // Fetch votes when page loads

    // Function to update the vote count in Firebase
    async function updateVoteCount(change) {
        const voteDoc = await getDoc(voteDocRef);
        if (voteDoc.exists()) {
            await updateDoc(voteDocRef, { count: voteDoc.data().count + change });
            voteCountDisplay.textContent = voteDoc.data().count + change;
        }
    }

    // Handle Bless button click
    blessButton.addEventListener("click", async () => {
        if (userVote) {
            alert("You have already voted.");
            return;
        }
        await updateVoteCount(1);
        localStorage.setItem("userVote", "bless");
        alert("Thank you for voting!");
    });

    // Handle Curse button click
    curseButton.addEventListener("click", async () => {
        if (userVote) {
            alert("You have already voted.");
            return;
        }
        await updateVoteCount(-1);
        localStorage.setItem("userVote", "curse");
        alert("Thank you for voting!");
    });
});
