(async function () {
	const { updateVerificationStatus, resetVerificationStatus } = await import(
		chrome.runtime.getURL("result.js")
	);

	// State object to track selection
	const snippingState = {
		isSelecting: false,
		startX: 0,
		startY: 0,
	};

	// Check if overlay already exists
	if (!document.getElementById("snipping-overlay")) {
		createOverlay();
	}

	// Create the snipping overlay
	function createOverlay() {
		// Remove existing overlay if any
		const existingOverlay = document.getElementById("snipping-overlay");
		if (existingOverlay) existingOverlay.remove();

		// Reset state for new session
		snippingState.isSelecting = false;
		snippingState.startX = 0;
		snippingState.startY = 0;

		// Create overlay div
		const overlay = document.createElement("div");
		overlay.id = "snipping-overlay";
		overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        cursor: crosshair;
        z-index: 999999;
      `;

		// Create selection rectangle
		const selection = document.createElement("div");
		selection.style.cssText = `
        position: absolute;
        border: 2px solid red;
        background: rgba(255, 0, 0, 0.3);
        display: none;
      `;

		overlay.appendChild(selection);
		document.body.appendChild(overlay);

		// Add event listeners
		overlay.addEventListener("mousedown", startSelection);
		overlay.addEventListener("mousemove", updateSelection);
		overlay.addEventListener("mouseup", endSelection);
	}

	// Start selection
	function startSelection(e) {
		snippingState.isSelecting = true;
		snippingState.startX = e.clientX;
		snippingState.startY = e.clientY;

		const selection = document.querySelector("#snipping-overlay div");
		selection.style.left = `${snippingState.startX}px`;
		selection.style.top = `${snippingState.startY}px`;
		selection.style.width = "0";
		selection.style.height = "0";
		selection.style.display = "block";
	}

	// Update selection
	function updateSelection(e) {
		if (!snippingState.isSelecting) return;

		const selection = document.querySelector("#snipping-overlay div");
		const currentX = e.clientX;
		const currentY = e.clientY;
		const width = currentX - snippingState.startX;
		const height = currentY - snippingState.startY;

		selection.style.left =
			(width < 0 ? currentX : snippingState.startX) + "px";
		selection.style.top =
			(height < 0 ? currentY : snippingState.startY) + "px";
		selection.style.width = `${Math.abs(width)}px`;
		selection.style.height = `${Math.abs(height)}px`;
	}

	// End selection
	function endSelection(e) {
		snippingState.isSelecting = false;

		const rect = {
			x: Math.min(snippingState.startX, e.clientX),
			y: Math.min(snippingState.startY, e.clientY),
			width: Math.abs(e.clientX - snippingState.startX),
			height: Math.abs(e.clientY - snippingState.startY),
		};

		// Remove overlay
		const overlay = document.getElementById("snipping-overlay");
		overlay.remove();

		// Request screenshot from background
		chrome.runtime.sendMessage(
			{ action: "captureScreenshot", rect },
			(response) => processScreenshot(response.dataUrl, rect)
		);
	}

	// Process the screenshot
	function processScreenshot(dataUrl, rect) {
		const img = new Image();
		img.onload = () => {
			const dpr = window.devicePixelRatio;
			const scaledRect = {
				x: rect.x * dpr,
				y: rect.y * dpr,
				width: rect.width * dpr,
				height: rect.height * dpr,
			};

			const canvas = document.createElement("canvas");
			canvas.width = scaledRect.width;
			canvas.height = scaledRect.height;
			const ctx = canvas.getContext("2d");

			if (!canvas || !ctx) {
				console.error("Canvas or context is invalid");
				return;
			}

			ctx.drawImage(
				img,
				scaledRect.x,
				scaledRect.y,
				scaledRect.width,
				scaledRect.height,
				0,
				0,
				scaledRect.width,
				scaledRect.height
			);

			canvas.toBlob((blob) => {
				if (!blob) {
					console.error("Failed to create Blob from canvas");
					return;
				}

				const formData = new FormData();
				formData.append("image", blob, "snip.png");

				fetch("https://cd3c-104-196-54-241.ngrok-free.app/predict", {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						console.log("Response from backend:", data);
						updateVerificationStatus(data.isDeepfake);
						setTimeout(() => {
							resetVerificationStatus();
						}, 3000);
					})
					.catch((error) => {
						console.error("Error sending image to backend:", error);
					});
			}, "image/png");
		};

		img.onerror = () => {
			console.error("Failed to load the image");
		};

		img.src = dataUrl;
	}
})();
