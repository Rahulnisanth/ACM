const vscode = require("vscode");
const { join } = require("path");
const { existsSync, lstatSync } = require("fs");

async function checkHistoryFolder() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showInformationMessage("No workspace folder is open.");
    return false;
  }
  for (const folder of workspaceFolders) {
    const folderPath = folder.uri.fsPath;
    const projectHistoryPath = join(folderPath, "project-history");
    if (
      existsSync(projectHistoryPath) &&
      lstatSync(projectHistoryPath).isDirectory()
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

module.exports = checkHistoryFolder;
