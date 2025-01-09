const vscode = require("vscode");
const { execSync } = require("child_process");
const checkProjectHistoryFolder = require("./checkProjectHistoryFolder");
const getRemoteAddress = require("./getRemoteAddress");
const promptCreateRepository = require("../utils/promptCreateRepository");
const getCurrentFolderPath = require("../utils/getCurrentFolderPath");
const startProjectTracking = require("../utils/startProjectTracking");

async function checkGitStatus() {
  const folderPath = await getCurrentFolderPath();
  if (!folderPath) {
    vscode.window.showInformationMessage("No workspace folder is open.");
    return;
  }
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: folderPath });
    const remoteAddress = getRemoteAddress(folderPath);
    if (remoteAddress) {
      const hasProjectHistoryFolder = await checkProjectHistoryFolder(
        folderPath
      );
      if (!hasProjectHistoryFolder) {
        const startTracking = await vscode.window.showInformationMessage(
          "Would you like to track the logs for the project?",
          "Yes",
          "No"
        );
        if (startTracking === "Yes") {
          // TODO: Handle automated log tracking...
          startProjectTracking(folderPath);
          vscode.window.showInformationMessage("Started tracking logs..");
        } else {
          vscode.window.showInformationMessage("Tracking logs declined.");
        }
      }
      // TODO: Handle automated log tracking...
      startProjectTracking(folderPath);
    } else {
      await promptCreateRepository();
    }
  } catch (error) {
    console.error("Error in checkGitStatus:", error);
    await promptCreateRepository();
  }
}

module.exports = checkGitStatus;
