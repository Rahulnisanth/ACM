const vscode = require("vscode");
const startAutoCommitting = require("./cmd/startAutoCommitting");
const showTimeDurationSelector = require("./cmd/showTimeDurationSelector");
const getWorkspacePath = require("./pkg/common/getWorkspacePath");
const startProjectTracking = require("./features/projectTracking/startProjectTracking");

function activate(context) {
  console.log("✅ Auto Commit Mate extension activated!");
  // Prompt user on VS Code startup
  vscode.window
    .showInformationMessage(
      "🔄 Ready to supercharge your project? Do you want to start the auto-committing process?",
      "Yes, let's go",
      "Not now"
    )
    .then(async (selection) => {
      if (selection === "Yes, let's go") {
        await startAutoCommitting(context);
      } else {
        vscode.window.showInformationMessage(
          "You can start auto-committing anytime by running the 'Start Auto-Committing' command."
        );
      }
    });

  // startAutoCommitting command
  const startExtension = vscode.commands.registerCommand(
    "extension.startAutoCommitting",
    async () => {
      await startAutoCommitting(context);
    }
  );

  // setTimeDuration command
  const setTimeDurationCommand = vscode.commands.registerCommand(
    "extension.setTimeDuration",
    async () => {
      const duration = await showTimeDurationSelector();
      if (duration) {
        const folderPath = await getWorkspacePath(context);
        if (folderPath) {
          await startProjectTracking(context, folderPath, duration);
        }
      }
    }
  );

  // Registering the commands
  context.subscriptions.push(startExtension);
  context.subscriptions.push(setTimeDurationCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
