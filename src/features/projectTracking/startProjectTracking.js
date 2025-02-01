const vscode = require("vscode");
const { mkdirSync, existsSync } = require("fs");
const { join } = require("path");
const createReadmeLogs = require("../createLogs/createReadmeLogs");
/**
 * Starts tracking the project by creating logs at regular intervals.
 * @param {string} currentProjectPath - Path to the local root folder.
 * @param {int} duration - User selected time duration.
 */
function startProjectTracking(currentProjectPath, duration) {
  const projectHistoryPath = join(currentProjectPath, "work-logs");
  try {
    if (!existsSync(projectHistoryPath)) {
      mkdirSync(projectHistoryPath);
      vscode.window.showInformationMessage(
        `'work-logs' folder created successfully at ${projectHistoryPath}`
      );
    }
    setInterval(() => {
      createReadmeLogs(currentProjectPath, projectHistoryPath, duration);
    }, duration * 60 * 1000);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create 'work-logs' folder: ${error.message}`
    );
  }
}

module.exports = startProjectTracking;
