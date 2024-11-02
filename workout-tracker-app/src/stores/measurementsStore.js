import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";
import { convertCmToInches } from "../utils/conversions.js";
import { useAppSettingsStore } from "./appSettingsStore.js";

export const useMeasurementsStore = defineStore("measurementsStore", () => {
  const measurements = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
  const isLoading = ref(false);
  const isFetching = ref(false);
  const isAdding = ref(false);
  const { preferredUnit } = storeToRefs(useAppSettingsStore());

  const fetchMeasurements = async () => {
    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(`${MEASUREMENTS_URL}/circumference`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      measurements.value = response.data.data.sortedCircumference;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isFetching.value = false;
      }, 1000);
    }
  };

  const addHeight = async ({ height }) => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.post(
        `${BASE_URL}/height`,
        { height },
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
        isLoading.value = false;
      }, 1000);
    }
  };

  const addMeasurement = async (measurement) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    try {
      const response = await axios.post(
        `${MEASUREMENTS_URL}/circumference`,
        measurement,
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

  const deleteCircumference = async (id) => {
    isLoading.value = true;
    apiErrorStore.resetMessages();
    try {
      await axios.delete(`${MEASUREMENTS_URL}/circumference/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      measurements.value = measurements.value.filter((m) => m._id !== id);
      return true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const normalizedCircumference = computed(() => {
    if (!measurements.value) {
      return [];
    }

    return measurements.value?.map((entry) => {
      const formattedEntry = {};

      Object.keys(entry).forEach((key) => {
        if (typeof entry[key] === "number") {
          formattedEntry[key] =
            preferredUnit.value === "imperial"
              ? convertCmToInches(entry[key]).toFixed(1)
              : entry[key].toFixed(1);
        } else {
          formattedEntry[key] = entry[key];
        }
      });

      return formattedEntry;
    });
  });

  return {
    fetchMeasurements,
    addHeight,
    addMeasurement,
    deleteCircumference,
    normalizedCircumference,
    isLoading,
    isFetching,
    isAdding,
  };
});
