<template>
  <v-container>
    <v-card
      class="flex flex-col justify-center items-center w-[400px] mx-auto rounded-xl"
    >
      <template #title>
        <p class="text-2xl mb-6 mt-4">Settings</p>
      </template>
      <h2 class="font-semibold">Select Theme</h2>
      <v-container class="flex justify-center items-center gap-3">
        <p class="text-lg">Light</p>
        <v-switch
          class="flex"
          v-model="theme"
          false-value="light"
          true-value="dark"
        />
        <p class="text-lg">Dark</p>
      </v-container>
      <h2 class="font-semibold">Unit Preference</h2>
      <v-container class="flex justify-center items-center gap-3">
        <p class="text-lg">Metric</p>
        <v-switch
          class="flex"
          v-model="preferredUnit"
          false-value="metric"
          true-value="imperial"
        />
        <p class="text-lg">Imperial</p>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAppSettingsStore } from "../stores/appSettingsStore";
import { storeToRefs } from "pinia";

const appSettingsStore = useAppSettingsStore();
const { theme, preferredUnit } = storeToRefs(appSettingsStore);
</script>
