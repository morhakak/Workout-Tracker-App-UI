<template>
  <div class="min-h-screen w-full pb-6">
    <div class="mt-16">
      <div class="d-flex flex-column align-center ga-5" v-if="user">
        <v-btn
          v-if="!isLoading"
          color="rgba(255, 255,255, 0.5)"
          width="300"
          height="100"
          class="mt-6 border-2 border-white"
          rounded="xl"
          to="/create-Workout"
        >
          <div class="flex flex-col items-center gap-2">
            <span>Create a workout</span>
            <v-icon size="x-large">mdi-plus</v-icon>
          </div>
        </v-btn>
        <v-skeleton-loader
          v-if="isLoading"
          class="rounded-xl mt-6 border-2"
          width="300"
          height="100"
        >
        </v-skeleton-loader>
        <transition-group name="fade" tag="div" mode="out-in">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4"
          >
            <WorkoutCard
              v-if="!isLoading"
              v-for="workout in filteredWorkouts"
              :key="workout._id"
              :workout="workout"
              @deleteRequest="handleDeleteRequest"
              @toggleIsFavorite="handleToggleIsFavorite"
            />
            <v-skeleton-loader
              v-if="workouts.length > 0 && isLoading"
              v-for="n in workouts.length"
              :key="'skeleton-' + n"
              class="rounded-xl"
              width="300"
              height="120"
            >
            </v-skeleton-loader>
          </div>
        </transition-group>
      </div>
      <v-snackbar
        :color="snackbarColor"
        rounded="lg"
        :modelValue="messages.length > 0"
      >
        <p>{{ messages[0]?.message }}</p>
      </v-snackbar>
      <v-alert
        v-if="messages.length > 0"
        icon="mdi-alert-circle"
        rounded="lg"
        type="error"
        variant="elevated"
      >
        <p class="text-center">{{ messages[0].message }}</p>
      </v-alert>
    </div>
  </div>
  <v-dialog v-model="deleteDialog" width="auto">
    <v-card
      class="justify-center items-center pb-3 relative py-6 text-center"
      max-width="400"
      width="400"
      height="260"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="deleteDialog = false"
      ></v-btn>
      <template #title> Delete Confirmation</template>
      <template #text>
        <p class="text-lg">
          Are you sure you want to delete
          <span class="font-semibold">{{ workoutToDelete?.name }}</span>
          workout? This action cannot be undone.
        </p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Cancel"
            width="120"
            @click="handleCancelDelete"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Delete"
            width="120"
            :loading="isLoading"
            @click="deleteWorkout"
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import WorkoutCard from "../components/workouts/WorkoutCard.vue";
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";
import { useWorkoutStore } from "../stores/workoutStore";
import { useApiErrorStore } from "../stores/apiErrorStore";

const { user } = storeToRefs(useAuthStore());
const workoutStore = useWorkoutStore();
const { workouts, isLoading } = storeToRefs(workoutStore);
const { messages } = storeToRefs(useApiErrorStore());
const deleteDialog = ref(false);
const workoutToDelete = ref({
  name: "",
  _id: "",
});

onMounted(async () => {
  await workoutStore.loadWorkouts();
});

const filteredWorkouts = computed(() => {
  return workouts.value.sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );
});

const snackbarColor = computed(() => {
  if (messages.value.length > 0) {
    return messages.value[0].type == "success" ? "green" : "red";
  }
});

const handleDeleteRequest = (id, name) => {
  deleteDialog.value = true;
  workoutToDelete.value._id = id;
  workoutToDelete.value.name = name;
};

const handleCancelDelete = () => {
  deleteDialog.value = false;
  workoutToDelete.value = {};
};

const deleteWorkout = async () => {
  await workoutStore.deleteWorkout(workoutToDelete.value._id);
  workoutToDelete.value = {};
  deleteDialog.value = false;
};

const handleToggleIsFavorite = async (id) => {
  await workoutStore.toggleIsFavorite(id);
};
</script>

<style scoped></style>
