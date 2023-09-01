// GitHub API access token (Note: Storing the token client-side is not secure and only for demonstration)
const ACCESS_TOKEN = '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';

// GitHub repository owner and repository name
const OWNER = 'DagAndreas';
const REPO = 'UniWiki';

// Empty object to store file contents grouped by folder name
let fileContentsByFolder = {};

// Function to update the HTML content dynamically based on the folders and files fetched
function updateDOM() {
    // Get the folder container div
    const foldersContainer = document.getElementById("folders-container");
    foldersContainer.innerHTML = '';  // Clear existing content

    // Loop through each folder and its files
    for (const [folder, files] of Object.entries(fileContentsByFolder)) {
        // Create new div for each folder
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderDiv.onclick = () => openFolder(folder);  // Attach click event handler

        // Create image element for folder icon
        const img = document.createElement('img');
        img.src = "Resources/Pictures/folder.png";
        img.alt = "Folder Icon";

        // Create paragraph element for folder name
        const folderNamePara = document.createElement('p');
        folderNamePara.className = 'folder_name';
        folderNamePara.textContent = folder;

        // Create div to hold the content files within the folder
        const folderContentDiv = document.createElement('div');
        folderContentDiv.className = 'folder-content';
        folderContentDiv.id = `${folder.toLowerCase().replace(/ /g, '_')}-files`;  // Replace spaces with underscores for ID
        folderContentDiv.innerHTML = files.map(file => `<p>${file.name}</p>`).join('');

        // Append elements to folder div
        folderDiv.appendChild(img);
        folderDiv.appendChild(folderNamePara);
        folderDiv.appendChild(folderContentDiv);

        // Append folder div to main container
        foldersContainer.appendChild(folderDiv);
    }
}

// Function to fetch individual .md file content and update it in the fileContentsByFolder object
async function fetchAndUpdateFile(file) {
    const headers = {
        'Authorization': `token ${ACCESS_TOKEN}`
    };

    const response = await fetch(file.url, { headers });
    const data = await response.json();

    const fileText = atob(data.content);
    const folderName = fileText.split('\n')[0].replace('#', '').trim();

    if (!fileContentsByFolder[folderName]) {
        fileContentsByFolder[folderName] = [];
    }
    fileContentsByFolder[folderName].push(file);
}

// Function to fetch all .md files from the GitHub repository
async function fetchFilesFromRepo() {
    const headers = {
        'Authorization': `token ${ACCESS_TOKEN}`
    };    

    const apiURL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1`;
    const response = await fetch(apiURL, { headers });

    if (response.ok) {
        const data = await response.json();
        const mdFiles = data.tree.filter(file => file.path.endsWith('.md'));

        for (const file of mdFiles) {
            await fetchAndUpdateFile(file);
        }
        updateDOM();
    } else {
        const errorData = await response.json();
        console.error('Error fetching from GitHub API:', errorData);
    }
}

// Function to handle folder click events and toggle their visibility
function openFolder(folderName) {
    const folderId = `${folderName.toLowerCase().replace(/ /g, '_')}-files`;  // Create the ID from folder name
    const folderElement = document.getElementById(folderId);
    
    if (folderElement) {
        folderElement.style.display = folderElement.style.display === 'none' || folderElement.style.display === '' ? 'block' : 'none';
    } else {
        console.error(`Element with id ${folderId}-files not found.`);
    }
}

// Initial fetch when the page loads
fetchFilesFromRepo();
