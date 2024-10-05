import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useApiErrorStore } from "./apiErrorStore.js";

export const useExercisesProgress = defineStore(
  "exercisesProgressStore",
  () => {
    const exercisesHistory = ref([]);
    const { token, user } = storeToRefs(useAuthStore());
    const apiErrorStore = useApiErrorStore();
    const BASE_URL = import.meta.env.VITE_EXERCISE_HISTORY_BASE_URL;
    const isLoading = ref(false);

    const fetchExercisesHistory = async () => {
      apiErrorStore.resetMessages();
      isLoading.value = true;
      try {
        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        exercisesHistory.value = response.data.data;
        console.log(exercisesHistory.value);
      } catch (error) {
        apiErrorStore.handleErrorResponse(error);
      } finally {
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }
    };

    const fetchExerciseHistory = async (id) => {
      apiErrorStore.resetMessages();
      isLoading.value = true;
      try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        const existingExercise = response.data.data;
        return existingExercise;
      } catch (error) {
        apiErrorStore.handleErrorResponse(error);
      } finally {
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }
    };

    return {
      fetchExercisesHistory,
      fetchExerciseHistory,
      exercisesHistory,
      isLoading,
    };
  }
);
