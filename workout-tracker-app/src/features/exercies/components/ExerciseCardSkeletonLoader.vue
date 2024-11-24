<template>
  <v-card
    rounded="xl"
    class="flex flex-col w-[350px] sm:min-w-[550px] lg:min-w-[550px] items-center pb-8 pt-4 mt-6"
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
      class="px-4 w-[320px] sm:w-[400px] lg:[550px] h-[56px] mt-2 box-border"
    ></v-skeleton-loader>
    <!-- Placeholder for Add new set button -->
    <v-skeleton-loader
      height="45"
      class="mt-4 w-[90%] sm:w-[60%]"
      rounded="lg"
      variant="elevated"
    ></v-skeleton-loader>
  </v-card>
</template>

<script setup>
defineProps({
  numberOfSets: {
    type: Number,
    required: true,
    default: 3,
  },
});
</script>
