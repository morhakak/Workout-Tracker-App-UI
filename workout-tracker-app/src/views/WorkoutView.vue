<template>
  <div class="min-h-screen w-full mt-20 flex flex-col items-center">
    <div class="mb-6 flex justify-center gap-4 w-full">
      <v-btn
        @click="handleDeleteRequest"
        color="rgba(255, 255,255, 0.5)"
        icon="mdi-trash-can"
      >
      </v-btn>
      <v-btn
        @click="isEditMode = !isEditMode"
        color="rgba(255, 255,255, 0.5)"
        icon="mdi-pencil"
        :class="{
          'border-2 border-white': isEditMode,
        }"
      >
      </v-btn>
      <v-btn
        color="rgba(255, 255,255, 0.5)"
        rounded="xl"
        icon="mdi-plus"
        @click="isAddDialogOpen = true"
      >
      </v-btn>
    </div>
    <div class="w-full flex flex-col justify-center">
      <input
        :disabled="!isEditMode"
        type="text"
        v-model="workoutDraft.name"
        class="text-2xl sm:text-3xl lg:text-4xl text-clip py-2 text-center rounded-lg font-semibold bg-[#ffffff] leading-normal"
        :class="{ 'outline-1 outline-gray-950': isEditMode }"
      />
      <v-divider
        :thickness="4"
        color="warning"
        class="border-opacity-50 mt-4"
      ></v-divider>
    </div>

    <div class="relative w-full flex flex-col justify-center items-center mb-8">
      <div v-if="workoutDraft.exercises.length > 0">
        <transition-group name="fade" tag="div" mode="out-in">
          <ExerciseCard
            class="mt-10"
            v-if="!isLoading"
            v-for="exercise in workoutDraft?.exercises"
            :key="exercise._id"
            :exercise="exercise"
            :isEditMode="isEditMode"
            @add-set="addSet"
            @delete-set="deleteSet"
            @delete-exercise="() => handleDeleteExercise(exercise._id)"
          />
        </transition-group>
        <ExerciseCardSkeletonLoader
          v-if="isLoading"
          v-for="(exercise, index) in workoutDraft?.exercises"
          :key="'skeleton-' + index"
          :numberOfSets="exercise.sets.length"
        />
      </div>
      <div v-else class="mt-20">Add exercies... :)</div>
    </div>
  </div>

  <v-dialog
    v-model="isAddDialogOpen"
    width="auto"
    transition="dialog-bottom-transition"
  >
    <v-card rounded="xl" max-width="900" class="overflow-hidden">
      <v-toolbar color="black">
        <v-toolbar-title>Exercise Selector</v-toolbar-title>
        <v-toolbar-items>
          <v-btn icon="mdi-close" @click="isAddDialogOpen = false"></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-divider inset></v-divider>
      <v-tabs v-model="tab" bg-color="black" align-tabs="center" fixed-tabs>
        <v-tab value="two">Body Part</v-tab>
        <v-tab value="three">Exercises</v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item
            class="grid w-full overflow-y-scroll max-h-[500px] sm:max-h-[600px] px-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 items-center gap-5 pb-6"
            value="two"
          >
            <v-btn
              v-for="part in bodyParts"
              :key="part"
              rounded="xl"
              class="max-w-32 min-w-32 min-h-32 sm:max-w-40 sm:min-w-40 sm:min-h-40"
              @click="() => chooseBodyPart(part)"
            >
              {{ part }}
            </v-btn>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="three"
            class="py-4 max-h-[500px] sm:max-h-[600px]"
          >
            <div class="flex flex-col items-center">
              <v-text-field
                v-model="searchTerm"
                class="mb-8 w-[250px] sm:w-[300px]"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search exercise"
                variant="outlined"
                hide-details
                single-line
                autofocus
              ></v-text-field>
              <div class="flex justify-center">
                <v-list
                  class="w-[300px] sm:w-[380px] h-[500px] sm:h-[593px]"
                  v-model:selected="selectedItem"
                >
                  <v-list-item
                    v-for="item in filteredExercises"
                    :key="item.name"
                    :value="item.name"
                    variant="plain"
                    @click="
                      () => {
                        addSelectedExercise(item);
                        isAddDialogOpen = false;
                      }
                    "
                  >
                    <template v-slot:append>
                      <v-icon size="large" class="font-semibold"
                        >mdi-plus</v-icon
                      >
                    </template>
                    <v-list-item-title
                      class="font-semibold text-[1.2rem]"
                      v-text="item.name"
                    ></v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteExerciseDialog" width="auto">
    <v-card
      class="justify-center items-center w-[340px] sm:w-[400px] lg:w-[450px] pb-3 relative py-6 text-center"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="deleteExerciseDialog = false"
      ></v-btn>
      <template #title> Delete Confirmation</template>
      <template #text>
        <p class="text-lg">Are you sure you want to delete this exercise?</p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Cancel"
            width="120"
            @click="handleCancelExerciseDelete"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="flat"
            class="ms-auto"
            text="Delete"
            width="120"
            :loading="isLoading"
            @click="deleteExercise"
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteWorkoutDialog" width="auto">
    <v-card
      class="justify-center items-center w-[340px] sm:w-[400px] lg:w-[450px] pb-3 relative py-6 text-center"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="deleteWorkoutDialog = false"
      ></v-btn>
      <template #title> Delete Confirmation</template>
      <template #text>
        <p class="text-lg">
          Are you sure you want to delete this
          <span class="font-semibold">{{ workoutDraft?.name }}</span>
          workout?
        </p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            class="ms-auto"
            variant="outlined"
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
  <v-dialog v-model="saveBeforeExitDialog" width="auto">
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
        @click="saveBeforeExitDialog = false"
      ></v-btn>
      <template #title> Save your workout?</template>
      <template #text>
        <p class="text-lg">Changes you made may not be saved</p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Discard"
            width="120"
            @click="discardChanges"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Save Workout"
            width="120"
            :loading="isLoading"
            @click="saveChanges"
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="hasChanged" height="70" color="white">
    <template #text> <p class="text-xl">Save Changes?</p> </template>
    <template #actions>
      <div class="flex gap-2">
        <v-btn
          color="green"
          :loading="isLoading"
          variant="tonal"
          @click="saveChanges"
        >
          Yes
        </v-btn>
        <v-btn color="red" variant="tonal" @click="cancelChanges">
          Discard
        </v-btn>
      </div>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useWorkoutStore } from "../stores/workoutStore";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useWorkoutDraftStore } from "../stores/workoutDraftStore";
