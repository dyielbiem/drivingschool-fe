import moment from "moment";
import { parseDate } from "chrono-node";

export const formatDate = (strDate, format = "MM/DD/YYYY") => {
  const parsedDate = parseDate(strDate);
  const formattedDate = parsedDate ? moment(parsedDate).format(format) : null;
  return formattedDate;
};
