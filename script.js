document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const blessBtn = document.getElementById("bless");
    const curseBtn = document.getElementById("curse");
    
    if (!voteDisplay || !blessBtn || !curseBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let lastVote = localStorage.getItem("lastVote") || null; // "bless", "curse", or null
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function handleVote(change, type) {
        if (lastVote === type) {
            alert("You have already voted.");
            return;
        }
        
        if (lastVote) {
            alert("You can only vote once.");
            return;
        }
        
        voteCount += change;
        localStorage.setItem("voteCount", voteCount);
        localStorage.setItem("lastVote", type);
        lastVote = type;
        alert("Thank you for voting!");
        
        updateVoteDisplay();
    }

    blessBtn.addEventListener("click", function () {
        handleVote(1, "bless");
    });
    
    curseBtn.addEventListener("click", function () {
        handleVote(-1, "curse");
    });
    
    updateVoteDisplay();
});
