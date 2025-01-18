const { execSync } = require("child_process");
const vscode = require("vscode");
/**
 * Commits and pushes changes to the GitHub repository.
 * @param {string} repoPath - Path to the local Git repository.
 * @param {string[]} files - Files to be committed.
 */
function commitAndPush(repoPath, files) {
  try {
    files.forEach((file) => {
      execSync(`git add "${file}"`, { cwd: repoPath });
    });

    const commitMessage = "chore: update README logs and cached changes";
    execSync(`git commit -m "${commitMessage}"`, { cwd: repoPath });

    execSync("git push", { cwd: repoPath });

    vscode.window.showInformationMessage(
      "Changes successfully committed and pushed to GitHub."
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to push changes to GitHub: ${error.message}`
    );
  }
}

module.exports = commitAndPush;
