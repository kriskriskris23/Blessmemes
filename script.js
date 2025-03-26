document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let hasVoted = localStorage.getItem("hasVoted") === "true";
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function disableVoting() {
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
        upvoteBtn.removeEventListener("click", upvoteHandler);
        downvoteBtn.removeEventListener("click", downvoteHandler);
    }

    function handleVote(change) {
        if (localStorage.getItem("hasVoted") === "true") {
            alert("You have already voted.");
            return;
        }
        
        // Prevents any clicks registering before storage updates
        localStorage.setItem("hasVoted", "true");
        disableVoting();
        
        voteCount += change;
        localStorage.setItem("voteCount", voteCount);
        updateVoteDisplay();
    }

    function upvoteHandler() {
        handleVote(1);
    }
    
    function downvoteHandler() {
        handleVote(-1);
    }

    if (hasVoted) {
        disableVoting();
    } else {
        upvoteBtn.addEventListener("click", upvoteHandler);
        downvoteBtn.addEventListener("click", downvoteHandler);
    }
    
    updateVoteDisplay();
});
