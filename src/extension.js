const vscode = require("vscode");
const { execSync } = require("child_process");

async function checkGitStatus(folderPath) {
  try {
    // Check if git is initialized
    execSync("git rev-parse --is-inside-work-tree", { cwd: folderPath });
    // Get the remote address
    const remoteAddress = getGitRemoteAddress(folderPath);
    if (remoteAddress) {
      // Check for 'project-history' folder in the workspace
      const hasProjectHistoryFolder = await checkProjectHistoryFolder(
        folderPath
      );
      if (!hasProjectHistoryFolder) {
        // Prompt user to create 'project-history' folder
        const createProjectHistory = await vscode.window.showInformationMessage(
          "Would you like to track the logs for the project?",
          "Yes",
          "No"
        );
        if (createProjectHistory === "Yes") {
          createProjectHistoryFolder(folderPath);
        } else {
          vscode.window.showInformationMessage("Tracking logs declined.");
        }
      }
    } else {
      await promptCreateRepository();
    }
  } catch (error) {
    console.error("Error in checkGitStatus:", error);
    await promptCreateRepository();
  }
}

function createProjectHistoryFolder(folderPath) {
  const fs = require("fs");
  const path = require("path");

  const projectHistoryPath = path.join(folderPath, "project-history");
  try {
    fs.mkdirSync(projectHistoryPath);
    vscode.window.showInformationMessage(
      `'project-history' folder created successfully at ${projectHistoryPath}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create 'project-history' folder: ${error.message}`
    );
  }
}

async function checkProjectHistoryFolder() {
  const fs = require("fs");
  const path = require("path");
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showInformationMessage("No workspace folder is open.");
    return false;
  }
  // Iterate through all folders
  for (const folder of workspaceFolders) {
    const folderPath = folder.uri.fsPath;
    const projectHistoryPath = path.join(folderPath, "project-history");
    if (
      fs.existsSync(projectHistoryPath) &&
      fs.lstatSync(projectHistoryPath).isDirectory()
    ) {
      vscode.window.showInformationMessage(
        `'project-history' found in: ${folderPath}`
      );
      return true;
    }
  }
  vscode.window.showInformationMessage(
    "'project-history' folder not found in any workspace folder."
  );
  return false;
}

function getGitRemoteAddress(folderPath) {
  try {
    const remoteUrl = execSync("git remote get-url origin", { cwd: folderPath })
      .toString()
      .trim();
    return remoteUrl;
  } catch {
    return null;
  }
}

async function promptCreateRepository() {
  const createRepo = await vscode.window.showInformationMessage(
    "This workspace is not connected to GitHub. Would you like to create a repository?",
    "Yes",
    "No"
  );

  if (createRepo === "Yes") {
    // Move the user to source control
    await vscode.commands.executeCommand("workbench.view.scm");
  } else {
    vscode.window.showInformationMessage("Repository creation cancelled.");
  }
}

async function handleFolderChange() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const currentFolder = workspaceFolders[0].uri.fsPath;
    await checkGitStatus(currentFolder);
  } else {
    vscode.window.showInformationMessage("No workspace folder is open.");
  }
}

function activate(context) {
  const checkGitStatusCommand = vscode.commands.registerCommand(
    "extension.checkGitStatus",
    handleFolderChange
  );
  // Trigger when a new window is opened
  handleFolderChange();
  context.subscriptions.push(checkGitStatusCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
