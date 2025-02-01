const vscode = require("vscode");

/**
 * Prompt user for GitHub username and access token.
 * @returns {Promise<{username: string, token: string} | null>}
 */
async function promptForGitHubCredentials() {
  const username = await vscode.window.showInputBox({
    prompt: "Enter your GitHub username",
    placeHolder: "github-username",
    ignoreFocusOut: true,
  });

  if (!username) {
    vscode.window.showErrorMessage("GitHub username is required.");
    return null;
  }

  const token = await vscode.window.showInputBox({
    prompt: "Enter your GitHub Personal Access Token",
    placeHolder: "github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    password: true,
    ignoreFocusOut: true,
  });

  if (!token) {
    vscode.window.showErrorMessage("GitHub-PAT token is required.");
    return null;
  }

  return { username, token };
}

/**
 * Save GitHub credentials securely in VS Code's global state.
 */
async function saveGitHubCredentials(context, username, token) {
  await context.globalState.update("githubUsername", username);
  await context.globalState.update("githubToken", token);
}

/**
 * Retrieve stored GitHub credentials.
 */
async function getGitHubCredentials(context) {
  const username = context.globalState.get("githubUsername");
  const token = context.globalState.get("githubToken");

  if (!username || !token) {
    return null;
  }

  return { username, token };
}

/**
 * Ensures valid GitHub credentials exist; otherwise, prompts the user.
 */
async function ensureGitHubAuth(context) {
  let credentials = await getGitHubCredentials(context);

  if (!credentials) {
    credentials = await promptForGitHubCredentials();
    if (credentials) {
      await saveGitHubCredentials(
        context,
        credentials.username,
        credentials.token
      );
    }
  }

  return credentials;
}

module.exports = ensureGitHubAuth;
