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
        upvoteBtn.removeEventListener("click", upvoteHandler);
        downvoteBtn.removeEventListener("click", downvoteHandler);
        voteCount += change;
        updateVoteDisplay();
    }

    function upvoteHandler() {
        handleVote(1);
    }
    
    function downvoteHandler() {
        handleVote(-1);
    }

    upvoteBtn.addEventListener("click", upvoteHandler);
    downvoteBtn.addEventListener("click", downvoteHandler);
    
    updateVoteDisplay();
});
