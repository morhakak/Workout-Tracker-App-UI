<template>
  <div class="flex justify-center items-center gap-3">
    <p>Metric</p>
    <v-switch
      class="flex"
      v-model="preferredUnit"
      false-value="metric"
      true-value="imperial"
    />
    <p>Imperial</p>
  </div>
</template>

<script setup>
import { useAppSettingsStore } from "../stores/appSettingsStore";
import { storeToRefs } from "pinia";

const { preferredUnit } = storeToRefs(useAppSettingsStore());
</script>
