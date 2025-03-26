import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Get elements
document.addEventListener("DOMContentLoaded", async () => {
    const blessBtn = document.getElementById("bless");
    const curseBtn = document.getElementById("curse");
    const voteCount = document.getElementById("vote-count");

    const voteDocRef = doc(db, "votes", "main");
    const voteDocSnap = await getDoc(voteDocRef);

    let userVote = localStorage.getItem("userVote");

    if (voteDocSnap.exists()) {
        voteCount.innerText = voteDocSnap.data().count;
    } else {
        await updateDoc(voteDocRef, { count: 0 });
    }

    async function vote(type) {
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

    blessBtn.addEventListener("click", () => vote("bless"));
    curseBtn.addEventListener("click", () => vote("curse"));
});
