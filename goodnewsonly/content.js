console.log("Content script loaded");

// Function to obstruct specified headlines
function obstructHeadlines(headlines) {
    // Loop through each headline in the list
    headlines.forEach((headlineText) => {
        // Find the headline on the page and obstruct it.
        // This part may vary depending on how headlines are structured in HTML.
        const headlineElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span'); // adjust selectors as needed

        headlineElements.forEach((element) => {
            if (element.textContent.includes(headlineText)) {
                element.style.display = 'none';  // hide the headline
            }
        });
    });
}

console.log("Received message in content script");

// Listener for messages from the background script
document.addEventListener("DOMContentLoaded", function() {
    console.log("Idk");
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
        console.log("Message listener triggered, request action:", request.action);
        if (request.action == "processPage") {
            try {
                console.log("Before sending fetch request");
                const response = await fetch('https://good-news-only-a0460683d0b8.herokuapp.com/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({url: window.location.href}) // or send page content
                });
                console.log("After sending fetch request", response);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Received headlines from backend:", data.headlines);
                } else {
                    console.log("Received an error from backend:", response.status, response.statusText);
                }
                obstructHeadlines(data.headlines);
                sendResponse({result: "Headlines obstructed"});
            } catch (error) {
                console.error("Error communicating with backend:", error);
                sendResponse({result: "Error"});
            }
        }
        return true; // Keeps the message channel open until `sendResponse` is executed
    });
});