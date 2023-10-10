chrome.action.onClicked.addListener(function(tab) {
    console.log("Inside listener: Sending message from background script");
    chrome.tabs.sendMessage(tab.id, {action: "processPage"}, function(response) {
        if (chrome.runtime.lastError) {
            console.error("Error in sendMessage:", chrome.runtime.lastError.message);
            return;  // Early return
        }

        // This code will only run if there was no error
        console.log("Response from content script:", response ? response.result : "No response");
    });
    console.log("Inside listener: After sending message");
});
