<template>
  <div class="relative min-h-screen py-6">
    <div class="flex flex-col align-center gap-5" v-if="user">
      <v-btn
        v-if="!isLoadingWorkouts"
        icon="mdi-plus"
        size="x-large"
        ripple
        variant="elevated"
        class="fixed rounded-full bottom-[5%] right-[5%] z-10 shadow-xl"
        :class="[
          theme.global.current.value.dark ? `border-white` : 'border-black',
          `border-dashed border-2`,
        ]"
        to="/create-workout"
      >
      </v-btn>
      <TransitionGroup name="list">
        <div
          v-if="!isLoadingWorkouts && workouts.length"
          class="grid grid-cols-1 px750:grid-cols-2 px1400:grid-cols-3 items-center gap-4"
        >
          <div v-for="workout in filteredWorkouts">
            <WorkoutCard
              :isLoading="isLoadingWorkouts"
              :key="workout._id"
              :workout="workout"
              @deleteRequest="handleDeleteRequest"
              @toggleIsFavorite="handleToggleIsFavorite"
            />
          </div>
        </div>

        <div
          v-if="workouts.length > 0 && isLoadingWorkouts"
          class="grid grid-cols-1 px750:grid-cols-2 px1400:grid-cols-3 items-center gap-4"
        >
          <v-skeleton-loader
            v-for="n in workouts.length || 3"
            :key="'card-skeleton-' + n"
            class="rounded-xl box-border"
            width="350"
            height="140"
          >
          </v-skeleton-loader>
        </div>
      </TransitionGroup>
      <div v-if="workouts.length">
        <v-btn
          v-if="hasMoreData"
          :loading="isLoadingWorkouts"
          @click="workoutStore.loadWorkouts()"
          class="align-self-center"
          >Show More</v-btn
        >
      </div>
      <v-card
        v-if="workouts.length == 0 && !isLoadingWorkouts"
        elevation="5"
        class="py-6 px-12 mx-4 sm:mx-auto rounded-xl text-xl text-center text-wrap tracking-wider font-medium"
      >
        <template #title>
          <div class="text-xl mt-4 text-wrap">
            There are no workouts to display 🧐
          </div>
        </template>
        <template #text>
          <div class="text-lg mt-4 font-light">
            Add new workout by clicking on
            <v-btn
              v-if="!isLoadingWorkouts"
              readonly
              icon="mdi-plus"
              size="xs"
              variant="elevated"
              class="ml-2 rounded-full z-10 shadow-xl"
              :class="[
                theme.global.current.value.dark
                  ? `border-white`
                  : 'border-black',
                `border-dashed border-2`,
              ]"
            >
            </v-btn>
          </div>
        </template>
      </v-card>
    </div>
    <v-snackbar
      :color="snackbarColor"
      rounded="lg"
      :modelValue="messages.length > 0"
    >
      <p>{{ messages[0]?.message }}</p>
    </v-snackbar>
  </div>
  <v-dialog v-model="deleteDialog" width="auto">
    <v-card
      class="justify-center items-center w-[340px] sm:w-[400px] lg:w-[450px] pb-3 relative py-6 text-center"
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
            variant="flat"
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
import { computed, onMounted, ref } from "vue";
import WorkoutCard from "../components/WorkoutCard.vue";
import { useAuthStore } from "../../users/stores/authStore";
import { storeToRefs } from "pinia";
import { useWorkoutStore } from "../stores/workoutStore";
import { useApiErrorStore } from "../../../stores/apiErrorStore";
import { useTheme } from "vuetify";
import { useInfiniteScroll } from "@vueuse/core";

const { user } = storeToRefs(useAuthStore());
const workoutStore = useWorkoutStore();
const { workouts, isLoading, isLoadingWorkouts, hasFetched, hasMoreData } =
  storeToRefs(workoutStore);
const { messages } = storeToRefs(useApiErrorStore());
const deleteDialog = ref(false);
const workoutToDelete = ref({
  name: "",
  _id: "",
});

const elForScroll = ref(null);
useInfiniteScroll(
  elForScroll,
  async () => {
    if (!isLoadingWorkouts.value && hasMoreData.value) {
      await workoutStore.loadWorkouts();
    }
  },
  {
    distance: 50,
    interval: 2000,
    canLoadMore: () => {
      return hasMoreData.value;
    },
  }
);

const theme = useTheme();
onMounted(async () => {
  if (!hasFetched.value) await workoutStore.loadWorkouts();
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

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: opacity;
}

.list-leave-active {
  position: absolute;
}
</style>
