import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import exercises from "../data/index.js";
import { useAuthStore } from "./authStore.js";
import axios from "axios";
import { useWorkoutDraftStore } from "./workoutDraftStore.js";
import { useApiErrorStore } from "./apiErrorStore.js";

export const useWorkoutStore = defineStore("workoutStore", () => {
  const workouts = ref([]);
  const { token, user } = storeToRefs(useAuthStore());
  const isLoading = ref(false);
  const isLoadingWorkouts = ref(false);
  const workoutDraftStore = useWorkoutDraftStore();
  const { workoutDraft } = storeToRefs(workoutDraftStore);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const apiErrorStore = useApiErrorStore();

  const setIsLoading = (value) => {
    isLoading.value = value;
  };

  const toggleIsFavorite = async (id) => {
    apiErrorStore.resetMessages();
    workoutDraft.value.user = user.value._id;

    try {
      const response = await axios.post(
        `${BASE_URL}/${id}/toggleIsFavorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      if (response.data.success) {
        const workout = workouts.value.find((w) => w._id == id);
        workout.isFavorite = !workout.isFavorite;
      }

      workoutDraftStore.resetWorkoutDraft();
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    }
  };

  const addNewWorkout = async (workout) => {
    apiErrorStore.resetMessages();
    setIsLoading(true);

    workout = { ...workout, user: user.value._id };
    // workoutDraft.value.user = user.value._id;

    // removeDraftIds();

    try {
      const response = await axios.post(BASE_URL, workout, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      workouts.value.push(response.data);
      workoutDraftStore.resetWorkoutDraft();
      if (response.data.success) return response.data.data._id;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    setIsLoading(true);
    apiErrorStore.resetMessages();
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      workouts.value = workouts.value.filter((w) => w._id !== id);
      return true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkouts = async () => {
    apiErrorStore.resetMessages();
    isLoadingWorkouts.value = true;
    try {
      const response = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      workouts.value = response.data.data;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        isLoadingWorkouts.value = false;
      }, 1000);
    }
  };

  const getWorkout = async (id) => {
    apiErrorStore.resetMessages();
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      const existingWorkot = response.data.data;
      return existingWorkot;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const updateWorkout = async (id) => {
    removeDraftIds();
    apiErrorStore.resetMessages();
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/${id}`, workoutDraft.value, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  function removeDraftIds() {
    if (workoutDraft.value._id && workoutDraft.value._id.startsWith("_draft")) {
      delete workoutDraft.value._id;
    }

    workoutDraft.value.exercises = workoutDraft.value.exercises.map(
      (exercise) => {
        if (exercise._id && exercise._id.startsWith("_draft")) {
          delete exercise._id;
        }

        exercise.sets = exercise.sets.map((set) => {
          if (set._id && set._id.startsWith("_draft")) {
            delete set._id;
          }
          return set;
        });

        return exercise;
      }
    );
  }

  const filterExercises = (type) =>
    exercises.filter((exercise) => exercise.types.includes(`${type}`));

  return {
    workouts,
    workoutDraft,
    deleteWorkout,
    addNewWorkout,
    updateWorkout,
    filterExercises,
    loadWorkouts,
    getWorkout,
    toggleIsFavorite,
    isLoading,
    isLoadingWorkouts,
  };
});
