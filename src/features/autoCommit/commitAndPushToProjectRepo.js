const { execSync } = require("child_process");
const vscode = require("vscode");
/**
 * Commits the changes and pushes them to the GitHub repository.
 * @param {string} repoPath - Path to the local root folder.
 * @param {Array} files - List of files to be committed.
 */
function commitAndPushToProjectRepo(context, repoPath, files) {
  try {
    files.forEach((file) => {
      execSync(`git add "${file}"`, { cwd: repoPath });
    });

    const commitMessage = "chore: update README logs and cached changes";
    execSync(`git commit -m "${commitMessage}"`, { cwd: repoPath });

    execSync("git push", { cwd: repoPath });
  } catch (error) {
    vscode.window.showErrorMessage(
      `⚠️ Failed to push logs to GitHub: ${error.message}`
    );
  }
}

module.exports = commitAndPushToProjectRepo;
