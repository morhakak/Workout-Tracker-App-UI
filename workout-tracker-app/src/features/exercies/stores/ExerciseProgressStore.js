import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "../../users/stores/authStore.js";
import axios from "axios";
import { useApiErrorStore } from "../../../stores/apiErrorStore.js";

export const useExercisesProgress = defineStore(
  "exercisesProgressStore",
  () => {
    const exercisesHistory = ref([]);
    const { token } = storeToRefs(useAuthStore());
    const apiErrorStore = useApiErrorStore();
    const BASE_URL = `${import.meta.env.VITE_BASE_URL}/exercise-history`;
    const isLoading = ref(false);
    const hasFetchedOne = ref(false);
    const hasFetchedAll = ref(false);
    const currentExerciseHistory = ref(null);

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
        hasFetchedAll.value = true;
      } catch (error) {
        apiErrorStore.handleErrorResponse(error);
      } finally {
        isLoading.value = false;
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
        hasFetchedOne.value = true;
        currentExerciseHistory.value = { ...existingExercise };
      } catch (error) {
        apiErrorStore.handleErrorResponse(error);
      } finally {
        isLoading.value = false;
      }
    };

    const volumeDiff = (exerciseToFetch) => {
      const exercise = exercisesHistory.value.find(
        (ex) => ex._id === exerciseToFetch
      );

      if (!exercise || exercise.sessions.length < 2) return 0;

      const { volume: lastVolume } =
        exercise.sessions[exercise.sessions.length - 1];
      const { volume: prevVolume } =
        exercise.sessions[exercise.sessions.length - 2];

      return lastVolume - prevVolume;
    };

    return {
      fetchExercisesHistory,
      fetchExerciseHistory,
      exercisesHistory,
      isLoading,
      volumeDiff,
      hasFetchedAll,
      hasFetchedOne,
      currentExerciseHistory,
    };
  }
);
