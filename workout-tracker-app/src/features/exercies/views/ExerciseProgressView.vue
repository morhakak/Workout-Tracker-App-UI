<template>
  <h1 class="text-center mb-4 text-3xl font-semibold">
    {{ currentExerciseHistory?.exerciseId }}
  </h1>
  <v-container class="flex flex-col-reverse xl:flex-row justify-center gap-10">
    <div class="flex justify-center">
      <v-card
        :elevation="5"
        class="flex flex-col items-center min-w-[400px] max-w-[500px] box-border grow rounded-xl pb-8 pt-8"
      >
        <div class="flex mb-6 justify-center items-center gap-2">
          <v-icon class="text-2xl">mdi-clipboard-text-clock-outline</v-icon>
          <h2 class="text-center text-xl sm:text-2xl font-medium tracking-wide">
            Exercise History
          </h2>
        </div>
        <div class="max-h-screen px-6 overflow-y-hidden">
          <div
            ref="elementForScroll"
            class="h-[500px] custom-scrollbar overflow-y-auto px-5 w-[350px] overflow-x-hidden"
          >
            <div
              v-for="session in currentExerciseHistory?.sessions"
              :key="session?._id"
              class="mt-4"
            >
              <v-table
                v-if="!isLoading && currentExerciseHistory.sessions.length"
                class="relative border box-border shadow-lg rounded-xl overflow-x-hidden"
                hover
              >
                <thead>
                  <tr>
                    <th colspan="3" class="p-0">
                      <div
                        class="flex justify-center items-center gap-2 rounded-t-xl w-full py-2 px-4"
                        @click="
                          () => navigateToWorkout(session?.workout.workoutId)
                        "
                      >
                        <v-icon>mdi-calendar-clock-outline</v-icon>
                        <p
                          class="text-[14px] justify-self-start pr-2 border-r-2"
                        >
                          {{
                            dateFormatter.getDayMonthYear(session.createdDate)
                          }}
                        </p>
                        <v-icon>mdi-weight-lifter</v-icon>
                        <p
                          v-if="session.workout.workoutName"
                          class="text-[16px] font-semibold hover:cursor-pointer text-nowrap"
                        >
                          {{ session.workout.workoutName }}
                        </p>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left text-base">#</th>
                    <th
                      class="flex items-center justify-center text-center text-base"
                    >
                      <p>Weight ({{ weightSuffix }})</p>
                    </th>
                    <th class="text-center text-base">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(set, i) in session.sets"
                    :key="set._id || session._id + '-' + i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td class="text-center tracking-wider text-[16px]">
                      {{ set.weight }}
                    </td>
                    <td class="text-center tracking-wider text-[16px]">
                      {{ set.reps }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
        <!-- <div v-if="!isFetching && normalizedWeighings.length == 0">
          No weighings have been added yet
        </div> -->
      </v-card>
    </div>
    <div class="flex justify-center">
      <v-card
        icon="mdi-medal-outline"
        class="flex flex-col items-center rounded-xl px-4 justify-start h-min"
      >
        <v-card-title class="flex items-center justify-center">
          <h2 class="font-semibold text-2xl pt-6 pb-2">
            <v-icon>mdi-medal-outline</v-icon>Personal Records
          </h2>
        </v-card-title>
        <v-container
          class="grid grid-cols-1 px880:grid-cols-2 xl:grid-cols-1 items-center justify-center gap-4 mb-8"
        >
          <RecordCard
            v-for="record in records"
            :key="record"
            :icon="record.icon"
            :recordType="record.recordType"
            :workoutId="record.workoutId"
            :workoutName="record.workoutName"
            :value="record.value"
            :unit="record.unit"
            :isLoading="isLoading || !currentExerciseHistory"
          />
        </v-container>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import { storeToRefs } from "pinia";
import RecordCard from "../components/RecordCard.vue";
import ExerciseTimelineItem from "../components/ExerciseTimelineItem.vue";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { useDate } from "../../../composables/useDate";

const route = useRoute();
const exerciseId = ref(null);
exerciseId.value = route.params.id;
const progressStore = useExercisesProgress();
const { isLoading, hasFetchedOne, currentExerciseHistory } =
  storeToRefs(progressStore);
const { weightSuffix, weightIcon } = storeToRefs(useUnitUtils());
const dateFormatter = useDate();
const router = useRouter();

onMounted(async () => {
  if (exerciseId.value && !hasFetchedOne.value)
    await progressStore.fetchExerciseHistory(exerciseId.value);
});

const records = computed(() => [
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Weight",
    workout: currentExerciseHistory.value?.maxWeight,
    workoutId: currentExerciseHistory.value?.maxWeight.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxWeight.workout.workoutName,
    value: currentExerciseHistory.value?.maxWeight.value,
    unit: true,
  },
  {
    icon: "mdi-counter",
    recordType: "Max Reps",
    workout: currentExerciseHistory.value?.maxReps,
    workoutId: currentExerciseHistory.value?.maxReps.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxReps.workout.workoutName,
    value: currentExerciseHistory.value?.maxReps.value,
    unit: false,
  },
  {
    icon: "mdi-weight-kilogram",
    recordType: "Max Volume",
    workout: currentExerciseHistory.value?.maxVolume,
    workoutId: currentExerciseHistory.value?.maxVolume.workout.workoutId,
    workoutName: currentExerciseHistory.value?.maxVolume.workout.workoutName,
    value: currentExerciseHistory.value?.maxVolume.value,
    unit: true,
  },
  {
    icon: "mdi-numeric-1-box-outline",
    recordType: "1RM",
    workout: currentExerciseHistory.value?.oneRepMax,
    workoutId: currentExerciseHistory.value?.oneRepMax.workout.workoutId,
    workoutName: currentExerciseHistory.value?.oneRepMax.workout.workoutName,
    value: currentExerciseHistory.value?.oneRepMax.value,
    unit: true,
  },
]);

const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};
</script>

<style scoped>
:deep(.v-table__wrapper) {
  overflow-x: hidden;
}
</style>
