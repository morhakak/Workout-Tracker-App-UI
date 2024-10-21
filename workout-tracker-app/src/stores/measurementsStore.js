import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";

export const useMeasurementsStore = defineStore("measurementsStore", () => {
  const measurements = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
  const isLoading = ref(false);

  const fetchMeasurements = async () => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.get(`${BASE_URL}/height-weight`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      measurements.value = response.data.data;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isLoading.value = false;
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
    isLoading.value = true;
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
        isLoading.value = false;
      }, 1000);
    }
  };

  return {
    fetchMeasurements,
    addHeight,
    addMeasurement,
    measurements,
    isLoading,
  };
});
