const vscode = require("vscode");
const axios = require("axios");
const ensureGitHubAuth = require("../../auth/creds");
/**
 * Creates the global `Activity-Logger` repository if it doesn't exist.
 */
async function createGlobalRepoIfNotExists(context) {
  const credentials = await ensureGitHubAuth(context);
  if (!credentials) return;

  const { username, token } = credentials;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const repoName = "Activity-Logger";
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}`;

  try {
    // Check if the repo already exists
    await axios.get(apiUrl, { headers });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // If Repo does not exist, create it
      await axios.post(
        `https://api.github.com/user/repos`,
        {
          name: repoName,
          description:
            "Global Repository for tracking overall Activity-Logger.",
          private: false,
          auto_init: false,
        },
        { headers }
      );
      vscode.window.showInformationMessage(
        `✅ Created global repository 'Activity-Logger'.`
      );
    } else {
      vscode.window.showErrorMessage(
        `❌ Failed to check/create repository: ${error.message}`
      );
    }
  }
}

module.exports = createGlobalRepoIfNotExists;
