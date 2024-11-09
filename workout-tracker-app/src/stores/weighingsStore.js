import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
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
  const weighingToUpdate = ref(null);

  //Pagination
  const currentPage = ref(1);
  const hasMoreData = ref(true);
  const totalPages = ref(0);

  const addWeighing = async ({ weight }) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    try {
      const response = await axios.post(
        `${MEASUREMENTS_URL}/weighings`,
        { weight, unit },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      weighings.value.push(response.data.data);
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isAdding.value = false;
      }, 1000);
    }
  };

  const fetchWeighings = async () => {
    if (isFetching.value || !hasMoreData.value) return;

    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(
        `${MEASUREMENTS_URL}/weighings?page=${currentPage.value}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      weighings.value.push(...response.data.data);
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

  const updateWeighing = async (weighing) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    if (!weighing || !weighing.weight) {
      console.log("You sent invalid weighing", weighing);
    }

    console.log("Weighing to update", weighing);

    try {
      const response = await axios.put(
        `${MEASUREMENTS_URL}/weighings/${weighing._id}`,
        { weight: weighing.weight, unit },
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

  const deleteWeighing = async (id) => {
    isLoading.value = true;
    apiErrorStore.resetMessages();
    try {
      await axios.delete(`${MEASUREMENTS_URL}/weighings/${id}`, {
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
    if (!Array.isArray(weighings.value) || weighings.value.length == 0)
      return [];

    return weighings.value.map((w) => {
      const weight =
        preferredUnit.value === "imperial"
          ? convertKgToLbs(w.weight).toFixed(1)
          : w.weight.toFixed(1);
      return { ...w, weight };
    });
  });

  return {
    fetchWeighings,
    normalizedWeighings,
    addWeighing,
    updateWeighing,
    deleteWeighing,
    isFetching,
    isLoading,
    isAdding,
    weighingToUpdate,
    hasMoreData,
  };
});
