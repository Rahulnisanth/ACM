const { execSync } = require("child_process");

function getSourceChanges(currentProjectPath) {
  try {
    const gitOutput = execSync("git status --short", {
      cwd: currentProjectPath,
    }).toString();
    return gitOutput ? gitOutput : "No changes detected";
  } catch (err) {
    console.log("Error occurred while executing git status cmds: ", err);
    return "Error detected in getting source changes";
  }
}

module.exports = getSourceChanges;
