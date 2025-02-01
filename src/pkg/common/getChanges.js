const { execSync } = require("child_process");
/**
 * Get the changes in the source code.
 * @param {string} currentProjectPath - Path to the current project.
 * @returns {string} - Changes in the source code.
 */
function getChanges(currentProjectPath) {
  try {
    const gitDiff = execSync("git diff --stat", {
      cwd: currentProjectPath,
    })
      .toString()
      .trim();

    const gitDiffStaged = execSync("git diff --cached --stat", {
      cwd: currentProjectPath,
    })
      .toString()
      .trim();

    return gitDiff || gitDiffStaged || "No changes detected";
  } catch (err) {
    console.error("Error occurred while executing git diff commands:", err);
    return "Error detected in getting source changes";
  }
}

module.exports = getChanges;
