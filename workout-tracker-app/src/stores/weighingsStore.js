import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";
import { useAppSettingsStore } from "./appSettingsStore.js";
import { convertKgToLbs } from "../utils/conversions.js";

export const useWeighingsStore = defineStore("weighingsStore", () => {
  const weighings = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
  const isFetching = ref(false);
  const isAdding = ref(false);
  const isLoading = ref(false);
  const { preferredUnit } = storeToRefs(useAppSettingsStore());

  const addWeight = async ({ weight }) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    try {
      const response = await axios.post(
        `${MEASUREMENTS_URL}/weight`,
        { weight, unit },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      measurements.value = response.data.data;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isAdding.value = false;
      }, 1000);
    }
  };

  const fetchWeighings = async () => {
    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(`${MEASUREMENTS_URL}/weight`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      weighings.value = response.data.data;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isFetching.value = false;
      }, 1000);
    }
  };

  const deleteWeighing = async (id) => {
    isLoading.value = true;
    apiErrorStore.resetMessages();
    try {
      await axios.delete(`${MEASUREMENTS_URL}/weight/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      weighings.value = weighings.value.filter((w) => w._id !== id);
      return true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const normalizedWeighings = computed(() => {
    if (preferredUnit.value === "imperial") {
      return weighings.value.map((w) => ({
        ...w,
        value: convertKgToLbs(w.value).toFixed(1),
      }));
    }
    return weighings.value.map((w) => ({ ...w, value: w.value.toFixed(1) }));
  });

  return {
    fetchWeighings,
    normalizedWeighings,
    addWeight,
    deleteWeighing,
    isFetching,
    isLoading,
    isAdding,
  };
});
