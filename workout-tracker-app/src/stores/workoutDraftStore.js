import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { v4 } from "uuid";
import { useAuthStore } from "./authStore";
export const useWorkoutDraftStore = defineStore("workoutDraftStore", () => {
  const { user } = storeToRefs(useAuthStore());
  const workoutDraft = ref({
    _id: ``,
    user: "",
    name: "",
    type: "",
    exercises: [],
    isFavorite: false,
  });

  const createDraft = (workoutType) => {
    workoutDraft.value = {
      _id: `_draft-${v4()}`,
      user: user.value,
      name: workoutType,
      type: workoutType.toLowerCase(),
      exercises: [],
      isFavorite: false,
    };
  };

  const setName = (name) => {
    console.log(name);
    if (name !== null && workoutDraft.value) workoutDraft.value.name = name;
  };

  const addExercise = (exerciseName) => {
    const newExercise = {
      _id: `_draft-${v4()}`,
      name: exerciseName,
      sets: [{ weight: 0, reps: 0 }],
    };
    workoutDraft.value.exercises.push(newExercise);
  };

  const removeExercise = (id) => {
    workoutDraft.value.exercises.filter((w) => w._id !== id);
  };

  const resetWorkoutDraft = () => {
    workoutDraft.value = {
      _id: `_draft-${v4()}`,
      name: "",
      exercises: [],
      isFavorite: false,
    };
  };

  return {
    workoutDraft,
    addExercise,
    setName,
    removeExercise,
    resetWorkoutDraft,
    createDraft,
  };
});
