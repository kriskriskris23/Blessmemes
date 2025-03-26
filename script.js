document.addEventListener("DOMContentLoaded", () => {
    const blessButton = document.getElementById("bless");
    const curseButton = document.getElementById("curse");
    const voteCount = document.getElementById("vote-count");

    let userVote = null; // Tracks the user's last vote

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
            // If they already voted but try to switch votes, prevent it
            alert("You have already voted.");
        }
    }

    function updateVoteCount(change) {
        let currentVotes = parseInt(voteCount.textContent);
        voteCount.textContent = currentVotes + change;
    }
});
