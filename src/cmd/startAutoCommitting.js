const vscode = require("vscode");
const { execSync } = require("child_process");
const checkHistoryFolder = require("./checkHistoryFolder");
const getRemoteAddress = require("../pkg/common/getRemoteAddress");
const getWorkspacePath = require("../pkg/common/getWorkspacePath");
const startProjectTracking = require("../features/projectTracking/startProjectTracking");
const connectGitRepo = require("../features/projectTracking/connectGitRepo");
const showTimeDurationSelector = require("./showTimeDurationSelector");
const createGlobalRepoIfNotExists = require("../features/createGRepo/createGlobalRepoIfNotExists");
/**
 * Initializes the process of auto-committing the project.
 */
async function startAutoCommitting(context) {
  const folderPath = await getWorkspacePath();
  // Get the time duration for auto-committing
  const duration = await showTimeDurationSelector();
  // Check if the workspace folder is opened
  if (!folderPath) {
    vscode.window.showInformationMessage(
      "No workspace folder is opened for auto-committing."
    );
    return;
  }
  try {
    execSync("git rev-parse --is-inside-work-tree", { cwd: folderPath });
    // Check if the project is connected to a Git remote
    const remoteAddress = getRemoteAddress(folderPath);
    if (remoteAddress) {
      // Create a global repository if it doesn't exist
      await createGlobalRepoIfNotExists(context);
      // Check if the project history folder exists
      const hasProjectHistoryFolder = await checkHistoryFolder();
      if (!hasProjectHistoryFolder) {
        // if `project-folder` doesn't exists
        const startTracking = await vscode.window.showInformationMessage(
          "Would you like to track the logs for the project?",
          "Yes",
          "No"
        );
        if (startTracking === "Yes") {
          // Start
          await startProjectTracking(
            context,
            folderPath,
            duration,
            remoteAddress
          );
          vscode.window.showInformationMessage("Started tracking logs..");
        } else {
          // Decline
          vscode.window.showInformationMessage("Tracking logs declined.");
        }
      } else {
        // if `project-folder` exists
        await startProjectTracking(
          context,
          folderPath,
          duration,
          remoteAddress
        );
      }
    } else {
      // Connect the project to a Git remote
      await connectGitRepo();
    }
  } catch (error) {
    console.error("Error while Auto-Committing:", error);
    await connectGitRepo();
    vscode.window.showErrorMessage("Error occurred. Please try again.");
  }
}

module.exports = startAutoCommitting;
