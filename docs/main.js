// Constants for Repository and File Path
const REPO = 'Damian-Oswald/test';
const FILE_PATH = 'test.json';

// Elements
const usernameInput = document.getElementById('username');
const tokenInput = document.getElementById('token');
const loadFileButton = document.getElementById('loadFile');
const editorDiv = document.getElementById('editor');
const fileContentTextarea = document.getElementById('fileContent');
const currentFileSpan = document.getElementById('currentFile');
const saveFileButton = document.getElementById('saveFile');

let currentSha = ''; // To store the SHA of the file for updates

// Display pre-set repo and file path
document.addEventListener('DOMContentLoaded', () => {
  currentFileSpan.textContent = `${REPO}/${FILE_PATH}`;
});

// Function to load file from GitHub
loadFileButton.addEventListener('click', async () => {
  const username = usernameInput.value;
  const token = tokenInput.value;

  if (!username || !token) {
    alert('Please enter your GitHub username and token.');
    return;
  }

  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }

    const data = await response.json();
    const content = atob(data.content); // Decode Base64 content

    // Display file content in editor
    fileContentTextarea.value = content;
    editorDiv.style.display = 'block';

    // Save the file's SHA for later use
    currentSha = data.sha;

  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Function to save file to GitHub
saveFileButton.addEventListener('click', async () => {
  const username = usernameInput.value;
  const token = tokenInput.value;
  const newContent = fileContentTextarea.value;

  if (!username || !token || !currentSha) {
    alert('Please ensure the file is loaded before saving.');
    return;
  }

  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const encodedContent = btoa(newContent); // Encode content to Base64

  const payload = {
    message: `Updated ${FILE_PATH} via web app`,
    content: encodedContent,
    sha: currentSha
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to save file: ${response.statusText}`);
    }

    const data = await response.json();
    alert(`File saved successfully! Commit SHA: ${data.commit.sha}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
