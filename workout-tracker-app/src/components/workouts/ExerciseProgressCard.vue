<template>
  <v-card
    class="mx-auto relative box-border h-[150px] flex flex-col justify-between pb-4"
    max-width="350"
    min-width="350"
    min-height="120"
    rounded="xl"
    hover
    @click="openWorkout"
  >
    <template #title>
      <div class="flex items-center">
        <v-icon
          size="small"
          class="bg-black text-white rounded-full p-[16px] mr-4"
          >mdi-dumbbell</v-icon
        >
        <h2 class="text-wrap">{{ exerciseHistory.exerciseId }}</h2>
      </div>
    </template>
    <template #subtitle>
      <span class="ml-12">
        {{ exerciseHistory?.sessions.length }} sessions</span
      >
    </template>
    <div>
      <p v-if="diff" class="px-2">
        <v-icon class="ml-3 mr-1 mb-1">{{ weightIcon }}</v-icon> Volume diff:
        <span class="font-semibold inline-block mx-1" :class="diffClass">
          {{ computedDiff }}
        </span>
      </p>
      <p v-else class="px-2">
        <v-icon class="ml-3 mr-1 mb-1">mdi-information</v-icon>
        Add more workouts sessions
      </p>
    </div>
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useExercisesProgress } from "../../stores/ExerciseProgressStore";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../../stores/unitUtilsStore";

const router = useRouter();
const props = defineProps(["exerciseHistory"]);
const { volumeDiff } = useExercisesProgress();
const { weightIcon } = storeToRefs(useUnitUtils());

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
