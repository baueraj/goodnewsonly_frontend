let supportedDomains = [];

fetch(chrome.runtime.getURL('assets/news_domains_supported.txt'))
    .then(response => response.text())
    .then(text => {
        supportedDomains = text.split('\n').filter(domain => domain.trim() !== '');
        console.log(supportedDomains); // For debugging, to check if domains are loaded correctly
    })
    .catch(error => console.error('Error loading supported domains:', error));


// const supportedDomains = [
//     "foxnews.com", "cnn.com", "bbc.com", "bbc.co.uk"
// ];


function getRootDomain(url) {
    let hostname = new URL(url).hostname;
    let domainParts = hostname.split(".");
    let rootDomain = "";

    // Check for known public suffixes like "co.uk"; kind of an inelegant workaround just for "co.uk";
    // really just applicable for suffixes with a "."
    if (domainParts.length > 2) {
        let knownPublicSuffixes = ["co.uk"]; // Add other known public suffixes if needed
        let potentialPublicSuffix = domainParts.slice(-2).join(".");

        if (knownPublicSuffixes.includes(potentialPublicSuffix)) {
            rootDomain = domainParts.slice(-3).join("."); // Take the last 3 parts for domains like "bbc.co.uk"
        } else {
            rootDomain = domainParts.slice(-2).join("."); // Take the last 2 parts for standard domains
        }
    } else {
        rootDomain = hostname; // Use hostname directly if there are only two parts
    }

    return rootDomain;
}


chrome.action.onClicked.addListener(function(tab) {
    let currentDomain = getRootDomain(tab.url);

    if (supportedDomains.includes(currentDomain)) {
        console.log("Inside listener: Sending message from background script");
        chrome.tabs.sendMessage(tab.id, {action: "processPage", domain: currentDomain}, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error in sendMessage:", chrome.runtime.lastError.message);
                return;
            }
            console.log("Response from content script:", response ? response.result : "No response");
        });
    } else {
        chrome.action.setPopup({ popup: "popup/news_domain_unsupported.html" });
    }
});

