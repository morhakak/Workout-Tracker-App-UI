<template>
  <div
    class="flex flex-col items-center justify-between h-screen bg-gray-900 w-full"
  >
    <h1
      class="text-white text-center font-semibold text-4xl justify-self-center align-self-center mt-28"
    >
      Welcome to<br />
      Workout Tracker
    </h1>
    <v-icon color="white" class="text-xl">mdi-dumbbell</v-icon>
    <div class="flex flex-col justify-self-end items-center mb-52 gap-4">
      <v-btn
        @click="() => router.push(`/auth/register`)"
        width="400"
        variant="outlined"
        class="bg-white"
        >Get Started Now</v-btn
      >
      <v-btn
        @click="() => router.push(`/auth/login`)"
        width="400"
        variant="outlined"
        color="white"
        >I Already Have an Account</v-btn
      >
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
