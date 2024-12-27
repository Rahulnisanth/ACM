const vscode = require("vscode");
const { mkdirSync, chmodSync } = require("fs");
const { join } = require("path");

function createProjectHistoryFolder(folderPath) {
  const projectHistoryPath = join(folderPath, "project-history");
  try {
    mkdirSync(projectHistoryPath);
    chmodSync(projectHistoryPath, 0o555);
    vscode.window.showInformationMessage(
      `'project-history' folder created successfully at ${projectHistoryPath}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create 'project-history' folder: ${error.message}`
    );
  }
}

module.exports = createProjectHistoryFolder;
