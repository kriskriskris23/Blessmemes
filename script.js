document.addEventListener("DOMContentLoaded", function () {
    const blessBtn = document.getElementById("bless");
    const curseBtn = document.getElementById("curse");
    const voteCountDisplay = document.getElementById("vote-count");

    // Load stored vote count and user's vote status from localStorage
    let voteCount = localStorage.getItem("voteCount") ? parseInt(localStorage.getItem("voteCount")) : 0;
    let hasVoted = localStorage.getItem("hasVoted") === "true"; // Check if user already voted

    // Update the displayed vote count
    voteCountDisplay.textContent = voteCount;

    function vote(change) {
        if (hasVoted) {
            alert("You have already voted.");
            return;
        }

        voteCount += change;
        voteCountDisplay.textContent = voteCount;
        localStorage.setItem("voteCount", voteCount); // Save vote count
        localStorage.setItem("hasVoted", "true"); // Mark user as voted

        alert("Thank you for voting!");
    }

    blessBtn.addEventListener("click", () => vote(1));
    curseBtn.addEventListener("click", () => vote(-1));
});
