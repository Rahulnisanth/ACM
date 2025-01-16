function formatDate(date) {
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

module.exports = formatDate;
