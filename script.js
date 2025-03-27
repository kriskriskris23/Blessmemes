import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const sortOptions = document.getElementById("sort-options");

const memesCollection = collection(db, "memes");
const usersCollection = collection(db, "users");
const ADMIN_ID = "adminaccount@gmail.com";

let currentUserEmail = null;
let currentUsername = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserEmail = user.email;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().nickname) {
            currentUsername = userSnap.data().nickname;
        } else {
            window.location.href = "set-nickname.html";
            return;
        }
        console.log("User logged in:", currentUserEmail, "Nickname:", currentUsername);
        if (currentUserEmail === ADMIN_ID && adminBtn) {
            adminBtn.style.display = "none";
        } else if (adminBtn) {
            adminBtn.style.display = "block";
        }
    } else {
        currentUserEmail = null;
        currentUsername = null;
        console.log("No user logged in, redirecting to login.html");
        window.location.href = "login.html";
    }
});

// Helper function to get nickname from email
async function getNicknameFromEmail(email) {
    const userQuery = await getDocs(usersCollection);
    for (const docSnap of userQuery.docs) {
        if (docSnap.data().email === email) {
            return docSnap.data().nickname;
        }
    }
    return email; // Fallback to email if nickname not found
}

// Helper function to get comment count for a meme
async function getCommentCount(memeId) {
    const commentsCollection = collection(db, "memes", memeId, "comments");
    const commentSnapshot = await getDocs(commentsCollection);
    return commentSnapshot.size;
}

function renderMemes(sortBy = "latest-uploaded") {
    memesContainer.innerHTML = "";
    onSnapshot(memesCollection, async (snapshot) => {
        memesContainer.innerHTML = "";
        let memes = [];
        for (const docSnap of snapshot.docs) {
            const memeData = docSnap.data();
            const memeId = docSnap.id;
            const commentCount = await getCommentCount(memeId);
            memes.push({ id: memeId, ...memeData, commentCount });
        }

        switch (sortBy) {
            case "most-votes":
                memes.sort((a, b) => (b.votes || 0) - (a.votes || 0));
                break;
            case "least-votes":
                memes.sort((a, b) => (a.votes || 0) - (b.votes || 0));
                break;
            case "latest-uploaded":
                memes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                break;
            case "oldest-uploaded":
                memes.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                break;
            case "most-comments":
                memes.sort((a, b) => b.commentCount - a.commentCount);
                break;
            default:
                memes.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        for (const meme of memes) {
            const memeWrapper = document.createElement("div");
            memeWrapper.className = "meme-wrapper";

            const uploaderSpan = document.createElement("span");
            uploaderSpan.className = "uploader";
            const uploaderNickname = await getNicknameFromEmail(meme.uploadedBy);
            const uploadDate = meme.timestamp ? new Date(meme.timestamp).toLocaleString() : "Unknown date";
            uploaderSpan.textContent = `Uploaded by: ${uploaderNickname} on ${uploadDate}`;

            const memeContainer = document.createElement("div");
            memeContainer.className = "meme-container";

            const memeDiv = document.createElement("div");
            memeDiv.className = "meme-item";

            const img = document.createElement("img");
            img.src = meme.url;
            img.alt = "User-uploaded meme";

            const voteCount = document.createElement("span");
            voteCount.textContent = `Votes: ${meme.votes || 0}`;

            const buttonsDiv = document.createElement("div");
            buttonsDiv.className = "meme-buttons";

            const blessBtn = document.createElement("button");
            blessBtn.className = "bless-btn";
            blessBtn.dataset.memeId = meme.id;

            const curseBtn = document.createElement("button");
            curseBtn.className = "curse-btn";
            curseBtn.dataset.memeId = meme.id;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.style.display = (meme.uploadedBy === currentUserEmail || currentUserEmail === ADMIN_ID) ? "inline-block" : "none";
            deleteBtn.onclick = () => deleteMeme(meme.id);

            const voteRef = doc(db, "memes", meme.id, "votes", currentUsername);
            getDoc(voteRef).then((voteSnap) => {
                const userVote = voteSnap.exists() ? voteSnap.data().vote : null;
                blessBtn.textContent = userVote === 1 ? "Unbless" : "Bless";
                curseBtn.textContent = userVote === -1 ? "Uncurse" : "Curse";
                blessBtn.disabled = userVote === -1;
                curseBtn.disabled = userVote === 1;
            }).catch((error) => {
                console.error("Error fetching vote state:", error);
            });

            blessBtn.onclick = () => handleVote(meme.id, 1, blessBtn, curseBtn);
            curseBtn.onclick = () => handleVote(meme.id, -1, curseBtn, blessBtn);

            memeDiv.appendChild(img);
            memeDiv.appendChild(voteCount);
            buttonsDiv.appendChild(blessBtn);
            buttonsDiv.appendChild(curseBtn);
            buttonsDiv.appendChild(deleteBtn);
            memeDiv.appendChild(buttonsDiv);

            const commentSection = document.createElement("div");
            commentSection.className = "comment-section";

            const commentsDiv = document.createElement("div");
            commentsDiv.className = "comments-list";

            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.placeholder = "Add a comment...";
            commentInput.className = "comment-input";
            commentInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    addComment(meme.id, commentInput.value, commentInput);
                }
            });

            const commentBtn = document.createElement("button");
            commentBtn.textContent = "Post";
            commentBtn.className = "comment-btn";
            commentBtn.onclick = () => addComment(meme.id, commentInput.value, commentInput);

            commentSection.appendChild(commentsDiv);
            commentSection.appendChild(commentInput);
            commentSection.appendChild(commentBtn);

            memeContainer.appendChild(memeDiv);
            memeContainer.appendChild(commentSection);

            memeWrapper.appendChild(uploaderSpan);
            memeWrapper.appendChild(memeContainer);
            memesContainer.appendChild(memeWrapper);

            renderComments(meme.id, commentsDiv);

            const memeHeight = memeDiv.offsetHeight;
            commentSection.style.height = `${memeHeight}px`;
        }
    }, (error) => {
        console.error("Error in memes snapshot:", error);
    });
}

