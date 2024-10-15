import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import axios from "axios";
import { useTheme } from "vuetify";

export const useAppSettingsStore = defineStore("appSettingsStore", () => {
  const THEME = "theme";
  const PREFERRED_UNIT = "preferredUnit";
  const usedTheme = useTheme();

  const theme = ref(localStorage.getItem(THEME) || "light");
  const preferredUnit = ref(localStorage.getItem(PREFERRED_UNIT) || "metric");

  const getThemeFromLocalStorage = () => {
    theme.value(localStorage.getItem(THEME));
  };

  const getPreferredUnitFromLocalStorage = () => {
    preferredUnit.value(localStorage.getItem(PREFERRED_UNIT));
  };

  watch(theme, () => {
    localStorage.setItem(THEME, theme.value);
    usedTheme.global.name.value = theme.value;
  });
  watch(preferredUnit, () =>
    localStorage.setItem(PREFERRED_UNIT, preferredUnit.value)
  );

  return {
    theme,
    preferredUnit,
    getThemeFromLocalStorage,
    getPreferredUnitFromLocalStorage,
  };
});
