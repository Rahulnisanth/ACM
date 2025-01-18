const vscode = require("vscode");
const { writeFileSync, existsSync, readFileSync } = require("fs");
const { join } = require("path");
const getChanges = require("../../pkg/common/getChanges");
const formatDate = require("../../pkg/formats/formatDate");
const formatTime = require("../../pkg/formats/formatTime");
const formatReadme = require("../../pkg/formats/formatReadme");
const commitAndPush = require("../autoCommit/commitAndPush");

function createReadmeLogs(currentProjectPath, projectHistoryPath, duration) {
  const date = formatDate(new Date());
  const startTime = formatTime(new Date());
  const endTime = formatTime(
    new Date(new Date().getTime() + duration * 60 * 1000)
  );

  const fileName = `[${date}: ${startTime} to ${endTime}].md`;
  const filePath = join(projectHistoryPath, fileName);
  const changes = getChanges(currentProjectPath);

  // Path for cached changes
  const lastChangesFile = join(projectHistoryPath, "cache.txt");
  let lastLoggedChanges = existsSync(lastChangesFile)
    ? readFileSync(lastChangesFile, "utf-8")
    : "";

  // Skip duplicate or nil change logs
  if (changes === lastLoggedChanges || changes === "No changes detected") {
    vscode.window.showInformationMessage(
      "No new changes detected, Skipping log creation."
    );
    return;
  }
  writeFileSync(lastChangesFile, changes);

  const logContent = formatReadme(changes, date, startTime, endTime);

  try {
    writeFileSync(filePath, logContent);
    vscode.window.showInformationMessage(`Log file created: ${fileName}`);
    // Auto-committing the logs
    commitAndPush(currentProjectPath, [filePath, lastChangesFile]);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create log file: ${error.message}`
    );
  }
}

module.exports = createReadmeLogs;