import { v4 } from "uuid";
import { cloneDeep, isEqual } from "lodash";
import ExerciseCard from "../components/workouts/ExerciseCard.vue";
import ExerciseCardSkeletonLoader from "../components/workouts/ExerciseCardSkeletonLoader.vue";

const router = useRouter();
const route = useRoute();

const workoutDraftStore = useWorkoutDraftStore();
const { workoutDraft } = storeToRefs(workoutDraftStore);
const workoutStore = useWorkoutStore();
const { isLoading } = storeToRefs(workoutStore);
const isWorkoutLoading = ref(true);

const exercisesToDisplay = ref([]);
const workoutId = ref(null);

const cachedWorkout = ref(null);

const initialWorkoutDraft = ref(null);
const isEditMode = ref(false);
const isAddDialogOpen = ref(false);
const saveBeforeExitDialog = ref(false);

// const snackbarObj = ref({
//   snackbar: false,
//   text: "SAVE CHANGES",
//   timeout: -1,
// });

onMounted(async () => {
  workoutId.value = route.params.id;
  // window.addEventListener("beforeunload", (event) => handleBeforeUnload(event));
  if (workoutId.value && !workoutId.value.startsWith("_draft")) {
    const existingWorkout = await workoutStore.getWorkout(workoutId.value);
    // cachedWorkout.value = cloneDeep(existingWorkout);
    workoutDraft.value = cloneDeep(existingWorkout);
    initialWorkoutDraft.value = cloneDeep(workoutDraft.value);
  } else {
    initialWorkoutDraft.value = cloneDeep(workoutDraft.value);
  }

  // if (workoutDraft.value && workoutDraft.value.type) {
  //   exercisesToDisplay.value = workoutStore.filterExercises(
  //     workoutDraft.value.type
  //   );
  // }

  isWorkoutLoading.value = false;
});

const tab = ref(null);

const bodyParts = ref([
  "chest",
  "back",
  "legs",
  "shoulders",
  "biceps",
  "triceps",
  "abs",
  "neck",
  "forearms",
]);

const chooseBodyPart = (part) => {
  exercisesToDisplay.value = workoutStore.filterExercises(part);
  tab.value = "three";
};

watchEffect(() => {
  if ((tab.value = "two")) {
    console.log("two");
  }
});

// onUnmounted(() => {
//   workoutDraft.value = {};
//   // window.removeEventListener("beforeunload", handleBeforeUnload);
// });

