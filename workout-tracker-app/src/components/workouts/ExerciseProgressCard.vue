<template>
  <v-card
    class="mx-auto relative"
    max-width="350"
    min-width="350"
    min-height="120"
    rounded="xl"
    hover
    color="rgba(255, 255,255, 0.8)"
    @click="openWorkout"
  >
    <template #title>
      <div class="flex items-center">
        <v-icon
          size="small"
          class="bg-black text-white rounded-full p-[16px] justify-self-center mr-2"
          >mdi-dumbbell</v-icon
        >
        <h2 class="text-center">{{ exerciseHistory.exerciseId }}</h2>
      </div>
    </template>
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["exerciseHistory"]);

const openWorkout = () => {
  if (props.exerciseHistory) {
    router.push(`/progress/${props.exerciseHistory._id}`);
  }
};
</script>
