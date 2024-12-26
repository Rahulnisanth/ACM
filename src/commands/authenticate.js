const vscode = require("vscode");

async function authenticate() {
  const gitHubAccount = vscode.workspace
    .getConfiguration("git")
    .get("gitHubAccount");

  if (gitHubAccount) {
    vscode.window.showInformationMessage(
      `Using existing github account: ${gitHubAccount}`
    );
  }
  const authUrl = `https://github.com/login/oauth/authorize?client_id=Ov23liW3ULL9Lhq2N7Au&scope=repo`;
  const open = await import("open");
  await open.default(authUrl);
}

module.exports = { authenticate };
