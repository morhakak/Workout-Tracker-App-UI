<template>
  <div class="flex items-center justify-start gap-2 p-2 m-2 border rounded">
    <div
      class="w-10 h-10 bg-black rounded-full flex justify-center items-center"
    >
      <v-icon>mdi-account</v-icon>
    </div>
    <div>
      <p class="mb-0 font-bold text-black leading-1 capitalize">
        {{ user?.name }}
      </p>
      <p>{{ user?.role == `user` ? "Traniee" : `Admin` }}</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore.js";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>
