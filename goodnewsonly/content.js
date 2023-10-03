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

// Listener for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "processPage") {
        // Fetch the current page's URL or content and send it to the backend
        fetch('https://<your-heroku-app-name>.herokuapp.com/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url: window.location.href}) // or send page content
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the backend returns a list of headlines to obstruct
            obstructHeadlines(data.headlines);
        })
        .catch(error => {
            console.error("Error communicating with backend:", error);
        });
    }
});
