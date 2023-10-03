chrome.browserAction.onClicked.addListener(function(tab) {
    // This block will be executed when the extension icon is clicked.
    // For example, you can send a message to content.js here.
    chrome.tabs.sendMessage(tab.id, {action: "processPage"});
});
