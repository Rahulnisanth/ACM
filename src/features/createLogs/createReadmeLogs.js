const vscode = require("vscode");
const { writeFileSync, existsSync, readFileSync } = require("fs");
const { join } = require("path");
const getChanges = require("../../pkg/common/getChanges");
const formatDate = require("../../pkg/formats/formatDate");
const formatTime = require("../../pkg/formats/formatTime");

function createReadmeLogs(currentProjectPath, projectHistoryPath) {
  const date = formatDate(new Date());
  const startTime = formatTime(new Date());
  const endTime = formatTime(new Date(new Date().getTime() + 10000));

  const fileName = `[${date}: ${startTime} to ${endTime}].md`;
  const filePath = join(projectHistoryPath, fileName);
  const changes = getChanges(currentProjectPath);

  // Path for cached changes
  const lastChangesFile = join(projectHistoryPath, "cached_changes.txt");
  let lastLoggedChanges = existsSync(lastChangesFile)
    ? readFileSync(lastChangesFile, "utf-8")
    : "";

  // Skip duplicate logs
  if (changes === lastLoggedChanges) {
    vscode.window.showInformationMessage(
      "No new changes detected since the last log. Skipping log creation."
    );
    return;
  }
  writeFileSync(lastChangesFile, changes);

  const totalSummary = changes.split("\n").pop();
  let logContent = `# Project Log\n\n## Date: ${date}\n## Time: ${startTime} to ${endTime}\n\n### Changes:\n${changes}\n\n### Summary:\n${totalSummary}`;

  try {
    writeFileSync(filePath, logContent);
    vscode.window.showInformationMessage(`Log file created: ${fileName}`);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create log file: ${error.message}`
    );
  }
}

module.exports = createReadmeLogs;
