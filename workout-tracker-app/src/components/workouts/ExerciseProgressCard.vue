<template>
  <v-card
    class="mx-auto relative"
    max-width="350"
    min-width="350"
    min-height="120"
    rounded="xl"
    hover
    color="rgba(255, 255,255, 0.8)"
    @click="openWorkout"
  >
    <template #title>
      <div class="flex items-center">
        <v-icon
          size="small"
          class="bg-black text-white rounded-full p-[16px] justify-self-center mr-4"
          >mdi-dumbbell</v-icon
        >
        <h2 class="text-center">{{ exerciseHistory.exerciseId }}</h2>
      </div>
    </template>
    <template #subtitle>
      <span class="ml-12">
        {{ exerciseHistory?.sessions.length }} sessions</span
      >
    </template>
    <p v-if="diff" class="px-2 flex items-center justify-center">
      <v-icon>mdi-weight-kilogram</v-icon> Volume diff from prev session:
      <span class="font-semibold inline-block mx-1" :class="diffClass">{{
        computedDiff
      }}</span>
      kg
    </p>
    <p v-else class="px-2 text-center">
      Add more workouts to track volume diff
    </p>
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useExercisesProgress } from "../../stores/ExerciseProgressStore";
import { computed } from "vue";

const router = useRouter();
const props = defineProps(["exerciseHistory"]);
const { volumeDiff } = useExercisesProgress();

const openWorkout = () => {
  if (props.exerciseHistory) {
    router.push(`/progress/${props.exerciseHistory._id}`);
  }
};

const diff = volumeDiff(props.exerciseHistory._id);

const computedDiff = computed(() => {
  return diff > 0 ? `+${diff}` : diff;
});

const diffClass = computed(() => ({
  "text-green-500": diff > 0,
  "text-red-500": diff < 0,
  "text-black": diff == 0,
}));
</script>
