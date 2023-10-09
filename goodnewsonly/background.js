console.log("Background script loaded");

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("Insider listener: Sending message from background script");
    chrome.tabs.sendMessage(tab.id, {action: "processPage"}, function(response) {
        if(chrome.runtime.lastError){
            console.error(chrome.runtime.lastError);
            return;
        }
        console.log("Response from content script:", response.result);
    });
    console.log("Inside listener: After sending message");
});
