// formatTime is a formatting function that is used to format the time in a readable format.
function formatTime(date) {
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedTime;
}

module.exports = formatTime;
