const vscode = require("vscode");

async function getCurrentFolderPath() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const currentFolder = workspaceFolders[0].uri.fsPath;
    return currentFolder;
  } else {
    return null;
  }
}

module.exports = getCurrentFolderPath;
