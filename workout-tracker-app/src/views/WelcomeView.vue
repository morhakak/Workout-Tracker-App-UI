<template>
  <div
    class="flex flex-col justify-between min-h-screen bg-[url('/assets/man-working-out.jpg')] bg-cover w-full"
  >
    <h1
      class="text-white text-center font-semibold text-4xl justify-self-center align-self-center mt-20"
    >
      Welcome to<br />
      Workout Tracker
    </h1>
    <div class="flex flex-col justify-self-end items-center mb-52 gap-4">
      <v-btn
        @click="() => router.push(`/auth/register`)"
        width="400"
        variant="outlined"
        color="white"
        >Get Started</v-btn
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
