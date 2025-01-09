const vscode = require("vscode");
const { mkdirSync, existsSync } = require("fs");
const { join } = require("path");
const createReadmeLogs = require("./createReadmeLogs");

function startProjectTracking(currentProjectPath) {
  const projectHistoryPath = join(currentProjectPath, "project-history");
  try {
    if (!existsSync(projectHistoryPath)) {
      mkdirSync(projectHistoryPath);
      vscode.window.showInformationMessage(
        `'project-history' folder created successfully at ${projectHistoryPath}`
      );
    }
    setInterval(() => {
      createReadmeLogs(currentProjectPath, projectHistoryPath);
    }, 30 * 60 * 1000);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create 'project-history' folder: ${error.message}`
    );
  }
}

module.exports = startProjectTracking;
