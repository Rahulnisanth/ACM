const { execSync } = require("child_process");
/**
 * Get the remote address of the Git repository.
 * @param {string} folderPath - Path to the folder.
 * @returns {string} - Remote address of the Git repository.
 */
function getRemoteAddress(folderPath) {
  try {
    return execSync("git remote get-url origin", { cwd: folderPath })
      .toString()
      .trim();
  } catch (err) {
    console.log("Error capturing the remote address: ", err);
    return null;
  }
}

module.exports = getRemoteAddress;
