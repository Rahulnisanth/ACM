const vscode = require("vscode");
const checkGitStatus = require("./cmd/checkGitStatus");

function activate(context) {
  const checkGitStatusCommand = vscode.commands.registerCommand(
    "extension.checkGitStatus",
    async () => {
      await checkGitStatus();
    }
  );
  // Triggered every-time when a new window is opened
  // or workspace is restarted
  checkGitStatus();
  context.subscriptions.push(checkGitStatusCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
