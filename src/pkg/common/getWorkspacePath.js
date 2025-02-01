const vscode = require("vscode");
// *Returns the path of the current workspace folder.
async function getWorkspacePath() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const currentFolder = workspaceFolders[0].uri.fsPath;
    return currentFolder;
  } else {
    return null;
  }
}

module.exports = getWorkspacePath;
