<template>
  <div class="w-full py-6">
    <div class="flex flex-col align-center ga-5" v-if="user">
      <h1 class="text-3xl font-semibold text-center">Track Your Progress</h1>

      <div
        class="grid grid-cols-1 mt-8 px708:grid-cols-2 px1362:grid-cols-3 items-center gap-4 overflow-x-hidden pb-4 px-3"
      >
        <div v-for="exercise in validExeHistory">
          <ExerciseProgressCard
            v-if="!isLoading"
            :isLoading="isLoading"
            :key="exercise._id"
            :exerciseHistory="exercise"
          />
          <v-skeleton-loader
            v-if="validExeHistory.length > 0 && isLoading"
            :key="'skeleton-' + exercise._id"
            class="rounded-xl"
            width="350"
            height="150"
          >
          </v-skeleton-loader>
        </div>
      </div>
    </div>
    <v-snackbar
      :color="snackbarColor"
      rounded="lg"
      :modelValue="messages.length > 0"
    >
      <p>{{ messages[0]?.message }}</p>
    </v-snackbar>
    <v-alert
      v-if="messages.length > 0"
      icon="mdi-alert-circle"
      rounded="lg"
      type="error"
      variant="elevated"
    >
      <p class="text-center">{{ messages[0].message }}</p>
    </v-alert>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../../users/stores/authStore";
import { storeToRefs } from "pinia";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import { useApiErrorStore } from "../../../stores/apiErrorStore";
import ExerciseProgressCard from "../components/ExerciseProgressCard.vue";

const { user } = storeToRefs(useAuthStore());
const exercisesProgress = useExercisesProgress();
const { exercisesHistory, isLoading, hasFetchedAll } =
  storeToRefs(exercisesProgress);
const { messages } = storeToRefs(useApiErrorStore());

onMounted(async () => {
  if (!hasFetchedAll.value) await exercisesProgress.fetchExercisesHistory();
});

const validExeHistory = computed(() => {
  return exercisesHistory.value.filter((exe) => exe.sessions.length > 0);
});

const snackbarColor = computed(() => {
  if (messages.value.length > 0) {
    return messages.value[0].type == "success" ? "green" : "red";
  }
});
</script>
