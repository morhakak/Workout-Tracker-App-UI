<template>
  <div class="flex justify-center items-center gap-3">
    <p class="text-lg">Metric</p>
    <v-switch
      inset
      class="flex"
      v-model="preferredUnit"
      false-value="metric"
      true-value="imperial"
    />
    <p class="text-lg">Imperial</p>
  </div>
</template>

<script setup>
import { useAppSettingsStore } from "../stores/appSettingsStore";
import { storeToRefs } from "pinia";

const { preferredUnit } = storeToRefs(useAppSettingsStore());
</script>
