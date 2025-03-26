document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    // Retrieve vote count and user voting status from localStorage
    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let hasVoted = localStorage.getItem("hasVoted");
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function disableButtons() {
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
    }

    if (hasVoted) {
        disableButtons();
    }

    function handleVote(change) {
        if (localStorage.getItem("hasVoted")) {
            alert("You have already voted.");
            return;
        }
        
        // Immediately disable buttons to prevent multiple clicks
        disableButtons();
        
        voteCount += change;
        localStorage.setItem("voteCount", voteCount);
        localStorage.setItem("hasVoted", "true"); // Store vote status
        updateVoteDisplay();
    }

    upvoteBtn.addEventListener("click", () => handleVote(1));
    downvoteBtn.addEventListener("click", () => handleVote(-1));
    
    updateVoteDisplay();
});
