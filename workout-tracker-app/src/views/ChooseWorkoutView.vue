<template>
  <h1 class="text-h6 text-center mb-6 font-bold">Choose Your Workout</h1>
  <div class="flex flex-col gap-4">
    <WorkoutSelector :section="custom" />
    <WorkoutSelector :section="bodyPart" />
    <WorkoutSelector :section="split" />
  </div>
</template>

<script setup>
import WorkoutSelector from "../components/workouts/WorkoutSelector.vue";

const custom = { title: "Custom", types: ["Custom"] };
const bodyPart = {
  title: "Body Part",
  types: ["Chest", "Back", "Legs", "Shoulders", "Abs", "Arms"],
};
const split = {
  title: "Split",
  types: ["Full Body", "Push", "Pull", "Legs", "A", "B", "C", "D", "E"],
};
</script>

<style scoped></style>
