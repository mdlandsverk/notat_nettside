const ACCESS_TOKEN = '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'; //Github API token
const OWNER = 'DagAndreas';
const REPO = 'UniWiki';

let fileContentsByFolder = {};

//Function to update DOM
function updateDOM() {
    for(const [folder, files] of Object.entries(fileContentsByFolder)) {
        const folderElement = document.getElementById('${folder}-files');
        if (folderElement) {
            folderElement.innerHTML = files.map(file => '<p>${file.name}</p>').join('');
        }
    }
}

//Function to fetch file and update object
async function fetchAndUpdateFile(file) {
    const fileContentUrl = file.git_url.replace('git/blobs', 'contents').concat('?access_token=${ACCESS_TOKEN');
    const respone = await fetch(fileContentUrl);
    const fileContent = await response.txt();
    const folderName = fileContent.split('\n')[0].replace('#','');

    if (!fileContentsByFolder[folderName]) {
        fileContentsByFolder[folderName] = [];[folderName] = [];

        fileContentsByFolder[folderName].push(file);
    }
}

//Fetch files from repository
async function fetchFilesFromRepo() {
    const apiURL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1&access_token=${ACCESS_TOKEN}`;
    const respone = await fetch(apiURL);
    const data = await response.json();

    const mdFiles = data.tree.filter(file => file.path.endsWith('.md'));

    for (const file of mdFiles) {
        await fetchAndUpdateFile(file);
    }

    updateDOM();
}

//Initial Fetch
fetchFilesFromRepo();