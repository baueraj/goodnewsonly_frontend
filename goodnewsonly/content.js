console.log("Content script loaded");

// Function to obstruct specified headlines
function obstructHeadlines(headlines) {
    try {
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
        console.log("Successfully obstructed headlines");
    } catch (error) {
        console.error("Failed to obstruct headlines:", error);
    }
}

console.log("Received message in content script");

// Function to show a white overlay
function showOverlay() {
    let overlay = document.createElement('div');
    overlay.setAttribute("id", "whiteOverlay");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "999999";
    overlay.style.backgroundColor = "white";
    document.body.appendChild(overlay);
}

// Function to remove the white overlay
function removeOverlay() {
    let overlay = document.getElementById("whiteOverlay");
    overlay.remove();
}

// Listener for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "processPage") {
        // Show overlay
        showOverlay();

        // Scroll to the bottom to load more content
        window.scrollTo(0, document.body.scrollHeight);

        // Wait for a few seconds for the new content to load
        setTimeout(function() {
            // Remove overlay
            removeOverlay();

            // Scroll back to the top
            window.scrollTo(0, 0);

            // Wrap your async code in an IIFE (Immediately Invoked Function Expression)
            (async () => {
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
                    const data = await response.json();
                    console.log("Received headlines from backend:", data.headlines);
                    obstructHeadlines(data.headlines);
                    sendResponse({result: "Headlines obstructed"});
                } catch (error) {
                    console.error("Error communicating with backend:", error);
                    sendResponse({result: "Error"});
                }
            })();

        }, 2000);  // x seconds delay

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
