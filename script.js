import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
    getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // Replace with your actual API key
    authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual auth domain
    projectId: "YOUR_PROJECT_ID",   // Replace with your actual project ID
    storageBucket: "YOUR_STORAGE_BUCKET",  // Replace with your storage bucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your messaging sender ID
    appId: "YOUR_APP_ID",  // Replace with your actual app ID
    measurementId: "YOUR_MEASUREMENT_ID" // Replace with your measurement ID
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const blessBtn = document.getElementById("bless");
const curseBtn = document.getElementById("curse");
const voteCountSpan = document.getElementById("vote-count");
const memeInput = document.getElementById("meme-url");
const updateMemeBtn = document.getElementById("update-meme");
const memeImg = document.getElementById("meme-img");
const deleteMemeBtn = document.getElementById("delete-meme"); // Get the delete button


// Firestore Document Reference for the meme
const memeDocRef = doc(db, "memes", "currentMeme");

// Function to get device ID from localStorage, or create and store it
function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

const deviceId = getDeviceId();
const ADMIN_ID = "admin123";  // Replace with a real admin identifier (e.g., a specific device ID or user ID from auth)


let voteCount = 0;
let hasVoted = false;

// Load initial vote count and meme, and set up real-time updates
async function initialize() {
    try {
        const docSnap = await getDoc(memeDocRef);
        if (docSnap.exists()) {
            const memeData = docSnap.data();
            voteCount = memeData.votes;
            voteCountSpan.textContent = voteCount;
            memeImg.src = memeData.url;

             // Show delete button only for the uploader or admin
            if (memeData.uploadedBy === deviceId || deviceId === ADMIN_ID) {
                deleteMemeBtn.style.display = "block";
            } else {
                deleteMemeBtn.style.display = "none";
            }


        } else {
            console.log("No meme document found.  Initializing.");
            await setDoc(memeDocRef, { 
                url: "default-meme.jpg", 
                votes: 0,
                uploadedBy: "" // Add uploadedBy field here
            });
            voteCountSpan.textContent = "0";
            memeImg.src = "default-meme.jpg";
        }
    } catch (error) {
        console.error("Error initializing:", error);
    }
}
initialize();

// Event Listeners for voting buttons
blessBtn.addEventListener("click", async () => {
    if (!hasVoted) {
        voteCount++;
        voteCountSpan.textContent = voteCount;
        hasVoted = true;
        try {
            await updateDoc(memeDocRef, { votes: voteCount });
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    } else {
        alert("You can only vote once!");
    }
});

curseBtn.addEventListener("click", async () => {
    if (!hasVoted) {
        voteCount--;
        voteCountSpan.textContent = voteCount;
        hasVoted = true;
        try {
            await updateDoc(memeDocRef, { votes: voteCount });
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    } else {
        alert("You can only vote once!");
    }
});

// Event listener for updating the meme
updateMemeBtn.addEventListener("click", async () => {
    const newMemeUrl = memeInput.value;
    if (newMemeUrl.trim() !== "") {
        try {
            await setDoc(memeDocRef, { 
                url: newMemeUrl, 
                votes: 0,
                uploadedBy: deviceId // Store the device ID of the uploader
            });
            voteCount = 0;  // Reset vote count when meme is updated
            voteCountSpan.textContent = 0;
            hasVoted = false;
            memeInput.value = ""; // Clear the input
             // After successfully updating the meme:
            const memeData = await getDoc(memeDocRef);
             if(memeData.data().uploadedBy === deviceId || deviceId === ADMIN_ID){
                 deleteMemeBtn.style.display = "block";
             }
            alert("Meme updated!");
        } catch (error) {
            console.error("Error updating meme:", error);
        }
    } else {
        alert("Please enter a valid meme URL.");
    }
});

// Event listener for deleting the meme
deleteMemeBtn.addEventListener("click", async () => {
    try {
        await deleteDoc(memeDocRef);
        memeImg.src = "default-meme.jpg"; // Reset to default image
        deleteMemeBtn.style.display = "none"; // Hide button after deletion
        alert("Meme deleted!");
    } catch (error) {
        console.error("Error deleting meme:", error);
    }
});

// Real-time Sync: Update meme for all users instantly
onSnapshot(memeDocRef, (docSnap) => {
    if (docSnap.exists()) {
        const memeData = docSnap.data();
        memeImg.src = memeData.url;

        // Show delete button only for the uploader or admin
        if (memeData.uploadedBy === deviceId || deviceId === ADMIN_ID) {
            deleteMemeBtn.style.display = "block";
        } else {
            deleteMemeBtn.style.display = "none";
        }
    } else {
        memeImg.src = "default-meme.jpg"; // No meme found, show default
        deleteMemeBtn.style.display = "none";
    }
});

// Load meme from Firestore when page loads
async function loadMeme() {
    try {
        const docSnap = await getDoc(memeDocRef);
        if (docSnap.exists()) {
            const memeData = docSnap.data();
            memeImg.src = memeData.url;

            // Show delete button only for the uploader or admin
            if (memeData.uploadedBy === deviceId || deviceId === ADMIN_ID) {
                deleteMemeBtn.style.display = "block";
            }
        }
    } catch (error) {
        console.error("Error loading meme:", error);
    }
}
loadMeme();
