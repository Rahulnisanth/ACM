const vscode = require("vscode");
const { writeFileSync, existsSync, readFileSync } = require("fs");
const { join } = require("path");
const getChanges = require("../../pkg/common/getChanges");
const formatDate = require("../../pkg/formats/formatDate");
const formatTime = require("../../pkg/formats/formatTime");
const commitAndPushToGlobalRepo = require("../autoCommit/commitAndPushToGlobalRepo");
const commitAndPushToProjectRepo = require("../autoCommit/commitAndPushToProjectRepo");
const formatGRepoLogs = require("../../pkg/formats/formatGRepoLogs");
const formatPRepoLogs = require("../../pkg/formats/formatPRepoLogs");
/**
 * Creates a README log file in the project history folder and Global Repo.
 * @param {string} currentProjectPath - Path to the local root folder.
 * @param {string} projectHistoryPath - Path to the project history folder.
 * @param {int} duration - User selected time duration.
 */
async function createReadmeLogs(
  context,
  currentProjectPath,
  projectHistoryPath,
  duration,
  remoteAddress
) {
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
      "No new changes detected, Skipped log creation."
    );
    return;
  }
  writeFileSync(lastChangesFile, changes);

  // format the log content for the project repo
  const pRepoLogContent = formatPRepoLogs(changes, date, startTime, endTime);
  // format the log content for the global repo
  const gRepoLogContent = formatGRepoLogs(
    remoteAddress,
    changes,
    date,
    startTime,
    endTime
  );

  try {
    writeFileSync(filePath, pRepoLogContent);
    // Auto-committing the logs into the project repository
    commitAndPushToProjectRepo(context, currentProjectPath, [
      filePath,
      lastChangesFile,
    ]);
    // Auto-committing the logs into the global repository
    await commitAndPushToGlobalRepo(context, fileName, gRepoLogContent);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create log file: ${error.message}`
    );
  }
}

module.exports = createReadmeLogs;
