<template>
  <v-card
    rounded="xl"
    color="rgba(255, 255, 255, 0.8)"
    class="d-flex flex-col items-center w-[350px] sm:min-w-[550px] lg:min-w-[550px] pb-8 pt-4 mt-6"
  >
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
      height="60"
      class="mt-2 rounded-lg w-[320px] h-[60px] sm:w-[400px] lg:[550px]"
    ></v-skeleton-loader>
    <v-skeleton-loader height="45" class="mt-4 w-full"></v-skeleton-loader>
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
