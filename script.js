document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let lastVote = localStorage.getItem("lastVote"); // "upvote", "downvote", or null
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function handleVote(change, type) {
        if (lastVote === type) {
            // Cancel vote if clicking the same button again
            voteCount -= change;
            localStorage.setItem("voteCount", voteCount);
            localStorage.removeItem("lastVote");
            lastVote = null;
            alert("Your vote has been canceled.");
        } else {
            // Remove previous vote before applying new vote
            if (lastVote === "upvote") {
                voteCount -= 1;
            } else if (lastVote === "downvote") {
                voteCount += 1;
            }
            
            // Register new vote
            voteCount += change;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("lastVote", type);
            lastVote = type;
            alert("Thank you for voting!");
        }
        
        updateVoteDisplay();
    }

    upvoteBtn.onclick = function () {
        handleVote(1, "upvote");
    };
    
    downvoteBtn.onclick = function () {
        handleVote(-1, "downvote");
    };
    
    updateVoteDisplay();
});
