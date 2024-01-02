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

// Function to obstruct specified headlines (and links with headline-like text) and associated images
function obstructHeadlinesAndImages(headlines) {
    try {
        // Loop through each headline in the list
        headlines.forEach((headlineText) => {
            // Find the headline on the page.
            // This part may vary depending on how headlines are structured in HTML.
            const headlineElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a'); // added 'a'

            headlineElements.forEach((element) => {
                if (element.textContent.includes(headlineText)) {
                    // Find the closest parent that is a container, assuming it's a 'div'
                    // This can vary based on the website's HTML structure
                    let parentContainer = element.closest('div');
                    if (parentContainer) {
                        parentContainer.style.display = 'none';  // hide the entire container

                        // Attempt to find and hide the associated image
                        let associatedImage = parentContainer.previousElementSibling || parentContainer.nextElementSibling;
                        if (associatedImage && associatedImage.tagName === 'PICTURE') {
                            associatedImage.style.display = 'none';
                        }
                    }
                }
            });
        });
        console.log("Successfully obstructed headlines and their associated images and links");
    } catch (error) {
        console.error("Failed to obstruct headlines, images, and links:", error);
    }
}

console.log("Received message in content script");

// Function to show a white overlay
function showOverlay() {
    let overlay = document.createElement('div');
    overlay.setAttribute("id", "delayOverlay");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "999999";
    overlay.style.backgroundColor = "white";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";

    let text = document.createElement('div');
    text.textContent = "Removing bad news... please wait";
    text.style.fontSize = "20px";
    text.style.marginBottom = "20px";

    let img = document.createElement('img');
    img.src = "assets/draining_rotating_hourglass.gif";
    img.style.width = "50px";

    overlay.appendChild(text);
    overlay.appendChild(img);

    document.body.appendChild(overlay);
}


// Function to remove the overlay
function removeOverlay() {
    let overlay = document.getElementById("delayOverlay");
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
        setTimeout(async function() {
            // Scroll back to the top
            window.scrollTo(0, 0);

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
                await obstructHeadlinesAndImages(data.headlines); // Ensure this is awaited
                sendResponse({result: "Headlines obstructed"});
            } catch (error) {
                console.error("Error communicating with backend:", error);
                sendResponse({result: "Error"});
            } finally {
                // Remove overlay after all async tasks are done
                removeOverlay();
            }

        }, 2000); // x seconds delay

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
