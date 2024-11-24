import moment from "moment";
import { computed, ref, toValue, watch } from "vue";

export function useDate(utcDate = null) {
  const date = toValue(utcDate);

  const shortMonthFullYear = computed(() => {
    return moment(date).local().format("MMM YYYY");
  });

  const fullDate = computed(() => {
    return moment(date).local().format("DD/MM/YYYY, dddd, HH:mm:ss");
  });

  const dayMonthYear = computed(() => {
    return moment(date).local().format("DD/MM/YYYY");
  });

  const time = computed(() => {
    return moment(date).local().format("HH:mm:ss");
  });

  const day = computed(() => {
    return moment(date).local().format("dddd");
  });

  function getDayMonthYear(date) {
    return moment(date).local().format("DD/MM/YYYY");
  }

  function getTime(date) {
    return moment(date).local().format("HH:mm:ss");
  }

  return {
    shortMonthFullYear,
    fullDate,
    dayMonthYear,
    time,
    day,
    getDayMonthYear,
    getTime,
  };
}
