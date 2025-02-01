// Purpose: Format the repo-name, changes, date, start time, and end time into a readable format for the README.md file.
function formatGRepoLogs(remoteAddress, changes, date, startTime, endTime) {
  const changesArray = changes.trim().split("\n");
  const sanitizedRemoteAddress = remoteAddress.replace(
    /https:\/\/github.com\//,
    ""
  );
  const totalSummary = changesArray.pop();

  const logContent = `
# Logs for the Repository: ${sanitizedRemoteAddress}

## Date: ${date}

## Time: ${startTime} to ${endTime}

### Changes:
${changesArray.map((change) => `- ${change}`).join("\n")}

### Summary:
${totalSummary}
`;

  return logContent.trim();
}

module.exports = formatGRepoLogs;
