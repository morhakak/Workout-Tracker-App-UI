import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useAuthStore } from "../../users/stores/authStore.js";
import axios from "axios";
import { useApiErrorStore } from "../../../stores/apiErrorStore.js";
import { convertCmToInches } from "../../../utils/conversions.js";
import { useAppSettingsStore } from "../../../stores/appSettingsStore.js";

export const useMeasurementsStore = defineStore("measurementsStore", () => {
  const measurements = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/measurements`;
  const isLoading = ref(false);
  const isFetching = ref(false);
  const isAdding = ref(false);
  const { preferredUnit } = storeToRefs(useAppSettingsStore());
  const circumferenceToUpdate = ref(null);
  const hasFetched = ref(false);

  //Pagination
  const currentPage = ref(1);
  const hasMoreData = ref(true);
  const totalPages = ref(0);
  const limit = 2;

  const fetchMeasurements = async () => {
    if (isFetching.value || !hasMoreData.value) return;

    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(
        `${BASE_URL}/circumferences?page=${currentPage.value}&limit=${limit}`,
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

      hasFetched.value = true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      isFetching.value = false;
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
      isLoading.value = false;
    }
  };

  const addMeasurement = async (measurement) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    try {
      const response = await axios.post(
        `${BASE_URL}/circumferences`,
        measurement,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      return response.data.success;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCircumference = async (circumference) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    if (!circumference || !circumference._id) {
      apiErrorStore.addErrorMessage("Invalid circumference data.");
      isAdding.value = false;
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/circumferences/${circumference._id}`,
        { circumference, unit },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      const index = measurements.value.findIndex(
        (m) => m._id === circumference._id
      );
      if (index !== -1) {
        measurements.value[index] = response.data.data;
      }

      return response.data.success;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isAdding.value = false;
    }
  };

  const deleteCircumference = async (id) => {
    isLoading.value = true;
    apiErrorStore.resetMessages();
    try {
      await axios.delete(`${BASE_URL}/circumferences/${id}`, {
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
    updateCircumference,
    deleteCircumference,
    normalizedCircumference,
    isLoading,
    isFetching,
    isAdding,
    hasMoreData,
    circumferenceToUpdate,
    hasFetched,
  };
});
