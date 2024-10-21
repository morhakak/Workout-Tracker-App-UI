import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";

export const useWeighingsStore = defineStore("weighingsStore", () => {
  const weighings = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
  const isFetching = ref(false);
  const isAdding = ref(false);

  const addWeight = async ({ weight }) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
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
      console.log(response.data.data);
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isFetching.value = false;
      }, 1000);
    }
  };

  return {
    fetchWeighings,
    weighings,
    addWeight,
    isFetching,
    isAdding,
  };
});
