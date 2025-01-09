const vscode = require("vscode");
const { writeFileSync, chmodSync } = require("fs");
const { join } = require("path");
const getSourceChanges = require("./getSourceChanges");

function createReadmeLogs(currentProjectPath, projectHistoryPath) {
  const now = new Date();
  const endTime = new Date(now.getTime() + 1 * 60 * 1000);

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fileName = `[${formatDate(now)}: ${formatTime(now)} to ${formatTime(
    endTime
  )}].md`;

  const filePath = join(projectHistoryPath, fileName);
  const changes = getSourceChanges(currentProjectPath);

  let logContent = `# Project Log\n\n## Time: ${formatTime(
    now
  )} to ${formatTime(endTime)}\n\n### Changes:\n${changes}`;
  try {
    writeFileSync(filePath, logContent);
    chmodSync(filePath, 0o444);
    vscode.window.showInformationMessage(`Log file created: ${fileName}`);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create log file: ${error.message}`
    );
  }
}

module.exports = createReadmeLogs;
