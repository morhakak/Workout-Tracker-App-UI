<template>
  <v-container>
    <v-card
      class="flex flex-col justify-center pb-4 items-center w-[400px] mx-auto rounded-xl"
    >
      <template #title>
        <p class="text-2xl mb-6 mt-4">Settings</p>
      </template>
      <h2 class="font-semibold">Select Theme</h2>
      <div class="flex justify-center items-center gap-3">
        <p class="text-lg">Light</p>
        <v-switch
          inset
          class="flex"
          v-model="theme"
          false-value="light"
          true-value="dark"
          false-icon="mdi-white-balance-sunny"
          true-icon="mdi-weather-night"
        />
        <p class="text-lg">Dark</p>
      </div>
      <h2 class="font-semibold">Unit Preference</h2>
      <UnitSelector />
    </v-card>
  </v-container>
</template>

<script setup>
import UnitSelector from "../components/UnitSelector.vue";
import { useAppSettingsStore } from "../stores/appSettingsStore";
import { storeToRefs } from "pinia";

const appSettingsStore = useAppSettingsStore();
const { theme } = storeToRefs(appSettingsStore);
</script>
