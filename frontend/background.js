chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === 'captureScreenshot') {
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
    sendResponse({ dataUrl: dataUrl });
    });
    return true; // Keep the message channel open for async response
}
});