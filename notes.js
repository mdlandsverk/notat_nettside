// Define a constant to hold the access token for the GitHub API
// Note: Its usually not safe to expose a access token in client-side code, however in this case I have used a github user that only have access to the specific repo and not my main user. 
const ACCESS_TOKEN ='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';

// Define constant for the owner and the repo name for the GitHub repo that we are accessing
const OWNER = 'DagAndreas'
const REPO = 'UniWiki'

// Create an empty object to hold the sorted file contents by folder
// Keys will be folder names and values will be arrays of file data
let fileContentsByFolder = {};

// Function to update the DOM (the webpage)
function updateDOM() {
  
    // Loop through each key-value pair in the fileContentsByFolder object
    for(const [folder, files] of Object.entries(fileContentsByFolder)) {

        // Convert folder name to lowercase
        const lowerCaseFolder = folder.toLowerCase();

        // Fetch the HTML element with an ID that matches the current folder name
        // For example, if folder is "Databases", it looks for an element with the ID "databases-files"
        const folderElement = document.getElementById(`${lowerCaseFolder}-files`);
        
        // Check if the HTML element actually exists
        if (folderElement) {
            
            // Update the innerHTML of the folder element
            // Convert the list of files into an array of paragraphs, then join them into a single string
            folderElement.innerHTML = files.map(file => `<p>${file.name}</p>`).join('');
        }
    }
}

// Asynchronous function to fetch the content of a given .md and categorize it
async function fetchAndUpdateFile(file) {

    // Construct the URL to fetch the file content
    const fileContentUrl = file.git_url.replace('git/blobs', 'contents').concat(`?access_token=${ACCESS_TOKEN}`);

    // Fetch the file content from GitHub
    const response = await fetch(fileContentUrl);

    // Convert the fetched content to text
    const fileText = await response.text();

    // The first line of the .md file contains the folder name (without the "#")
    const folderName = file.content.split('\n')[0].replace('#', '').trim();

    // If the folder doesnt ecist in the object, create an empty array for it
    if (!fileContentsByFolder[folderName]) {
        fileContentsByFolder[folderName] = [];
    }

    // Add the file to the folder
    fileContentsByFolder[folderName].push(file);
}

// Asychronous function to fetch all the .md files from the GitHub repo
async function fetchFilesFromRepo() {

    // Construct the GitHub API URL to get the tree of files
    const apiURL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1&access_token=${ACCESS_TOKEN}`;

    // Fetch the JSON data from the GitHub API
    const response = await fetch(apiURL);

    // Parse the response to a JSON object
    const data = await response.json();

    // Filter to get only the .md files
    const mdFiles = data.tree.filter(file => file.path.endsWith('.md'));

    // Loop through each .md file and fetch its content
    for (const file of mdFiles) {
        await fetchAndUpdateFile(file);
    }

    // Update the DOM to reflect the new data
    updateDOM();
}

//Fetch files from GitHub repo when the page loads
fetchFilesFromRepo();