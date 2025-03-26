document.addEventListener("DOMContentLoaded", function () {
    const voteDisplay = document.getElementById("vote-count");
    const upvoteBtn = document.getElementById("upvote");
    const downvoteBtn = document.getElementById("downvote");
    
    if (!voteDisplay || !upvoteBtn || !downvoteBtn) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let userVotes = localStorage.getItem("userVotes") ? parseInt(localStorage.getItem("userVotes")) : 0;
    const maxVotes = 2;
    
    function updateVoteDisplay() {
        voteDisplay.textContent = voteCount;
    }

    function handleVote(change) {
        if (userVotes < maxVotes) {
            voteCount += change;
            userVotes += 1;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("userVotes", userVotes);
            alert("Thank you for voting!");
        } else {
            alert("You have reached your vote limit of 2.");
        }
        
        updateVoteDisplay();
    }

    function handleUnvote(change) {
        if (userVotes > 0) {
            voteCount -= change;
            userVotes -= 1;
            localStorage.setItem("voteCount", voteCount);
            localStorage.setItem("userVotes", userVotes);
            alert("Your vote has been removed.");
        }
        
        updateVoteDisplay();
    }

    upvoteBtn.addEventListener("click", function () {
        if (userVotes < maxVotes) {
            handleVote(1);
        } else {
            handleUnvote(1);
        }
    });
    
    downvoteBtn.addEventListener("click", function () {
        if (userVotes < maxVotes) {
            handleVote(-1);
        } else {
            handleUnvote(-1);
        }
    });
    
    updateVoteDisplay();
});