// router.beforeEach((to, from, next) => {
//   if (
//     route.params.id &&
//     route.params.id.startsWith("_draft") &&
//     from.name == "workout"
//   ) {
//     saveBeforeExitDialog.value = true; // Show dialog
//     next(false); // Prevent navigation
//   } else {
//     next(); // Allow navigation
//   }
// });

// const handleBeforeUnload = (event) => {
//   console.log(event);
//   // event.preventDefault();
//   saveBeforeExitDialog.value = true;
//   return (event.returnValue = "true");
// };

const editId = ref(null);

const selectedItem = ref(null);
const addSelectedExercise = (exercise) => {
  workoutDraftStore.addExercise(exercise.name);
  selectedItem.value = null;
  // snackbarObj.value.snackbar = true;
};

const searchTerm = ref("");
const filteredExercises = computed(() => {
  if (!searchTerm.value) return exercisesToDisplay.value;
  return exercisesToDisplay.value.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const deleteExerciseDialog = ref(false);
const exerciseIdToDelete = ref(null);

const handleDeleteExercise = (exerciseId) => {
  exerciseIdToDelete.value = exerciseId;
  deleteExerciseDialog.value = true;
};

const deleteExercise = () => {
  if (exerciseIdToDelete.value) {
    workoutDraft.value.exercises = workoutDraft.value.exercises.filter(
      (ex) => ex._id !== exerciseIdToDelete.value
    );

    deleteExerciseDialog.value = false;
  }
};

const handleCancelExerciseDelete = () => {
  exerciseIdToDelete.value = null;
  deleteExerciseDialog.value = false;
};

const addSet = (exercise) => {
  exercise.sets.push({
    _id: "_draft" + v4(),
    weight:
      exercise.sets.length > 0
        ? exercise.sets[exercise.sets.length - 1].weight
        : 0,
    reps:
      exercise.sets.length > 0
        ? exercise.sets[exercise.sets.length - 1].reps
        : 0,
  });
};

const deleteSet = (exerciseId, setId) => {
  const exercise = workoutDraft.value.exercises.find(
    (e) => e._id === exerciseId
  );

  if (exercise) {
    exercise.sets = exercise.sets.filter((set) => set._id !== setId);
  }
};

const hasChanged = computed(() => {
  if (isWorkoutLoading.value) return false; // Prevent snackbar from showing if loading
  if (!initialWorkoutDraft.value || !workoutDraft.value) return false;
  return !isEqual(workoutDraft.value, initialWorkoutDraft.value);

  // const isEqualResult = isEqual(workoutDraft.value, initialWorkoutDraft.value);
  // return !isEqualResult;
});

function resetInitialWorkoutDraft() {
  initialWorkoutDraft.value = cloneDeep(workoutDraft.value);
}

async function saveChanges() {
  try {
    if (workoutId.value.startsWith("_draft"))
      await workoutStore.addNewWorkout();
    else {
      await workoutStore.updateWorkout(workoutId.value);
    }
    resetInitialWorkoutDraft();
    router.push("/");
  } catch (error) {
    console.error("Error saving workout changes:", error);
  }
}

function cancelChanges() {
  // workoutDraft.value = JSON.parse(JSON.stringify(cachedWorkout.value));
  // workoutDraft.value = cloneDeep(cachedWorkout.value); // Deep clone here
  workoutDraft.value = cloneDeep(initialWorkoutDraft.value);
  resetInitialWorkoutDraft();
  if (!workoutId.value) {
    router.back();
  }
}

// function discardChanges() {
//   saveBeforeExitDialog.value = false;
//   router.push("/");
// }

const deleteWorkoutDialog = ref(false);

const handleDeleteRequest = () => {
  deleteWorkoutDialog.value = true;
};

const handleCancelDelete = () => {
  deleteWorkoutDialog.value = false;
};

const deleteWorkout = async () => {
  const result = await workoutStore.deleteWorkout(workoutDraft.value._id);
  if (result) router.push("/");
  deleteWorkoutDialog.value = false;
};
</script>

<style scoped>
.v-text-field input {
  flex: 1 1 auto;
  line-height: 30px;
  padding: 8px 0 8px;
  max-width: 100%;
  min-width: 0;
  width: 100%;
}

/* .fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
} */

.fade-enter-active {
  transition: all 0.4s ease;
}

.fade-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-move {
  transition: all 0.4s ease;
}

.dialog-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
