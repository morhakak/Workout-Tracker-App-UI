<template>
  <h1 class="text-center mb-4 text-3xl font-semibold">
    {{ currentExerciseHistory?.exerciseId }}
  </h1>
  <v-container class="flex flex-col-reverse xl:flex-row justify-center gap-10">
    <div class="flex justify-center">
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
            indeterminate
          ></v-progress-circular>
          <v-timeline
            v-if="!isLoading"
            side="end"
            truncate-line="both"
            class="pb-4"
          >
            <ExerciseTimelineItem
              v-for="session in currentExerciseHistory?.sessions"
              :key="currentExerciseHistory?._id"
              :session="session"
            />
          </v-timeline>
        </v-container>
      </v-card>
    </div>
    <div class="flex justify-center">
      <v-card
        icon="mdi-medal-outline"
        class="flex flex-col items-center rounded-xl px-4 justify-start h-min"
      >
        <v-card-title class="flex items-center justify-center">
          <h2 class="font-semibold text-2xl pt-6 pb-2">
            <v-icon>mdi-medal-outline</v-icon>Records
          </h2>
        </v-card-title>
        <v-container
          class="grid grid-cols-1 px880:grid-cols-2 xl:grid-cols-1 items-center justify-center gap-4 mb-8"
        >
          <RecordCard
            v-for="record in records"
            :key="record"
            :icon="record.icon"
            :recordType="record.recordType"
            :workoutId="record.workoutId"
            :workoutName="record.workoutName"
            :value="record.value"
            :unit="record.unit"
            :isLoading="isLoading || !currentExerciseHistory"
          />
        </v-container>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import { storeToRefs } from "pinia";
import RecordCard from "../components/RecordCard.vue";
import ExerciseTimelineItem from "../components/ExerciseTimelineItem.vue";

const route = useRoute();
const exerciseId = ref(null);
exerciseId.value = route.params.id;
const progressStore = useExercisesProgress();
const { isLoading, hasFetchedOne, currentExerciseHistory } =
  storeToRefs(progressStore);
// const existingExercise = ref(null);

onMounted(async () => {
  // if (exerciseId.value && !hasFetchedOne.value)
  await progressStore.fetchExerciseHistory(exerciseId.value);
});

const records = computed(() => [
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Weight",
    workout: currentExerciseHistory.value?.maxWeight,
    workoutId: currentExerciseHistory.value?.maxWeight.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxWeight.workout.workoutName,
    value: currentExerciseHistory.value?.maxWeight.value,
    unit: true,
  },
  {
    icon: "mdi-counter",
    recordType: "Max Reps",
    workout: currentExerciseHistory.value?.maxReps,
    workoutId: currentExerciseHistory.value?.maxReps.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxReps.workout.workoutName,
    value: currentExerciseHistory.value?.maxReps.value,
    unit: false,
  },
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Volume",
    workout: currentExerciseHistory.value?.maxVolume,
    workoutId: currentExerciseHistory.value?.maxVolume.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxVolume.workout.workoutName,
    value: currentExerciseHistory.value?.maxVolume.value,
    unit: true,
  },
  {
    icon: "mdi-numeric-1-box-outline",
    recordType: "1RM",
    workout: currentExerciseHistory.value?.oneRepMax,
    workoutId: currentExerciseHistory.value?.oneRepMax.workout.workoutId,
    workoutName: currentExerciseHistory.value?.oneRepMax.workout.workoutName,
    value: currentExerciseHistory.value?.oneRepMax.value,
    unit: true,
  },
]);
</script>
