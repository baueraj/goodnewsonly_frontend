console.log("Background script loaded");

chrome.action.onClicked.addListener(function(tab) {
    console.log("Inside listener: Sending message from background script");
    chrome.tabs.sendMessage(tab.id, {action: "processPage"}, function(response) {
        if(chrome.runtime.lastError){
            console.error("Error in sendMessage:", chrome.runtime.lastError.message);
            return;
        }

        if (response) {
          console.log("Response from content script:", response.result);
        } else {
          console.warn("No response received from content script");
        }
    });
    console.log("Inside listener: After sending message");
});
