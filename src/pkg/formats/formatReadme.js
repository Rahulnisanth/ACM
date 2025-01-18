/**
 * Formats the log contents for teh auto-generated readme file
 * @param {string[]} - Changes from the `git diff --stat` cmd
 * @param {string} - date
 * @param {string} - startTime
 * @param {string} - endTime
 */
function formatReadme(changes, date, startTime, endTime) {
  const changesArray = changes.trim().split("\n");

  const totalSummary = changesArray.pop();

  const logContent = `
**⚠️ Warning:** Avoid interacting with the \`work-logs/*\` folder and \`cache.txt\` file directly.

# Project Logs

## Date: ${date}

## Time: ${startTime} to ${endTime}

### Changes:
${changesArray.map((change) => `- ${change}`).join("\n")}

### Summary:
${totalSummary}
`;

  return logContent.trim();
}

module.exports = formatReadme;
