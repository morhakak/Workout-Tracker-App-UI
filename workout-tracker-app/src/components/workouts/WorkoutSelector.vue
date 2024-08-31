<template>
  <div class="border rounded-xl flex flex-col p-4 w-full">
    <h2 class="text-subtitle-1 text-center mb-4 font-semibold">
      {{ section.title }} Workout
    </h2>
    <div class="d-flex justify-center gap-2 flex-wrap">
      <v-btn
        v-for="type in section.types"
        :key="type"
        @click="() => setWorkoutNameAndNavigate(type)"
        rounded="xl"
        >{{ type }}</v-btn
      >
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useWorkoutDraftStore } from "../../stores/workoutDraftStore";
import { useRouter } from "vue-router";

const workoutDraftStore = useWorkoutDraftStore();
const { workoutDraft } = storeToRefs(workoutDraftStore);
const router = useRouter();

const props = defineProps({
  section: Object,
  require: true,
});

const setWorkoutNameAndNavigate = (type) => {
  workoutDraftStore.createDraft(type);
  router.push(`/workout/${workoutDraft.value._id}`);
};
</script>
