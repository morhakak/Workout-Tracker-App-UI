<template>
  <v-card class="w-[330px] h-28 box-border p-4 rounded-xl">
    <v-card-title class="flex gap-2 items-center">
      <v-icon>{{ icon }}</v-icon>
      <h2>{{ recordType }}: {{ value }}{{ kg ? "Kg" : "" }}</h2>
    </v-card-title>
    <v-card-subtitle class="text-wrap"
      >You did it in
      <span
        class="font-semibold hover:cursor-pointer"
        @click="() => navigateToWorkout(workoutId)"
      >
        {{ workoutName }}</span
      >
      workout</v-card-subtitle
    >
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";

defineProps({
  value: {
    type: Number,
    default: 0,
    required: true,
  },
  icon: {
    type: String,
    default: "mdi-info",
    required: true,
  },
  recordType: {
    type: String,
    required: true,
  },
  workoutId: {
    type: String,
    required: true,
  },
  workoutName: {
    type: String,
    required: true,
  },
  kg: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};
</script>
