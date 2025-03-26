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
    let voteCountPerUser = localStorage.getItem("voteCountPerUser") ? parseInt(localStorage.getItem("voteCountPerUser")) : 0;
    const maxVotes = 2;
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function handleVote(change, type) {
        if (lastVote === type && voteCountPerUser > 0) {
            // Cancel vote if clicking the same button again
            voteCount -= change;
            voteCountPerUser -= 1;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("voteCountPerUser", voteCountPerUser);
            if (voteCountPerUser === 0) {
                localStorage.removeItem("lastVote");
                lastVote = null;
            }
            alert("Your vote has been canceled.");
        } else if (voteCountPerUser < maxVotes) {
            // Register new vote if under limit
            voteCount += change;
            voteCountPerUser += 1;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("voteCountPerUser", voteCountPerUser);
            localStorage.setItem("lastVote", type);
            lastVote = type;
            alert("Thank you for voting!");
        } else {
            alert("You have reached the maximum of 2 votes.");
        }
        
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
