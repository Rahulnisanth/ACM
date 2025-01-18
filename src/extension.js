const vscode = require("vscode");
const startAutoCommitting = require("./cmd/startAutoCommitting");
const showTimeDurationSelector = require("./cmd/showTimeDurationSelector");
const getWorkspacePath = require("./pkg/common/getWorkspacePath");
const startProjectTracking = require("./features/projectTracking/startProjectTracking");

function activate(context) {
  const startExtension = vscode.commands.registerCommand(
    "extension.startAutoCommitting",
    async () => {
      await startAutoCommitting();
    }
  );

  const setTimeDurationCommand = vscode.commands.registerCommand(
    "extension.setTimeDuration",
    async () => {
      const duration = await showTimeDurationSelector();
      if (duration) {
        const folderPath = await getWorkspacePath();
        if (folderPath) {
          startProjectTracking(folderPath, duration * 60 * 1000);
        }
      }
    }
  );

  context.subscriptions.push(startExtension);
  context.subscriptions.push(setTimeDurationCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
