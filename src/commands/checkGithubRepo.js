/* eslint-disable no-unused-vars */
const vscode = require("vscode");

async function checkGithubRepo() {
  try {
    const gitExtension = vscode.extensions.getExtension("vscode.git").exports;
    const git = gitExtension.getAPI(1);

    if (!git.repositories.length) {
      return { isRepo: false, message: "Not a git repository" };
    }

    const repo = git.repositories[0];
    const remotes = await repo.state.remotes;

    if (!remotes.length) {
      return { isRepo: false, message: "No remote repositories configured" };
    }

    const githubRemote = remotes.find(
      (remote) =>
        remote.fetchUrl?.includes("github.com") ||
        remote.pushUrl?.includes("github.com")
    );

    if (!githubRemote) {
      return { isRepo: false, message: "No GitHub remote found" };
    }

    return {
      isRepo: true,
      message: "GitHub repository found",
      remote: githubRemote,
    };
  } catch (err) {
    return { isRepo: false, message: "Error checking repository status" };
  }
}

module.exports = { checkGithubRepo };
