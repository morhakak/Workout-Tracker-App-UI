import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";
import { useAppSettingsStore } from "./appSettingsStore.js";

export const useUnitUtils = defineStore("unitUtilsStore", () => {
  const { preferredUnit } = storeToRefs(useAppSettingsStore());

  const weightSuffix = computed(() => {
    return preferredUnit.value === "metric" ? "kg" : "lbs";
  });

  const lengthSuffix = computed(() => {
    return preferredUnit.value === "metric" ? "cm" : "in";
  });

  const weightIcon = computed(() => {
    return preferredUnit.value === "metric"
      ? "mdi-weight-kilogram"
      : "mdi-weight-pound";
  });
  return { weightSuffix, weightIcon, lengthSuffix };
});
