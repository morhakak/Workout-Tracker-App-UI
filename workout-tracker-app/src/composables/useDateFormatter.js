import moment from "moment";

export function useDateFormatter() {
  const toLocalDate = (utcDate) => {
    return moment(utcDate).local().format("dddd, DD/MM/YYYY HH:mm:ss");
  };

  return {
    toLocalDate,
  };
}
