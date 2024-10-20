import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";

export const useMeasurementsStore = defineStore("measurementsStore", () => {
  const measurements = ref([]);
  const weighings = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
  const isLoading = ref(false);
  const isAddWeightLoading = ref(false);

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

  const addWeight = async ({ weight }) => {
    apiErrorStore.resetMessages();
    isAddWeightLoading.value = true;
    try {
      const response = await axios.post(
        `${MEASUREMENTS_URL}/weight`,
        { weight },
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
        isAddWeightLoading.value = false;
      }, 1000);
    }
  };

  const fetchWeighings = async () => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.get(`${MEASUREMENTS_URL}/weight`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      weighings.value = response.data.data;
      console.log(response.data.data);
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
    fetchWeighings,
    weighings,
    addWeight,
    addHeight,
    addMeasurement,
    measurements,
    isLoading,
    isAddWeightLoading,
  };
});
