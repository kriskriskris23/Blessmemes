document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let lastVote = localStorage.getItem("lastVote") || null; // "upvote", "downvote", or null
    
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

    upvoteBtn.addEventListener("click", function () {
        handleVote(1, "upvote");
    });
    
    downvoteBtn.addEventListener("click", function () {
        handleVote(-1, "downvote");
    });
    
    updateVoteDisplay();
});
