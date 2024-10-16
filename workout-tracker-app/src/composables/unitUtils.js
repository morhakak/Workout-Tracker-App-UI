import { computed } from "vue";
import { useAppSettingsStore } from "../stores/appSettingsStore";
import { storeToRefs } from "pinia";

const { preferredUnit } = storeToRefs(useAppSettingsStore());

export function useWeightIcon() {
  return computed(() => {
    return preferredUnit.value === "metric"
      ? "mdi-weight-kilogram"
      : "mdi-weight-pound";
  });
}

export function useWeightSuffix() {
  return computed(() => {
    return preferredUnit.value === "metric" ? "kg" : "lbs";
  });
}
