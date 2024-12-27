const vscode = require("vscode");
const { execSync } = require("child_process");
const checkProjectHistoryFolder = require("./checkProjectHistoryFolder");
const createProjectHistoryFolder = require("../utils/createProjectHistoryFolder");
const getRemoteAddress = require("./getRemoteAddress");
const promptCreateRepository = require("../utils/promptCreateRepository");
const getCurrentFolderPath = require("../utils/getCurrentFolderPath");

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
        const createProjectHistory = await vscode.window.showInformationMessage(
          "Would you like to track the logs for the project?",
          "Yes",
          "No"
        );
        if (createProjectHistory === "Yes") {
          createProjectHistoryFolder(folderPath);
        } else {
          vscode.window.showInformationMessage("Tracking logs declined.");
        }
      }
    } else {
      await promptCreateRepository();
    }
  } catch (error) {
    console.error("Error in checkGitStatus:", error);
    await promptCreateRepository();
  }
}

module.exports = checkGitStatus;
