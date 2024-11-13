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
  const MEASUREMENTS_URL = import.meta.env.VITE_MEASUREMENTS_BASE_URL;
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

      hasFetched.value = true;
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

  const updateCircumference = async (circumference) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    if (!circumference || !circumference._id) {
      console.log("Invalid circumference object", circumference);
      apiErrorStore.addErrorMessage("Invalid circumference data.");
      isAdding.value = false;
      return;
    }

    console.log("Updating circumference with ID", circumference._id);

    try {
      const response = await axios.put(
        `${MEASUREMENTS_URL}/circumferences/${circumference._id}`,
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

  watch(normalizedCircumference, () => {
    console.log("norm", normalizedCircumference.value);
  });

  watch(measurements, () => {
    console.log("measurements", measurements.value);
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
