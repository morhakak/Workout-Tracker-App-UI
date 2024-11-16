import moment from "moment";
import { computed, ref } from "vue";

export function useDate(utcDate) {
  const date = ref(utcDate);
  const fullDate = computed(() => {
    return moment(date.value).local().format("DD/MM/YYYY, dddd, HH:mm:ss");
  });

  const dayMonthYear = computed(() => {
    return moment(date.value).local().format("DD/MM/YYYY");
  });

  const time = computed(() => {
    return moment(date.value).local().format("HH:mm:ss");
  });

  const day = computed(() => {
    return moment(date.value).local().format("dddd");
  });

  return {
    fullDate,
    dayMonthYear,
    time,
    day,
  };
}
