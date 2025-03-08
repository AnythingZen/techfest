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

const inputSection = document.getElementById('inputSection');
// Show the input section when the search button is clicked
document.getElementById('searchButton').addEventListener('click', function() {
    if (inputSection.style.display === 'none' || inputSection.style.display === '') {
        inputSection.style.display = 'block';
    } else {
        inputSection.style.display = 'none';
    }
});


