import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration
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

// Debug: Check if Firebase is connected
console.log("Firebase initialized:", app);

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded"); // Debugging

    const blessBtn = document.getElementById("bless");
    const curseBtn = document.getElementById("curse");
    const voteCount = document.getElementById("vote-count");

    if (!blessBtn || !curseBtn || !voteCount) {
        console.error("Error: Buttons or vote count not found in the DOM.");
        return;
    }

    const voteDocRef = doc(db, "votes", "main");
    let voteDocSnap = await getDoc(voteDocRef);

    if (!voteDocSnap.exists()) {
        await setDoc(voteDocRef, { count: 0 });
        voteDocSnap = await getDoc(voteDocRef);
    }

    voteCount.innerText = voteDocSnap.data().count;

    let userVote = localStorage.getItem("userVote");

    async function vote(type) {
        console.log(`Vote button clicked: ${type}`); // Debugging

        if (userVote) {
            if (userVote === type) {
                alert("You have canceled your vote.");
                userVote = null;
                localStorage.removeItem("userVote");
                await updateDoc(voteDocRef, { count: voteDocSnap.data().count - 1 });
            } else {
                alert("You must cancel your previous vote before voting again.");
            }
        } else {
            userVote = type;
            localStorage.setItem("userVote", type);
            await updateDoc(voteDocRef, { count: voteDocSnap.data().count + 1 });
            alert("Thank you for voting!");
        }

        const updatedVoteDoc = await getDoc(voteDocRef);
        voteCount.innerText = updatedVoteDoc.data().count;
    }

    // Attach event listeners
    blessBtn.addEventListener("click", () => {
        console.log("Bless button clicked"); // Debugging
        vote("bless");
    });

    curseBtn.addEventListener("click", () => {
        console.log("Curse button clicked"); // Debugging
        vote("curse");
    });
});
