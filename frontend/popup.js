// This script runs when the popup is opened.
document.getElementById('snipButton').addEventListener('click', () => {
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Inject the snipping tool script
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
      
      // Close the popup
      window.close();
    });
  });