async function handleVote(memeId, voteChange, clickedBtn, otherBtn) {
    if (!currentUsername) {
        alert("Nickname not set. Please set a nickname to vote.");
        return;
    }
    try {
        const memeRef = doc(db, "memes", memeId);
        const voteRef = doc(db, "memes", memeId, "votes", currentUsername);
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

async function addComment(memeId, commentText, commentInput) {
    if (!commentText.trim()) return;
    try {
        const commentsCollection = collection(db, "memes", memeId, "comments");
        await addDoc(commentsCollection, {
            text: commentText,
            nickname: currentUsername,
            timestamp: Date.now()
        });
        console.log("Comment added to meme:", memeId);
        commentInput.value = "";
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment!");
    }
}

async function deleteComment(memeId, commentId) {
    try {
        const commentRef = doc(db, "memes", memeId, "comments", commentId);
        await deleteDoc(commentRef);
        console.log(`Deleted comment ${commentId} from meme ${memeId}`);
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment: " + error.message);
    }
}

function renderComments(memeId, commentsDiv) {
    const commentsCollection = collection(db, "memes", memeId, "comments");
    onSnapshot(commentsCollection, (snapshot) => {
        commentsDiv.innerHTML = "";
        const comments = [];
        snapshot.forEach((docSnap) => {
            comments.push({ id: docSnap.id, ...docSnap.data() });
        });
        comments.sort((a, b) => a.timestamp - b.timestamp);
        comments.forEach((comment) => {
            const commentWrapper = document.createElement("div");
            commentWrapper.className = "comment-wrapper";

            const commentP = document.createElement("p");
            const date = new Date(comment.timestamp).toLocaleString();
            commentP.textContent = `${comment.nickname}: ${comment.text} (${date})`;

            const deleteCommentBtn = document.createElement("button");
            deleteCommentBtn.textContent = "Delete";
            deleteCommentBtn.className = "delete-comment-btn";
            deleteCommentBtn.style.display = (currentUserEmail === ADMIN_ID) ? "inline-block" : "none";
            deleteCommentBtn.onclick = () => deleteComment(memeId, comment.id);

            commentWrapper.appendChild(commentP);
            commentWrapper.appendChild(deleteCommentBtn);
            commentsDiv.appendChild(commentWrapper);
        });
        commentsDiv.scrollTop = commentsDiv.scrollHeight;
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
        alert("Failed to delete meme: " + error.message);
    }
}

if (updateMemeBtn && memeInput) {
    updateMemeBtn.addEventListener("click", async () => {
        const newMemeURL = memeInput.value.trim();
        if (newMemeURL) {
            const allowedExtensions = /\.(jpg|jpeg|png)(\?.*)?$/i;
            if (!allowedExtensions.test(newMemeURL)) {
                alert("Only static images (.jpg, .jpeg, .png) are allowed. No GIFs, videos, or other formats.");
                return;
            }
            try {
                await addDoc(memesCollection, {
                    url: newMemeURL,
                    uploadedBy: currentUserEmail,
                    nickname: currentUsername,
                    timestamp: Date.now(),
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

if (sortOptions) {
    sortOptions.addEventListener("change", (e) => {
        renderMemes(e.target.value);
    });
}

// Initial render with default sorting (latest uploaded)
renderMemes("latest-uploaded");
