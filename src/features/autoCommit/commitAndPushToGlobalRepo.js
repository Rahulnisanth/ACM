const vscode = require("vscode");
const axios = require("axios");
const ensureGitHubAuth = require("../../auth/credentials");

/**
 * Pushes a log file to the `Activity-Logger` GitHub repository.
 */
async function commitAndPushToGlobalRepo(context, fileName, content) {
  const credentials = await ensureGitHubAuth(context);
  if (!credentials) return;

  const { username, token } = credentials;
  const repoName = "Activity-Logger";
  const sanitizedFileName = encodeURIComponent(fileName);
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/${sanitizedFileName}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Get the existing file SHA if it exists
    let sha = null;
    try {
      const { data } = await axios.get(apiUrl, { headers });
      sha = data.sha;
    } catch (e) {
      // File doesn't exist, ignore error
      console.log("File doesn't exist yet, error:", e);
    }

    // Commit the new file
    const commitData = {
      message: `chore: update work log (${fileName})`,
      content: Buffer.from(content).toString("base64"),
      sha,
    };

    const response = await axios.put(apiUrl, commitData, { headers });
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Failed to push log: ${error.message}`);
  }
}

module.exports = commitAndPushToGlobalRepo;
