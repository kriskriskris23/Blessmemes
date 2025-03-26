document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let lastVote = localStorage.getItem("lastVote"); // Stores "upvote", "downvote", or null
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function disableVoting() {
        upvoteBtn.disabled = true;
        downvoteBtn.disabled = true;
    }
    
    function enableVoting() {
        upvoteBtn.disabled = false;
        downvoteBtn.disabled = false;
    }

    function handleVote(change, type) {
        if (lastVote === type) {
            // If clicking the same vote again, cancel the vote
            voteCount -= change;
            localStorage.setItem("voteCount", voteCount);
            localStorage.removeItem("lastVote");
            lastVote = null;
            enableVoting();
            alert("Your vote has been canceled.");
        } else {
            // If switching votes, reset first
            if (lastVote) {
                let previousChange = lastVote === "upvote" ? 1 : -1;
                voteCount -= previousChange;
            }
            
            // Register the new vote
            voteCount += change;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("lastVote", type);
            lastVote = type;
            disableVoting();
            alert("Thank you for voting!");
        }
        
        updateVoteDisplay();
    }

    upvoteBtn.addEventListener("click", () => handleVote(1, "upvote"));
    downvoteBtn.addEventListener("click", () => handleVote(-1, "downvote"));
    
    if (lastVote) {
        disableVoting();
    }

    updateVoteDisplay();
});
