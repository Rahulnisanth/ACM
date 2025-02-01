const vscode = require("vscode");
const { mkdirSync, existsSync } = require("fs");
const { join } = require("path");
const createReadmeLogs = require("../createLogs/createReadmeLogs");
/**
 * Starts tracking the project by creating logs at regular intervals.
 * @param {string} currentProjectPath - Path to the local root folder.
 * @param {int} duration - User selected time duration.
 */
function startProjectTracking(
  context,
  currentProjectPath,
  duration,
  remoteAddress
) {
  const projectHistoryPath = join(currentProjectPath, "Activity-Logger");
  try {
    if (!existsSync(projectHistoryPath)) {
      mkdirSync(projectHistoryPath);
    }
    setInterval(() => {
      createReadmeLogs(
        context,
        currentProjectPath,
        projectHistoryPath,
        duration,
        remoteAddress
      );
    }, duration * 60 * 1000);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create 'Activity-Logger' folder: ${error.message}`
    );
  }
}

module.exports = startProjectTracking;
