// This function takes a date object and returns a formatted date string in the format "DD MMM YYYY".
function formatDate(date) {
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

module.exports = formatDate;
