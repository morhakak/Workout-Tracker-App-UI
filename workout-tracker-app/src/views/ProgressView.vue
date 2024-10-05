<template>
  <div class="w-full pb-6 pt-6">
    <div class="d-flex flex-column align-center ga-5" v-if="user">
      <v-btn
        v-if="!isLoading"
        color="rgba(255, 255,255, 0.5)"
        width="350"
        height="120"
        class="border-dashed border-2 border-black"
        rounded="xl"
        to="/create-workout"
        flat
      >
        <div class="flex flex-col items-center gap-2">
          <span>Create a workout</span>
          <v-icon size="x-large">mdi-plus</v-icon>
        </div>
      </v-btn>
      <v-skeleton-loader
        v-if="isLoading"
        class="rounded-xl mt-6 border-2"
        width="350"
        height="120"
      >
      </v-skeleton-loader>
      <transition-group name="fade" tag="div" mode="out-in">
        <div
          key="key"
          class="grid grid-cols-1 gridBpMobile:grid-cols-2 gridBpLaptop:grid-cols-3 items-center gap-4"
        >
          <ExerciseProgressCard
            v-if="!isLoading"
            v-for="exercise in exercisesHistory"
            :isLoading="isLoading"
            :key="exercise._id"
            :exerciseHistory="exercise"
          />
          <v-skeleton-loader
            v-if="exercisesHistory.length > 0 && isLoading"
            v-for="n in exercisesHistory.length"
            :key="'skeleton-' + n"
            class="rounded-xl"
            width="350"
            height="120"
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

const snackbarColor = computed(() => {
  if (messages.value.length > 0) {
    return messages.value[0].type == "success" ? "green" : "red";
  }
});
</script>
