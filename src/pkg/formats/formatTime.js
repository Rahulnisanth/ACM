/**
 * Formats the Time to this format `11:00 PM/AM`
 * @param {Date} - date
 * @param {string} returns - formattedTime
 */
function formatTime(date) {
  const formattedTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedTime;
}

module.exports = formatTime;
