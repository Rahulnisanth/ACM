const { chmodSync } = require("fs");
const { vscode } = require("vscode");

function makeReadOnly(filePath) {
  try {
    chmodSync(filePath, 0o444);
    vscode.window.showInformationMessage(
      `Successfully made ${filePath} read-only.`
    );
  } catch (error) {
    console.error(`Failed to change permissions for ${filePath}:`, error);
  }
}

module.exports = makeReadOnly;
