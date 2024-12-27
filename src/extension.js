const vscode = require("vscode");
const checkGitStatus = require("./commands/checkGitStatus");

function activate(context) {
  const checkGitStatusCommand = vscode.commands.registerCommand(
    "extension.checkGitStatus",
    async () => {
      await checkGitStatus();
    }
  );
  // Triggered when a new window is opened
  checkGitStatus();
  context.subscriptions.push(checkGitStatusCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
