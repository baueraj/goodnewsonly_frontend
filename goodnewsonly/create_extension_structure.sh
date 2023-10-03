
#!/bin/bash

# Create directories
mkdir MyExtension
mkdir MyExtension/icons
mkdir MyExtension/popup

# Create icons
touch MyExtension/icons/icon16.png
touch MyExtension/icons/icon48.png
touch MyExtension/icons/icon128.png

# Create popup files
touch MyExtension/popup/popup.html
touch MyExtension/popup/popup.js

# Create other files
touch MyExtension/background.js
touch MyExtension/content.js
touch MyExtension/manifest.json

echo "Directory structure and files for Chrome extension created successfully!"
