import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

export const useAppSettingsStore = defineStore("appSettingsStore", () => {
  const THEME = "theme";
  const PREFERRED_UNIT = "preferredUnit";
  const usedTheme = useTheme();

  const theme = ref(localStorage.getItem(THEME) || "light");
  const preferredUnit = ref(localStorage.getItem(PREFERRED_UNIT) || "metric");

  const updateLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  const setVuetifyTheme = () => {
    usedTheme.global.name.value = theme.value;
  };

  watch(theme, (newTheme) => {
    setVuetifyTheme();
    updateLocalStorage(THEME, newTheme);
  });

  watch(preferredUnit, (newUnit) => {
    updateLocalStorage(PREFERRED_UNIT, newUnit);
  });

  return {
    theme,
    preferredUnit,
    setVuetifyTheme,
  };
});
