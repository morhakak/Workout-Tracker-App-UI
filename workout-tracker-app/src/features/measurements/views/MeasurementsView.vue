<template>
  <v-container
    fluid
    class="flex flex-col items-center lg:flex-row lg:gap-5 lg:justify-center lg:items-start"
  >
    <WeighingsListCard />
    <CircumferencesListCard />
  </v-container>
</template>

<script setup>
import CircumferencesListCard from "../../circumferences/components/CircumferencesListCard.vue";
import WeighingsListCard from "../../weighings/components/WeighingsListCard.vue";
</script>
