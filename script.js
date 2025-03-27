import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

const memeInput = document.getElementById("meme-url");
const updateMemeBtn = document.getElementById("update-meme");
const memesContainer = document.getElementById("memes-container");
const adminBtn = document.getElementById("admin-btn");
const logoutBtn = document.getElementById("logout-btn");

const memesCollection = collection(db, "memes"); // New collection for all memes
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
        if (currentUserEmail === ADMIN_ID && adminBtn) {
            adminBtn.style.display = "none";
        } else if (adminBtn) {
            adminBtn.style.display = "block";
        }
    } else {
        currentUserEmail = null;
        console.log("No user logged in, redirecting to login.html");
        window.location.href = "login.html";
    }
});

// Function to render all memes
function renderMemes() {
    memesContainer.innerHTML = ""; // Clear existing content
    onSnapshot(memesCollection, (snapshot) => {
        snapshot.forEach((docSnap) => {
            const memeData = docSnap.data();
            const memeId = docSnap.id;

            const memeDiv = document.createElement("div");
            memeDiv.className = "meme-item";

            const img = document.createElement("img");
            img.src = memeData.url;
            img.alt = "User-uploaded meme";

            const voteCount = document.createElement("span");
            voteCount.textContent = `Votes: ${memeData.votes || 0}`;

            const blessBtn = document.createElement("button");
            blessBtn.textContent = "Bless";
            blessBtn.className = "bless-btn";
            blessBtn.onclick = () => voteMeme(memeId, 1);

            const curseBtn = document.createElement("button");
            curseBtn.textContent = "Curse";
            curseBtn.className = "curse-btn";
            curseBtn.onclick = () => voteMeme(memeId, -1);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.style.display = (memeData.uploadedBy === deviceId || currentUserEmail === ADMIN_ID) ? "inline-block" : "none";
            deleteBtn.onclick = () => deleteMeme(memeId);

            memeDiv.appendChild(img);
            memeDiv.appendChild(voteCount);
            memeDiv.appendChild(blessBtn);
            memeDiv.appendChild(curseBtn);
            memeDiv.appendChild(deleteBtn);
            memesContainer.appendChild(memeDiv);
        });
    });
}

// Vote on a specific meme
async function voteMeme(memeId, voteChange) {
    try {
        const memeRef = doc(db, "memes", memeId);
        const docSnap = await getDoc(memeRef);
        if (docSnap.exists()) {
            const currentVotes = docSnap.data().votes || 0;
            await updateDoc(memeRef, { votes: currentVotes + voteChange });
            console.log(`Voted ${voteChange > 0 ? "bless" : "curse"} on meme ${memeId}`);
        }
    } catch (error) {
        console.error("Error voting on meme:", error);
    }
}

// Delete a specific meme
async function deleteMeme(memeId) {
    try {
        const memeRef = doc(db, "memes", memeId);
        await deleteDoc(memeRef);
        console.log(`Deleted meme ${memeId}`);
    } catch (error) {
        console.error("Error deleting meme:", error);
    }
}

// Add a new meme
if (updateMemeBtn && memeInput) {
    updateMemeBtn.addEventListener("click", async () => {
        const newMemeURL = memeInput.value.trim();
        if (newMemeURL) {
            try {
                await addDoc(memesCollection, {
                    url: newMemeURL,
                    uploadedBy: deviceId,
                    votes: 0
                });
                memeInput.value = "";
                console.log("Meme added successfully");
            } catch (error) {
                console.error("Error adding meme:", error);
                alert("Failed to add meme!");
            }
        } else {
            alert("Please enter a valid image URL!");
        }
    });
}

// Admin button redirect
if (adminBtn) {
    adminBtn.addEventListener("click", () => {
        window.location.href = "admin-login.html";
    });
}

// Logout button
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await auth.signOut();
            console.log("Logged out, redirecting to login.html");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
}

// Initial render of memes
renderMemes();
