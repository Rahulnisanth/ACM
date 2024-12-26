const vscode = require("vscode");
const { execSync } = require("child_process");

async function checkGitStatus(folderPath) {
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: folderPath });
    const remoteAddress = getGitRemoteAddress(folderPath);
    if (remoteAddress) {
      vscode.window.showInformationMessage(
        `Existing remote address: ${remoteAddress}`
      );
    } else {
      await promptCreateRepository();
    }
  } catch {
    await promptCreateRepository();
  }
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
    await vscode.commands.executeCommand("workbench.view.scm");
    await vscode.commands.executeCommand("git.init");
    await vscode.commands.executeCommand("git.publish");
  } else {
    vscode.window.showInformationMessage("Repository creation skipped.");
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
  context.subscriptions.push(checkGitStatusCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
