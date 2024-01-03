// Fetch and display the list of supported domains
// console.log("Testing file path:", chrome.runtime.getURL("assets/news_domains_supported.txt"));
fetch(chrome.runtime.getURL("assets/news_domains_supported.txt"))
    .then(response => response.text())
    .then(text => {
        document.getElementById("supportedDomains").textContent = `${text}`;
    })
    .catch(error => console.error("Error loading supported domains:", error));
