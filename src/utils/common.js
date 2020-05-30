import moment from "moment";

export const timeDisplay = (date) => {
  return moment(date).format(`HH:mm`);
};
