// Import Firestore functions
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

console.log("🔥 Script is running...");

// Get Firestore database instance
const db = getFirestore();
console.log("✅ Firestore initialized:", db);

// Get HTML elements
const blessButton = document.getElementById("bless");
const curseButton = document.getElementById("curse");
const voteCountElement = document.getElementById("vote-count");

if (!blessButton || !curseButton || !voteCountElement) {
    console.error("❌ ERROR: Buttons or vote count element not found in HTML.");
}

// Store user vote in local storage (so they can’t vote multiple times)
const userVoteKey = "userVote"; // LocalStorage key

// Function to fetch current votes
async function getVotes() {
    console.log("📡 Fetching votes...");
    const docRef = doc(db, "votes", "meme1"); // Replace "meme1" with your meme ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("✅ Current vote count:", docSnap.data().count);
        return docSnap.data().count;
    } else {
        console.warn("⚠️ No vote count found, initializing to 0.");
        await setDoc(docRef, { count: 0 });
        return 0;
    }
}

// Function to update votes
async function updateVotes(change) {
    console.log(`🔄 Updating votes by ${change}...`);
    const docRef = doc(db, "votes", "meme1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let newCount = docSnap.data().count + change;
        console.log("📊 New vote count:", newCount);
        await updateDoc(docRef, { count: newCount });
        voteCountElement.textContent = newCount; // Update UI
    } else {
        console.error("❌ ERROR: Vote document not found.");
    }
}

// Function to handle voting
async function handleVote(voteType) {
    console.log(`🗳️ ${voteType.toUpperCase()} button clicked.`);
    const previousVote = localStorage.getItem(userVoteKey);

    if (previousVote === voteType) {
        alert("You have already voted.");
        return;
    }

    if (previousVote) {
        alert("You must cancel your previous vote before voting again.");
        return;
    }

    // Update Firestore and local storage
    await updateVotes(voteType === "bless" ? 1 : -1);
    localStorage.setItem(userVoteKey, voteType);
    alert("Thank you for voting!");
}

// Fetch and display votes on page load
getVotes().then(count => {
    voteCountElement.textContent = count;
});

// Event Listeners
blessButton?.addEventListener("click", () => handleVote("bless"));
curseButton?.addEventListener("click", () => handleVote("curse"));
