<template>
  <div class="w-full pb-6 pt-6">
    <div class="flex flex-col align-center ga-5" v-if="user">
      <h1 class="text-3xl font-semibold mb-8">Track Your Progress</h1>
      <transition-group name="fade" tag="div" mode="out-in">
        <div
          key="key"
          class="grid grid-cols-1 px708:grid-cols-2 px1362:grid-cols-3 items-center gap-4"
        >
          <ExerciseProgressCard
            v-if="!isLoading"
            v-for="exercise in validExeHistory"
            :isLoading="isLoading"
            :key="exercise._id"
            :exerciseHistory="exercise"
          />
          <v-skeleton-loader
            v-if="validExeHistory.length > 0 && isLoading"
            v-for="n in validExeHistory.length"
            :key="'skeleton-' + n"
            class="rounded-xl"
            width="350"
            height="150"
          >
          </v-skeleton-loader>
        </div>
      </transition-group>
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
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import { useApiErrorStore } from "../stores/apiErrorStore";
import ExerciseProgressCard from "../components/workouts/ExerciseProgressCard.vue";

const { user } = storeToRefs(useAuthStore());
const exercisesProgress = useExercisesProgress();
const { exercisesHistory, isLoading } = storeToRefs(exercisesProgress);
const { messages } = storeToRefs(useApiErrorStore());

onMounted(async () => {
  await exercisesProgress.fetchExercisesHistory();
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
