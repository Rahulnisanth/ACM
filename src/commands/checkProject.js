const vscode = require("vscode");
const { checkGithubRepo } = require("./checkGithubRepo");

async function checkProject() {
  const workspaceFolder = vscode.workspace.workspaceFolders;
  if (!workspaceFolder || workspaceFolder.length === 0) {
    vscode.window.showWarningMessage("No workspace folder is open.");
    return;
  }

  const { isRepo, message, remote } = await checkGithubRepo();

  if (isRepo) {
    vscode.window.showInformationMessage(
      `GitHub repository found: ${remote.fetchUrl}`
    );
  } else {
    const createRepo = await vscode.window.showWarningMessage(
      `${message}. Would you like to create a new repository?`,
      "Yes",
      "No"
    );
    if (createRepo === "Yes") {
      vscode.window.showInformationMessage("Creating repository...");
      // TODO: Repository creation logic
    }
  }
}

module.exports = { checkProject };
