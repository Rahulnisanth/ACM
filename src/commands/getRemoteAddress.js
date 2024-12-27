const { execSync } = require("child_process");

function getRemoteAddress(folderPath) {
  try {
    return execSync("git remote get-url origin", { cwd: folderPath })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

module.exports = getRemoteAddress;
