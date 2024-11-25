import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "../../users/stores/authStore.js";
import axios from "axios";
import { useApiErrorStore } from "../../../stores/apiErrorStore.js";
import { useAppSettingsStore } from "../../../stores/appSettingsStore.js";
import { convertKgToLbs } from "../../../utils/conversions.js";

export const useWeighingsStore = defineStore("weighingsStore", () => {
  const weighings = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const apiErrorStore = useApiErrorStore();
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/measurements`;
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
        `${BASE_URL}/weighings`,
        { weight, unit },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      weighings.value.push(response.data.data);
      return response.data.success;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isAdding.value = false;
    }
  };

  const fetchWeighings = async () => {
    if (isFetching.value || !hasMoreData.value) return;

    apiErrorStore.resetMessages();
    isFetching.value = true;
    try {
      const response = await axios.get(
        `${BASE_URL}/weighings?page=${currentPage.value}&limit=10`,
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
      isFetching.value = false;
    }
  };

  const updateWeighing = async (weighing) => {
    apiErrorStore.resetMessages();
    isAdding.value = true;
    const unit = preferredUnit.value;

    try {
      const response = await axios.put(
        `${BASE_URL}/weighings/${weighing._id}`,
        { weight: weighing.weight, unit },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      const index = weighings.value.findIndex((w) => w._id === weighing._id);
      if (index !== -1) {
        weighings.value[index] = response.data.data;
      }

      return response.data.success;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isAdding.value = false;
    }
  };

  const deleteWeighing = async (id) => {
    isLoading.value = true;
    apiErrorStore.resetMessages();
    try {
      await axios.delete(`${BASE_URL}/weighings/${id}`, {
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
