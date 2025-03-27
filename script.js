import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDI_fGu98sgzr8ie4DphTFFkApEbwwdSyk",
    authDomain: "blessmemes.firebaseapp.com",
    projectId: "blessmemes",
    storageBucket: "blessmemes.firebasestorage.app",
    messagingSenderId: "647948484551",
    appId: "1:647948484551:web:db884bd3346d838737e3e2",
    measurementId: "G-0GY321M1ML"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");
const memeInput = document.getElementById("meme-url");
const updateMemeBtn = document.getElementById("update-meme");
const deleteMemeBtn = document.getElementById("delete-meme");
const memeImg = document.getElementById("meme-img");
const adminBtn = document.getElementById("admin-btn");
const logoutBtn = document.getElementById("logout-btn");

const voteDocRef = doc(db, "votes", "meme1");
const memeDocRef = doc(db, "memes", "currentMeme");
const ADMIN_ID = "adminaccount@gmail.com"; // Your admin email

let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
}

let currentUserEmail = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserEmail = user.email;
        console.log("User logged in:", currentUserEmail);
    } else {
        currentUserEmail = null;
        console.log("No user logged in, redirecting to login.html");
        window.location.href = "login.html";
    }
});

async function updateVoteCount() {
    try {
        const docSnap = await getDoc(voteDocRef);
        let voteCount = docSnap.exists() ? docSnap.data().count : 0;
        if (!docSnap.exists()) {
            await setDoc(voteDocRef, { count: 0 });
        }
        voteCountSpan.textContent = voteCount;
    } catch (error) {
        console.error("🔥 Error fetching votes:", error);
    }
}

async function vote(type) {
    try {
        const docSnap = await getDoc(voteDocRef);
        if (!docSnap.exists()) return;
        let currentVotes = docSnap.data().count || 0;
        await updateDoc(voteDocRef, { count: currentVotes + (type === "bless" ? 1 : -1) });
        alert("Thank you for voting!");
        updateVoteCount();
    } catch (error) {
        console.error("🔥 Error processing vote:", error);
    }
}

if (blessBtn && curseBtn) {
    blessBtn.addEventListener("click", () => vote("bless"));
    curseBtn.addEventListener("click", () => vote("curse"));
    updateVoteCount();
}

if (updateMemeBtn && memeInput) {
    updateMemeBtn.addEventListener("click", async () => {
        const newMemeURL = memeInput.value.trim();
        if (newMemeURL) {
            try {
                await setDoc(memeDocRef, { url: newMemeURL, uploadedBy: deviceId });
                memeInput.value = "";
            } catch (error) {
                console.error("🔥 Error updating meme URL:", error);
            }
        } else {
            alert("Please enter a valid image URL!");
        }
    });
}

if (deleteMemeBtn) {
    deleteMemeBtn.addEventListener("click", async () => {
        try {
            await deleteDoc(memeDocRef);
            memeImg.src = "default-meme.jpg";
            deleteMemeBtn.style.display = "none";
            alert("Meme deleted!");
        } catch (error) {
            console.error("🔥 Error deleting meme:", error);
        }
    });
}

if (memeImg && deleteMemeBtn) {
    onSnapshot(memeDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const memeData = docSnap.data();
            memeImg.src = memeData.url;
            if (memeData.uploadedBy === deviceId || currentUserEmail === ADMIN_ID) {
                deleteMemeBtn.style.display = "block";
            } else {
                deleteMemeBtn.style.display = "none";
            }
        } else {
            memeImg.src = "default-meme.jpg";
            deleteMemeBtn.style.display = "none";
        }
    });
}

if (adminBtn) {
    adminBtn.addEventListener("click", () => {
        window.location.href = "admin-login.html";
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await auth.signOut();
            window.location.href = "login.html";
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
}
