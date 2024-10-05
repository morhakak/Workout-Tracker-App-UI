<template>
  <h1 class="text-center mb-4 text-2xl font-semibold">
    {{ existingExercise?.exerciseId }}
  </h1>
  <v-timeline side="end" class="pb-20">
    <v-timeline-item
      v-for="session in existingExercise?.sessions"
      :key="existingExercise?._id"
    >
      <template v-slot:opposite>
        <div class="text-md-body-1 font-semibold">
          {{ toLocalDate(session?.createdDate) }}
        </div>
      </template>
      <div class="border-2 border-black p-4 rounded-xl">
        <div>
          <div class="text-h5 mb-4">
            {{ session?.workout?.workoutName }}
          </div>

          <div>
            <div
              v-for="(set, i) in session?.sets"
              :key="set._id"
              class="w-[160px]"
            >
              <div
                class="flex justify-start items-center gap-3"
                :class="[
                  i == session.sets.length - 1 ? `` : `border-b-2 border-black`,
                ]"
              >
                <p
                  class="bg-black h-5 w-5 text-xs rounded-full flex justify-center items-center"
                >
                  {{ i }}
                </p>
                <div>
                  <p>Weight: {{ set.weight }}</p>
                  <p>Reps: {{ set.reps }}</p>
                </div>
              </div>
            </div>
            <h3 class="mb-2 font-semibold mt-4">
              Total Volume: {{ session?.volume }}
            </h3>
          </div>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import moment from "moment";

const toLocalDate = (utcDate) => {
  const dateLocal = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  return dateLocal;
};
const route = useRoute();
const exerciseId = ref(null);
exerciseId.value = route.params.id;
const progressStore = useExercisesProgress();
const existingExercise = ref(null);

onMounted(async () => {
  if (exerciseId.value) {
    existingExercise.value = await progressStore.fetchExerciseHistory(
      exerciseId.value
    );
    console.log(existingExercise.value);
  }
});
</script>
