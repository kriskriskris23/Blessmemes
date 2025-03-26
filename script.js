document.addEventListener("DOMContentLoaded", function () {
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
    
    upvoteBtn.addEventListener("click", function () {
        voteCount++;
        updateVoteDisplay();
    });
    
    downvoteBtn.addEventListener("click", function () {
        voteCount--;
        updateVoteDisplay();
    });
    
    updateVoteDisplay();
});
