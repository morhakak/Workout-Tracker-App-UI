import moment from "moment";

export function useDateFormatter() {
  const toLocalDate = (utcDate) => {
    return moment(utcDate).local().format("DD/MM/YYYY, dddd, HH:mm:ss");
  };

  return {
    toLocalDate,
  };
}
