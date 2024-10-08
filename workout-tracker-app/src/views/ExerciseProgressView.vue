<template>
  <h1 class="text-center mb-4 text-3xl font-semibold">
    {{ existingExercise?.exerciseId }}
  </h1>
  <v-container class="flex gap-3">
    <div class="flex flex-col gap-3">
      <v-card class="w-[330px] p-4 rounded-xl">
        <v-card-title class="flex gap-2 items-center">
          <v-icon>mdi-trophy-outline</v-icon>
          <h2>{{ `Max Weight: ${80} Kg` }}</h2>
        </v-card-title>
        <v-card-subtitle>{{
          `You did it in ${`Full Body`} workout`
        }}</v-card-subtitle>
        <v-card-text
          ><span class="text-green-600 font-semibold">+{{ 8 }} Kg</span> from
          last time</v-card-text
        >
      </v-card>
      <v-card class="w-[330px] p-4 rounded-xl">
        <v-card-title class="flex gap-2 items-center">
          <v-icon>mdi-trophy-outline</v-icon>
          <h2>{{ `Max Reps: ${20}` }}</h2>
        </v-card-title>
        <v-card-subtitle>{{
          `You did it in ${`Full Body`} workout`
        }}</v-card-subtitle>
        <v-card-text
          ><span class="text-green-600 font-semibold">+{{ 5 }}</span> from last
          time</v-card-text
        >
      </v-card>
    </div>
    <v-card class="w-[330px] p-4 rounded-xl">
      <v-card-title class="flex gap-2 items-center">
        <v-icon>mdi-weight-kilogram</v-icon>
        <h2>{{ `Max Volume: ${900} Kg` }}</h2>
      </v-card-title>
      <v-card-subtitle>{{
        `You did it in ${`Full Body`} workout`
      }}</v-card-subtitle>
      <v-card-text
        ><span class="text-green-600 font-semibold">+{{ 100 }} Kg</span> from
        last time</v-card-text
      >
    </v-card>
  </v-container>
  <h2 class="text-center font-semibold text-2xl">Exercise History</h2>
  <v-container>
    <v-timeline side="end" class="pb-20">
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
          <!-- <div>
            <div
              class="text-h5 mb-4 hover:cursor-pointer"
              @click="() => navigateToWorkout(session?.workout.workoutId)"
            >
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
                    i == session.sets.length - 1
                      ? ``
                      : `border-b-2 border-black`,
                  ]"
                >
                  <p
                    class="bg-orange-400 h-5 w-5 text-xs rounded-full flex justify-center items-center"
                  >
                    {{ i + 1 }}
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
          </div> -->

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
                    class="bg-orange-400 h-5 w-5 text-xs rounded-full flex justify-center items-center"
                  >
                    {{ i + 1 }}
                  </p>
                </td>
                <td class="text-center">{{ set.weight }}</td>
                <td class="text-center">{{ set.reps }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useExercisesProgress } from "../stores/ExerciseProgressStore";
import moment from "moment";

const toLocalDate = (utcDate) => {
  const dateLocal = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  return dateLocal;
};

const router = useRouter();
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

const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};
</script>
