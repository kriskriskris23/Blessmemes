document.addEventListener("DOMContentLoaded", function () {
    let hasVoted = false;
    let voteCount = 0;
    
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }
    
    function handleVote(change) {
        if (hasVoted) {
            alert("You have already voted.");
            return;
        }
        hasVoted = true;
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
        voteCount += change;
        updateVoteDisplay();
    }

    upvoteBtn.addEventListener("click", () => handleVote(1));
    downvoteBtn.addEventListener("click", () => handleVote(-1));
    
    updateVoteDisplay();
});
