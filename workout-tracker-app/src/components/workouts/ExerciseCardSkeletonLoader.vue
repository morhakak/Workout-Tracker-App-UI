<template>
  <v-card
    width="450"
    rounded="xl"
    color="rgba(255, 255, 255, 0.8)"
    class="d-flex flex-col items-center pb-8 pt-4 mt-6 border-2 relative"
  >
    <!-- Placeholder for edit button -->
    <v-skeleton-loader
      width="48"
      height="48"
      class="absolute right-2 rounded-full"
    ></v-skeleton-loader>

    <!-- Placeholder for card title -->
    <v-skeleton-loader
      height="55"
      width="250"
      class="text-center text-2xl mb-2 tracking-widest"
    ></v-skeleton-loader>

    <!-- Placeholder for each set -->
    <v-skeleton-loader
      v-for="index in numberOfSets"
      :key="index"
      width="370"
      height="60"
      class="mt-2 rounded-lg"
    ></v-skeleton-loader>
    <v-skeleton-loader width="370" height="45" class="mt-4"></v-skeleton-loader>
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  numberOfSets: {
    type: Number,
    required: true,
    default: 3,
  },
});
</script>
