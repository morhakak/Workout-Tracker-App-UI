<template>
  <v-container class="flex flex-col items-center">
    <v-card class="px-12 w-[500px] rounded-xl pb-8 pt-8">
      <h1 class="text-center text-3xl font-bold mb-2">Body Measurements</h1>
      <UnitSelector />
      <v-card class="px-6 rounded-xl mb-8 mt-8 pb-8 border-[1px] border-white">
        <WeightForm />
      </v-card>
      <v-card class="px-6 rounded-xl pt-8 border-[1px] border-white">
        <CircumferencesForm />
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import UnitSelector from "../../../components/UnitSelector.vue";
import WeightForm from "../../weighings/components/WeightForm.vue";
import CircumferencesForm from "../components/CircumferencesForm.vue";
</script>
