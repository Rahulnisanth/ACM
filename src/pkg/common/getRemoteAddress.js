const { execSync } = require("child_process");
/**
 * Captures the remote address
 * @param {string} folderPath - Path to the local root folder.
 * @param {string} returns - Remote address of the passed folder if exists.
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
