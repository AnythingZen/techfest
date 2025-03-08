

// Display output based on results
function updateVerificationStatus(isVerified) {
    const resultStatus = document.getElementById("resultStatus");
    const statusHeading = document.getElementById("statusHeading");
    //const verificationStatus = document.getElementById("verificationStatus");
    const verificationLabel = document.getElementById("verificationLabel");
    const statusExplanation = document.getElementById("statusExplanation");

    // Remove existing classes
    resultStatus.classList.remove('verified', 'unverified');

    if (isVerified) {
        // Set Verified (Green)
        resultStatus.classList.add("verified");
        resultStatus.style.backgroundColor = "rgba(46, 125, 50, 0.1)";
        statusHeading.style.color = "green";
        statusHeading.textContent = "This seems legitimate";
        verificationLabel.textContent = "Verified";
        statusExplanation.textContent = "Explanation of why it is authentic.";
    } else {
        // Set Unverified (Red)
        resultStatus.classList.add("unverified");
        resultStatus.style.backgroundColor = "rgba(255, 230, 230, 1)";
        statusHeading.style.color = "red";
        statusHeading.textContent = "This seems fake";
        verificationLabel.textContent = "Unverified";
        statusExplanation.textContent = "Explanation of why it is unauthentic.";
    }
}

// Get result with 2 second delay
setTimeout(() => {
    updateVerificationStatus(true);
}, 2000);
