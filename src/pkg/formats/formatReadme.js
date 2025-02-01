// Purpose: Format the changes, date, start time, and end time into a readable format for the README.md file.
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
