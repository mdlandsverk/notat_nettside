const ACCESS_TOKEN = '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'; //Github API token
const OWNER = 'DagAndreas';
const REPO = 'UniWiki';

let fileContentsByFolder = {};

// Function to update the DOM (the webpage)
function updateDOM() {
  
    // Loop through each key-value pair in the fileContentsByFolder object
    for(const [folder, files] of Object.entries(fileContentsByFolder)) {

        // Fetch the HTML element with an ID that matches the current folder name
        // For example, if folder is "JavaScript", it looks for an element with the ID "JavaScript-files"
        const folderElement = document.getElementById(`${folder}-files`);
        
        // Check if the HTML element actually exists
        if (folderElement) {
            
            // Update the innerHTML of the folder element
            // Convert the list of files into an array of paragraphs, then join them into a single string
            folderElement.innerHTML = files.map(file => `<p>${file.name}</p>`).join('');
        }
    }
}

// Function to fetch the content of a given file and update the fileContentsByFolder object accordingly
async function fetchAndUpdateFile(file) {
    
    // Construct the URL for fetching the file content, replacing the necessary parts and appending the access token for authorization
    const fileContentUrl = file.git_url.replace('git/blobs', 'contents').concat(`?access_token=${ACCESS_TOKEN}`);
    
    // Fetch the content of the file from GitHub
    const response = await fetch(fileContentUrl);
    
    // Convert the fetched content into text format
    const fileContent = await response.text();
    
    // Extract the folder name from the first line of the file by removing the '#' symbol
    const folderName = fileContent.split('\n')[0].replace('#', '');
    
    // Check if the folder already exists in the fileContentsByFolder object
    if (!fileContentsByFolder[folderName]) {
        
        // If not, initialize an empty array for that folder
        fileContentsByFolder[folderName] = [];
        
        // Add the file to the folder's array
        fileContentsByFolder[folderName].push(file);
    }
}

// Fetch all .md files from the GitHub repository and update the DOM accordingly
async function fetchFilesFromRepo() {

    // Create the URL to fetch the file tree from the GitHub repository
    const apiURL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1&access_token=${ACCESS_TOKEN}`;
    
    // Fetch the data from the GitHub API
    const response = await fetch(apiURL);
    
    // Parse the response to JSON format
    const data = await response.json();
    
    // Filter out all the .md files from the file tree
    const mdFiles = data.tree.filter(file => file.path.endsWith('.md'));
    
    // Loop through each .md file
    for (const file of mdFiles) {
        
        // Fetch the file content and update the fileContentsByFolder object
        await fetchAndUpdateFile(file);
    }

    // Update the DOM with the new data
    updateDOM();
}

// Call the fetchFilesFromRepo function initially to start the process
fetchFilesFromRepo();
