<template>
  <div class="flex justify-center mt-6">
    <v-card
      rounded="lg"
      class="flex flex-col p-6 justify-center min-w-[350px] sm:w-[500px] gap-4"
    >
      <div class="flex flex-col gap-10">
        <h1 class="text-xl self-center font-semibold">Enter workout name</h1>
        <v-text-field
          variant="underlined"
          label="Workout Name"
          v-model="workoutName"
          :loading="isLoading"
          clearable
          :rules="[rules.nameLength]"
          :hint="`Max of ${nameLength} characters`"
        ></v-text-field>
      </div>

      <v-btn
        rounded="lg"
        class="mb-4 py-6 text-center flex"
        append-icon="mdi-plus"
        :loading="isLoading"
        :disabled="workoutName == `` || workoutName.length > nameLength"
        @click="createWorkoutNameAndNavigate"
        >Create Workout</v-btn
      >
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useWorkoutDraftStore } from "../stores/workoutDraftStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const workoutDraftStore = useWorkoutDraftStore();
const workoutStore = useWorkoutStore();

const { isLoading } = storeToRefs(workoutStore);
const { workoutDraft } = storeToRefs(workoutDraftStore);

const selectedType = ref("");
const tab = ref(null);
const workoutName = ref("");
const nameLength = 25;
const rules = {
  nameLength: (value) =>
    value.length <= nameLength || `Max ${nameLength} characters`,
};

const createWorkoutNameAndNavigate = async () => {
  const workout = {
    name: workoutName.value,
    type: [],
    exercises: [],
    isFavorite: false,
  };
  const workoutId = await workoutStore.addNewWorkout(workout);
  if (workoutId) router.push(`/workout/${workoutId}`);
};
</script>
