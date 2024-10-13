<template>
  <h1 class="text-center mb-4 text-3xl font-semibold">
    {{ existingExercise?.exerciseId }}
  </h1>
  <v-container class="flex flex-col-reverse xl:flex-row">
    <v-container class="flex justify-center">
      <v-card class="rounded-xl px-2 w-[600px]">
        <v-card-title class="flex justify-center items-center">
          <h2 class="text-center font-semibold text-2xl pt-6 pb-2">
            <v-icon>mdi-clipboard-text-clock-outline</v-icon>
            Exercise History
          </h2>
        </v-card-title>
        <v-container class="flex justify-center">
          <v-progress-circular
            v-if="isLoading"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <v-timeline v-if="!isLoading" side="end" class="pb-4">
            <ExerciseTimelineItem
              v-for="session in existingExercise?.sessions"
              :key="existingExercise?._id"
              :session="session"
            />
          </v-timeline>
        </v-container>
      </v-card>
    </v-container>
    <v-container class="flex justify-center">
      <v-card
        icon="mdi-medal-outline"
        class="flex flex-col items-center rounded-xl px-4 justify-start h-min w-max"
      >
        <v-card-title class="flex items-center justify-center">
          <h2 class="font-semibold text-2xl pt-6 pb-2">
            <v-icon>mdi-medal-outline</v-icon>Records
          </h2>
        </v-card-title>
        <v-container
          class="grid grid-cols-1 px880:grid-cols-2 xl:grid-cols-1 items-center justify-center gap-3 mb-8"
        >
          <RecordCard
            v-for="record in records"
            :key="record"
            :icon="record.icon"
            :recordType="record.recordType"
            :workoutId="record.workoutId"
            :workoutName="record.workoutName"
            :value="record.value"
            :kg="record.kg"
            :isLoading="isLoading || !existingExercise"
          />
        </v-container>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import { storeToRefs } from "pinia";
import RecordCard from "../components/workouts/RecordCard.vue";
import ExerciseTimelineItem from "../components/workouts/ExerciseTimelineItem.vue";

const route = useRoute();
const exerciseId = ref(null);
exerciseId.value = route.params.id;
const progressStore = useExercisesProgress();
const { isLoading } = storeToRefs(progressStore);
const existingExercise = ref(null);

onMounted(async () => {
  if (exerciseId.value) {
    existingExercise.value = await progressStore.fetchExerciseHistory(
      exerciseId.value
    );
  }
});

const records = computed(() => [
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Weight",
    workout: existingExercise.value?.maxWeight,
    workoutId: existingExercise.value?.maxWeight.workout.workoutId,
    workoutName: existingExercise.value?.maxWeight.workout.workoutName,
    value: existingExercise.value?.maxWeight.value,
    kg: true,
  },
  {
    icon: "mdi-counter",
    recordType: "Max Reps",
    workout: existingExercise.value?.maxReps,
    workoutId: existingExercise.value?.maxReps.workout.workoutId,
    workoutName: existingExercise.value?.maxReps.workout.workoutName,
    value: existingExercise.value?.maxReps.value,
    kg: false,
  },
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Volume",
    workout: existingExercise.value?.maxVolume,
    workoutId: existingExercise.value?.maxVolume.workout.workoutId,
    workoutName: existingExercise.value?.maxVolume.workout.workoutName,
    value: existingExercise.value?.maxVolume.value,
    kg: true,
  },
  {
    icon: "mdi-numeric-1-box-outline",
    recordType: "1RM",
    workout: existingExercise.value?.oneRepMax,
    workoutId: existingExercise.value?.oneRepMax.workout.workoutId,
    workoutName: existingExercise.value?.oneRepMax.workout.workoutName,
    value: existingExercise.value?.oneRepMax.value,
    kg: true,
  },
]);
</script>
