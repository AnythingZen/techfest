// This script interacts with web pages.
// Check if overlay already exists
if (!document.getElementById('snipping-overlay')) {
    createOverlay();
  }
  
const snippingState = {
    isSelecting: false,
    startX: 0,
    startY: 0
};

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'snipping-overlay';
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

    const selection = document.createElement('div');
    selection.style.cssText = `
        position: absolute;
        border: 2px solid red;
        background: rgba(255, 0, 0, 0.3);
        display: none;
    `;

    overlay.appendChild(selection);
    document.body.appendChild(overlay);

    // Mouse event handlers
    overlay.addEventListener('mousedown', startSelection);
    overlay.addEventListener('mousemove', updateSelection);
    overlay.addEventListener('mouseup', endSelection);
}

function startSelection(e) {
    snippingState.isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    const selection = document.querySelector('#snipping-overlay div');
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.width = '0';
    selection.style.height = '0';
    selection.style.display = 'block';
}

function updateSelection(e) {
    if (!snippingState.isSelecting) return;
    const selection = document.querySelector('#snipping-overlay div');
    const currentX = e.clientX;
    const currentY = e.clientY;
    const width = currentX - startX;
    const height = currentY - startY;

    selection.style.left = (width < 0 ? currentX : startX) + 'px';
    selection.style.top = (height < 0 ? currentY : startY) + 'px';
    selection.style.width = `${Math.abs(width)}px`;
    selection.style.height = `${Math.abs(height)}px`;
}

function endSelection(e) {
    isSelecting = false;
    const overlay = document.getElementById('snipping-overlay');
    const selection = document.querySelector('#snipping-overlay div');
    selection.style.display = 'none';

    // Calculate selected area
    const rect = {
        x: Math.min(startX, e.clientX),
        y: Math.min(startY, e.clientY),
        width: Math.abs(e.clientX - startX),
        height: Math.abs(e.clientY - startY)
    };

    // Remove overlay
    overlay.remove();

    // Request screenshot from background
    chrome.runtime.sendMessage(
        { action: 'captureScreenshot', rect },
        (response) => processScreenshot(response.dataUrl, rect)
    );
}

function processScreenshot(dataUrl, rect) {
    const img = new Image();
    img.onload = () => {
      const dpr = window.devicePixelRatio;
      const scaledRect = {
        x: rect.x * dpr,
        y: rect.y * dpr,
        width: rect.width * dpr,
        height: rect.height * dpr
      };
  
      const canvas = document.createElement('canvas');
      canvas.width = scaledRect.width;
      canvas.height = scaledRect.height;
      const ctx = canvas.getContext('2d');
  
      if (!canvas || !ctx) {
        console.error('Canvas or context is invalid');
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
          console.error('Failed to create Blob from canvas');
          return;
        }
        console.log('Blob created successfully:', blob);
  
        const formData = new FormData();
        formData.append('image', blob, 'snip.png');
  
        fetch('https://66f1-104-196-54-241.ngrok-free.app/predict', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          console.log('Response from backend:', data);
        })
        .catch(error => {
          console.error('Error sending image to backend:', error);
        });
      }, 'image/png'); // Ensure the MIME type is 'image/png'
    };
  
    img.onerror = () => {
      console.error('Failed to load the image');
    };
  
    img.src = dataUrl;
}

function showResult(isDeepfake) {
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `Result: ${isDeepfake ? 'Deepfake Detected!' : 'Authentic'}`;
    resultDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: ${isDeepfake ? '#ff4444' : '#4CAF50'};
        color: white;
        z-index: 1000000;
        border-radius: 5px;
    `;
    document.body.appendChild(resultDiv);
    setTimeout(() => resultDiv.remove(), 3000);
}