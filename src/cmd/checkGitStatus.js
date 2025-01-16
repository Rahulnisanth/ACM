const vscode = require("vscode");
const { execSync } = require("child_process");
const checkHistoryFolder = require("./checkHistoryFolder");
const getRemoteAddress = require("../pkg/common/getRemoteAddress");
const getWorkspacePath = require("../pkg/common/getWorkspacePath");
const startProjectTracking = require("../features/projectTracking/startProjectTracking");
const connectGitRepo = require("../features/projectTracking/connectGitRepo");

// Entry point of the extension
async function checkGitStatus() {
  const folderPath = await getWorkspacePath();
  // Edge case: No folder is opened on vs-code
  if (!folderPath) {
    vscode.window.showInformationMessage("No workspace folder is open.");
    return;
  }
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: folderPath });
    // Get the git remote address
    const remoteAddress = getRemoteAddress(folderPath);
    if (remoteAddress) {
      // if Git Remote Found ??
      // Check for the history tracking folder
      const hasProjectHistoryFolder = await checkHistoryFolder(folderPath);
      if (!hasProjectHistoryFolder) {
        // Ask permission from user to create `project-history` folder
        const startTracking = await vscode.window.showInformationMessage(
          "Would you like to track the logs for the project?",
          "Yes",
          "No"
        );
        if (startTracking === "Yes") {
          // if user permits ??
          // Handle automated log tracking
          startProjectTracking(folderPath);
          vscode.window.showInformationMessage("Started tracking logs..");
        } else {
          // if user not permits ??
          // End
          vscode.window.showInformationMessage("Tracking logs declined.");
        }
      } else {
        // if `project-folder` already exists
        // Handle automated log tracking
        startProjectTracking(folderPath);
      }
    } else {
      // if Git Remote not found ??
      // Connect project to Git Remote
      await connectGitRepo();
    }
  } catch (error) {
    console.error("Error in checkGitStatus:", error);
    await connectGitRepo();
  }
}

module.exports = checkGitStatus;
