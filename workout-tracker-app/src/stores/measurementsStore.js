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

  //Pagination
  const currentPage = ref(1);
  const hasMoreData = ref(true);
  const totalPages = ref(0);

  const fetchMeasurements = async () => {
    if (isFetching.value || !hasMoreData.value) return;

    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(
        `${MEASUREMENTS_URL}/circumferences?page=${currentPage.value}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      measurements.value.push(...response.data.data);
      currentPage.value++;

      hasMoreData.value = currentPage.value <= response.data.meta.totalPages;
      totalPages.value = response.data.meta.totalPages;
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
        `${MEASUREMENTS_URL}/circumferences`,
        measurement,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
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
      await axios.delete(`${MEASUREMENTS_URL}/circumferences/${id}`, {
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
    if (!Array.isArray(measurements.value)) return;

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
    hasMoreData,
  };
});
