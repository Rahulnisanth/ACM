const vscode = require("vscode");
const { authenticate } = require("./commands/authenticate");
const { checkProject } = require("./commands/checkProject");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.authenticate", authenticate),
    vscode.commands.registerCommand("extension.checkProject", checkProject)
  );
  authenticate().then(() => checkProject());
}

function deactivate() {}

module.exports = { activate, deactivate };
