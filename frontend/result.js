// Display output based on results
function updateVerificationStatus(isVerified) {
	const resultStatus = document.getElementById("resultStatus");
	const statusHeading = document.getElementById("statusHeading");
	const verificationLabel = document.getElementById("verificationLabel");
	const statusExplanation = document.getElementById("statusExplanation");

	// Reset styles and content
	resultStatus.classList.remove("verified", "unverified");
	resultStatus.style.backgroundColor = ""; // Reset background color
	statusHeading.style.color = ""; // Reset text color

	if (isVerified) {
		// Set Verified (Green)
		resultStatus.classList.add("verified");
		resultStatus.style.backgroundColor = "rgba(46, 125, 50, 0.1)"; // Light green background
		statusHeading.style.color = "green";
		statusHeading.textContent = "This seems legitimate";
		verificationLabel.textContent = "Verified";
		statusExplanation.textContent = "Explanation of why it is authentic.";
	} else {
		// Set Unverified (Red)
		resultStatus.classList.add("unverified");
		resultStatus.style.backgroundColor = "rgba(255, 230, 230, 1)"; // Light red background
		statusHeading.style.color = "red";
		statusHeading.textContent = "This seems fake";
		verificationLabel.textContent = "Unverified";
		statusExplanation.textContent = "Explanation of why it is unauthentic.";
	}
}
function resetVerificationStatus() {
	const resultStatus = document.getElementById("resultStatus");
	const statusHeading = document.getElementById("statusHeading");
	const verificationLabel = document.getElementById("verificationLabel");
	const statusExplanation = document.getElementById("statusExplanation");

	// Reset styles and content
	resultStatus.classList.remove("verified", "unverified");
	resultStatus.style.backgroundColor = ""; // Reset background color
	statusHeading.style.color = ""; // Reset text color
	statusHeading.textContent = "Verification Status";
	verificationLabel.textContent = "Status: Pending";
	statusExplanation.textContent = "Waiting for results...";
}

export { updateVerificationStatus, resetVerificationStatus };
