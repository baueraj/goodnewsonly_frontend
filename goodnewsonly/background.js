console.log("Background script loaded");

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("Insider listener: Sending message from background script");
    chrome.tabs.sendMessage(tab.id, {action: "processPage"}, function(response) {
        console.log(response.result);  // Should log "Headlines obstructed" or "Error"
    });
    console.log("Inside listener: After sending message");
});

console.log("Background script reached the end of the file");

// chrome.browserAction.onClicked.addListener(function(tab) {
//     // This block will be executed when the extension icon is clicked.
//     // For example, you can send a message to content.js here.
//     chrome.tabs.sendMessage(tab.id, {action: "processPage"});
// });
