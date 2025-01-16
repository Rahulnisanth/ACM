const { execSync } = require("child_process");

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
