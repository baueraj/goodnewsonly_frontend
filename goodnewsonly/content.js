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
function obstructHeadlinesAndImages(headlines, newsDomain) {
    try {
        headlines.forEach((headlineText) => {
            let headlineElements;

            // Domain-specific logic
            if (newsDomain.includes('cnn.com') || newsDomain.includes('bbc.com') || newsDomain.includes('bbc.co.uk')) {
                // Logic for CNN, BBC, etc.
                headlineElements = document.querySelectorAll('h3.title a'); // Existing selector
            } else if (newsDomain.includes('foxnews.com')) {
                // Special logic for Fox News
                headlineElements = document.querySelectorAll('article.article');
            } else {
                // Default logic (can be adjusted)
                headlineElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
            }

            headlineElements.forEach((element) => {
                if (element.textContent.includes(headlineText)) {
                    if (newsDomain.includes('cnn.com') || newsDomain.includes('bbc.com') || newsDomain.includes('bbc.co.uk')) {
                        // Existing logic for CNN, BBC, etc.
                        let headlineContainer = element.closest('.info');
                        if (headlineContainer) {
                            headlineContainer.style.display = 'none';
                            let imageContainer = headlineContainer.previousElementSibling;
                            if (imageContainer && imageContainer.classList.contains('m')) {
                                imageContainer.style.display = 'none';
                            }
                        }
                    } else if (newsDomain.includes('foxnews.com')) {
                        // Special handling for Fox News
                        let articleContainer = element.closest('article.article');
                        if (articleContainer) {
                            articleContainer.style.display = 'none';
                        }
                    } else {
                        // Default handling (can be adjusted)
                        element.style.display = 'none';
                    }
                }
            });
        });
        console.log("Successfully obstructed headlines and their associated images and links");
    } catch (error) {
        console.error("Failed to obstruct headlines, images, and links:", error);
    }
}

// console.log("Received message in content script"); // Why did I put this here????

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
    img.src = chrome.runtime.getURL("assets/draining_rotating_hourglass.gif");
    img.style.width = "200px";

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
        showOverlay();

        setTimeout(async function() {
            window.scrollTo(0, 0);

            try {
                console.log("Before sending fetch request");
                const response = await fetch('https://good-news-only-a0460683d0b8.herokuapp.com/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({url: window.location.href})
                });
                const data = await response.json();
                console.log("Received headlines from backend:", data.headlines);
                await obstructHeadlinesAndImages(data.headlines, request.domain); // Pass domain to the function
                sendResponse({result: "Headlines obstructed"});
            } catch (error) {
                console.error("Error communicating with backend:", error);
                sendResponse({result: "Error"});
            } finally {
                removeOverlay();
            }

        }, 2000);  // TODO: Is this specification necessary anymore?!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        return true;
    }
});
