document.addEventListener("DOMContentLoaded", () => {
    const blessButton = document.getElementById("bless");
    const curseButton = document.getElementById("curse");
    const voteCount = document.getElementById("vote-count");

    let userVote = null; // Tracks the user's last vote
    let votes = 0; // Initial vote count

    blessButton.addEventListener("click", () => handleVote("bless"));
    curseButton.addEventListener("click", () => handleVote("curse"));

    function handleVote(voteType) {
        if (userVote === voteType) {
            // If user clicks the same vote again, remove their vote
            alert("Your vote has been removed.");
            userVote = null;
            updateVoteCount(-1);
        } else if (userVote === null) {
            // If they haven't voted yet, allow voting
            userVote = voteType;
            alert("Thank you for voting!");
            updateVoteCount(1);
        } else {
            // If they already voted but try to switch votes, allow it by adjusting counts
            alert("You switched your vote.");
            updateVoteCount(-1); // Remove previous vote
            userVote = voteType;
            updateVoteCount(1); // Add new vote
        }
    }

    function updateVoteCount(change) {
        votes += change;
        voteCount.textContent = votes;
    }
});
