document.addEventListener("DOMContentLoaded", function () {
    let voteCount = 0;
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    // Check if user has already voted
    let hasVoted = localStorage.getItem("hasVoted");
    if (hasVoted) {
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
    }

    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }
    
    function handleVote(change) {
        if (localStorage.getItem("hasVoted")) {
            alert("You have already voted.");
            return;
        }
        
        voteCount += change;
        localStorage.setItem("hasVoted", "true"); // Store vote status in localStorage
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
        updateVoteDisplay();
    }

    upvoteBtn.addEventListener("click", () => handleVote(1));
    downvoteBtn.addEventListener("click", () => handleVote(-1));
    
    updateVoteDisplay();
});
