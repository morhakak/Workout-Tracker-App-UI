<template>
  <v-card
    v-if="!isLoading"
    class="w-[330px] h-[112px] box-border p-4 rounded-xl"
  >
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
  <v-skeleton-loader
    v-else
    height="144"
    class="w-[330px] box-border p-4 rounded-xl"
  />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isLoading: {
    type: Boolean,
  },
  value: {
    type: Number,
    default: 0,
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
  },
  workoutName: {
    type: String,
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
