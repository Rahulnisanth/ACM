const vscode = require("vscode");
const { join } = require("path");
const { existsSync, lstatSync } = require("fs");
// *Checks if the 'Activity-Logger' folder exists in the workspace.
async function getHistoryFolderStatus() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showInformationMessage("No workspace folder is open.");
    return false;
  }
  for (const folder of workspaceFolders) {
    const folderPath = folder.uri.fsPath;
    const projectHistoryPath = join(folderPath, "Activity-Logger");
    if (
      existsSync(projectHistoryPath) &&
      lstatSync(projectHistoryPath).isDirectory()
    ) {
      return true;
    }
  }
  vscode.window.showErrorMessage("'Activity-Logger' folder not found");
  return false;
}

module.exports = getHistoryFolderStatus;
