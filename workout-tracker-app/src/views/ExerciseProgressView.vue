<template>
  <h1 class="text-center mb-4 text-3xl font-semibold">
    {{ existingExercise?.exerciseId }}
  </h1>
  <v-container fluid class="flex justify-center">
    <v-card icon="mdi-medal-outline" class="rounded-xl px-20">
      <v-card-title class="flex items-center justify-center">
        <h2 class="text-center font-semibold text-2xl pt-6 pb-2">
          <v-icon>mdi-medal-outline</v-icon>Records
        </h2>
      </v-card-title>
      <v-container
        class="flex flex-wrap justify-center gap-3 mb-8 sm:flex-nowrap"
      >
        <div class="flex flex-col gap-3">
          <RecordCard
            icon="mdi-trophy-outline"
            recordType="Max Reps"
            :workoutId="existingExercise?.maxWeight.workout.workoutId"
            :workoutName="existingExercise?.maxWeight.workout.workoutName"
            :value="existingExercise?.maxWeight.value"
            kg
          />
          <RecordCard
            icon="mdi-trophy-outline"
            recordType="Max Weight"
            :workoutId="existingExercise?.maxReps.workout.workoutId"
            :workoutName="existingExercise?.maxReps.workout.workoutName"
            :value="existingExercise?.maxReps.value"
          />
        </div>
        <div class="flex flex-col gap-3">
          <RecordCard
            icon="mdi-weight-kilogram"
            recordType="Max Volume"
            :workoutId="existingExercise?.maxVolume.workout.workoutId"
            :workoutName="existingExercise?.maxVolume.workout.workoutName"
            :value="existingExercise?.maxVolume.value"
            kg
          />
          <RecordCard
            icon="mdi-numeric-1-box-outline"
            recordType="Max Volume"
            :workoutId="existingExercise?.oneRepMax.workout.workoutId"
            :workoutName="existingExercise?.oneRepMax.workout.workoutName"
            :value="existingExercise?.oneRepMax.value"
            kg
          />
        </div>
      </v-container>
    </v-card>
  </v-container>
  <v-container fluid class="flex justify-center">
    <v-card class="rounded-xl px-2">
      <v-card-title class="flex justify-center items-center">
        <h2 class="text-center font-semibold text-2xl pt-6 pb-2">
          <v-icon>mdi-clipboard-text-clock-outline</v-icon>
          Exercise History
        </h2>
      </v-card-title>
      <v-container class="flex justify-center">
        <v-progress-circular
          v-if="isLoading"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <v-timeline v-if="!isLoading" side="end" class="pb-4">
          <v-timeline-item
            v-for="session in existingExercise?.sessions"
            :key="existingExercise?._id"
            dot-color="black"
            size="large"
            icon="mdi-weight-lifter"
          >
            <template v-slot:opposite>
              <div
                class="text-h5 mb-4 hover:cursor-pointer"
                @click="() => navigateToWorkout(session?.workout.workoutId)"
              >
                {{ session?.workout?.workoutName }}
              </div>
              <div class="text-md-body-1 font-semibold">
                {{ toLocalDate(session?.createdDate) }}
              </div>
            </template>
            <v-card class="p-4 rounded-xl">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Set</th>
                    <th class="text-left">Weight</th>
                    <th class="text-left">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(set, i) in session.sets" :key="set._id">
                    <td>
                      <p
                        class="bg-orange-400 text-white h-5 w-5 text-xs rounded-full flex justify-center items-center"
                      >
                        {{ i + 1 }}
                      </p>
                    </td>
                    <td class="text-center">{{ set.weight }}</td>
                    <td class="text-center">{{ set.reps }}</td>
                  </tr>
                </tbody>
              </v-table>
              <p class="text-center mt-4 font-semibold">
                Total volume: {{ session.volume }}
              </p>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import RecordCard from "../components/workouts/RecordCard.vue";

const toLocalDate = (utcDate) => {
  const dateLocal = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  return dateLocal;
};

const router = useRouter();
const route = useRoute();
const exerciseId = ref(null);
exerciseId.value = route.params.id;
const progressStore = useExercisesProgress();
const { isLoading } = storeToRefs(progressStore);
const existingExercise = ref(null);

onMounted(async () => {
  if (exerciseId.value) {
    existingExercise.value = await progressStore.fetchExerciseHistory(
      exerciseId.value
    );
    console.log(existingExercise.value);
  }
});

const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};
</script>
