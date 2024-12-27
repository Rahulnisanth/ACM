const vscode = require("vscode");

async function promptCreateRepository() {
  const createRepo = await vscode.window.showInformationMessage(
    "This workspace is not connected to GitHub. Would you like to create a repository?",
    "Yes",
    "No"
  );
  if (createRepo === "Yes") {
    await vscode.commands.executeCommand("workbench.view.scm");
  } else {
    vscode.window.showInformationMessage("Repository creation cancelled.");
  }
}

module.exports = promptCreateRepository;
