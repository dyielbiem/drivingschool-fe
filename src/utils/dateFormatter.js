const dateFormatter = (dateString) => {
  const date = new Date(dateString);
  if (date.toString() === "Invalid Date" || !date.getTime()) return "";

  const month = `${String(date.getMonth() + 1).padStart(2, "0")}`;
  const day = `${String(date.getDate()).padStart(2, "0")}`;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export default dateFormatter;
