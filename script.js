import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

const memesCollection = collection(db, "memes");
const ADMIN_ID = "adminaccount@gmail.com";

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

function renderMemes() {
    memesContainer.innerHTML = "";
    onSnapshot(memesCollection, (snapshot) => {
        memesContainer.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const memeData = docSnap.data();
            const memeId = docSnap.id;

            const memeWrapper = document.createElement("div");
            memeWrapper.className = "meme-wrapper";

            const uploaderSpan = document.createElement("span");
            uploaderSpan.className = "uploader";
            uploaderSpan.textContent = `Uploaded by: ${memeData.uploadedBy}`;

            const memeContainer = document.createElement("div");
            memeContainer.className = "meme-container";

            const memeDiv = document.createElement("div");
            memeDiv.className = "meme-item";

            const img = document.createElement("img");
            img.src = memeData.url;
            img.alt = "User-uploaded meme";

            const voteCount = document.createElement("span");
            voteCount.textContent = `Votes: ${memeData.votes || 0}`;

            const buttonsDiv = document.createElement("div");
            buttonsDiv.className = "meme-buttons";

            const blessBtn = document.createElement("button");
            blessBtn.className = "bless-btn";
            blessBtn.dataset.memeId = memeId;

            const curseBtn = document.createElement("button");
            curseBtn.className = "curse-btn";
            curseBtn.dataset.memeId = memeId;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.style.display = (memeData.uploadedBy === currentUserEmail || currentUserEmail === ADMIN_ID) ? "inline-block" : "none";
            deleteBtn.onclick = () => deleteMeme(memeId);

            const voteRef = doc(db, "memes", memeId, "votes", currentUserEmail || "anonymous");
            getDoc(voteRef).then((voteSnap) => {
                const userVote = voteSnap.exists() ? voteSnap.data().vote : null;
                blessBtn.textContent = userVote === 1 ? "Unbless" : "Bless";
                curseBtn.textContent = userVote === -1 ? "Uncurse" : "Curse";
                blessBtn.disabled = userVote === -1;
                curseBtn.disabled = userVote === 1;
            }).catch((error) => {
                console.error("Error fetching vote state:", error);
            });

            blessBtn.onclick = () => handleVote(memeId, 1, blessBtn, curseBtn);
            curseBtn.onclick = () => handleVote(memeId, -1, curseBtn, blessBtn);

            memeDiv.appendChild(img);
            memeDiv.appendChild(voteCount);
            buttonsDiv.appendChild(blessBtn);
            buttonsDiv.appendChild(curseBtn);
            buttonsDiv.appendChild(deleteBtn);
            memeDiv.appendChild(buttonsDiv);

            // Comment Section
            const commentSection = document.createElement("div");
            commentSection.className = "comment-section";

            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.placeholder = "Add a comment...";
            commentInput.className = "comment-input";

            const commentBtn = document.createElement("button");
            commentBtn.textContent = "Post";
            commentBtn.className = "comment-btn";
            commentBtn.onclick = () => addComment(memeId, commentInput.value);

            const commentsDiv = document.createElement("div");
            commentsDiv.className = "comments-list";

            memeDiv.appendChild(img);
            memeDiv.appendChild(voteCount);
            buttonsDiv.appendChild(blessBtn);
            buttonsDiv.appendChild(curseBtn);
            buttonsDiv.appendChild(deleteBtn);
            memeDiv.appendChild(buttonsDiv);

            commentSection.appendChild(commentInput);
            commentSection.appendChild(commentBtn);
            commentSection.appendChild(commentsDiv);

            memeContainer.appendChild(memeDiv);
            memeContainer.appendChild(commentSection);

            memeWrapper.appendChild(uploaderSpan);
            memeWrapper.appendChild(memeContainer);
            memesContainer.appendChild(memeWrapper);

            // Render comments
            renderComments(memeId, commentsDiv);
        });
    }, (error) => {
        console.error("Error in memes snapshot:", error);
    });
}

async function handleVote(memeId, voteChange, clickedBtn, otherBtn) {
    try {
        const memeRef = doc(db, "memes", memeId);
        const voteRef = doc(db, "memes", memeId, "votes", currentUserEmail || "anonymous");
        const [voteSnap, memeSnap] = await Promise.all([getDoc(voteRef), getDoc(memeRef)]);

        if (!memeSnap.exists()) {
            console.error("Meme does not exist:", memeId);
            return;
        }

        let currentVotes = memeSnap.data().votes || 0;

        if (voteSnap.exists()) {
            const existingVote = voteSnap.data().vote;
            if (existingVote === voteChange) {
                await deleteDoc(voteRef);
                await updateDoc(memeRef, { votes: currentVotes - voteChange });
                clickedBtn.textContent = voteChange > 0 ? "Bless" : "Curse";
                clickedBtn.disabled = false;
                otherBtn.disabled = false;
                console.log(`Cancelled ${voteChange > 0 ? "bless" : "curse"} on meme ${memeId}`);
            }
        } else {
            await setDoc(voteRef, { vote: voteChange });
            await updateDoc(memeRef, { votes: currentVotes + voteChange });
            clickedBtn.textContent = voteChange > 0 ? "Unbless" : "Uncurse";
            clickedBtn.disabled = false;
            otherBtn.disabled = true;
            console.log(`Voted ${voteChange > 0 ? "bless" : "curse"} on meme ${memeId}`);
        }
    } catch (error) {
        console.error("Error handling vote:", error);
        alert("Failed to process vote: " + error.message);
    }
}

async function addComment(memeId, commentText) {
    if (!commentText.trim()) return;
    try {
        const commentsCollection = collection(db, "memes", memeId, "comments");
        await addDoc(commentsCollection, {
            text: commentText,
            userEmail: currentUserEmail,
            timestamp: new Date().toISOString()
        });
        console.log("Comment added to meme:", memeId);
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment!");
    }
}

function renderComments(memeId, commentsDiv) {
    const commentsCollection = collection(db, "memes", memeId, "comments");
    onSnapshot(commentsCollection, (snapshot) => {
        commentsDiv.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const commentData = docSnap.data();
            const commentP = document.createElement("p");
            commentP.textContent = `${commentData.userEmail}: ${commentData.text}`;
            commentsDiv.appendChild(commentP);
        });
    }, (error) => {
        console.error("Error in comments snapshot:", error);
    });
}

async function deleteMeme(memeId) {
    try {
        const memeRef = doc(db, "memes", memeId);
        await deleteDoc(memeRef);
        console.log(`Deleted meme ${memeId}`);
    } catch (error) {
        console.error("Error deleting meme:", error);
        alert("You don’t have permission to delete this meme.");
    }
}

if (updateMemeBtn && memeInput) {
    updateMemeBtn.addEventListener("click", async () => {
        const newMemeURL = memeInput.value.trim();
        if (newMemeURL) {
            try {
                await addDoc(memesCollection, {
                    url: newMemeURL,
                    uploadedBy: currentUserEmail,
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

if (adminBtn) {
    adminBtn.addEventListener("click", () => {
        window.location.href = "admin-login.html";
    });
}

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

renderMemes();
