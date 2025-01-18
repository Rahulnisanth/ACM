/**
 * Formats the Date to this format `18 Jan 2025`
 * @param {Date} - date
 * @param {string} returns - formattedDate
 */
function formatDate(date) {
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

module.exports = formatDate;
