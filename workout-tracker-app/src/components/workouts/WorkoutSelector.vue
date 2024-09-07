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
import { storeToRefs } from "pinia";
import { useWorkoutDraftStore } from "../../stores/workoutDraftStore";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

// const workoutDraftStore = useWorkoutDraftStore();
// const { workoutDraft } = storeToRefs(workoutDraftStore);
// const router = useRouter();

const selectedType = ref(null);

const props = defineProps({
  section: Object,
  require: true,
});

const emits = defineEmits(["chooseWorkout"]);

const isSplitSelected = computed((type, index) => {
  return type == section.types[index];
});

const chooseWorkout = (type) => {
  selectedType.value = type; // Set the selected type
  emits("chooseWorkout", type); // Emit the event
};

// const createWorkoutNameAndNavigate = (type) => {
//   workoutDraftStore.createDraft(type);
//   router.push(`/workout/${workoutDraft.value._id}`);
// };
</script>
