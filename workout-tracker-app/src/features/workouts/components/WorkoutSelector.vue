<template>
  <div class="border rounded-xl flex flex-col p-4 w-full">
    <h2 class="text-subtitle-1 text-center mb-4 font-semibold">
      {{ section.title }}
    </h2>
    <div class="d-flex justify-center gap-2 flex-wrap">
      <v-btn
        v-for="(type, index) in section.types"
        :key="type"
        @click="chooseWorkout(type)"
        :active="selectedType === type"
        rounded="xl"
        >{{ type }}</v-btn
      >
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedType = ref(null);

const props = defineProps({
  section: Object,
  require: true,
});

const emits = defineEmits(["chooseWorkout"]);

const chooseWorkout = (type) => {
  selectedType.value = type;
  emits("chooseWorkout", type);
};
</script>
