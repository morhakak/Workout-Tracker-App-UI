<template>
  <v-timeline-item dot-color="black" size="large" icon="mdi-weight-lifter">
    <template v-slot:opposite>
      <div
        class="text-xl mb-4 hover:cursor-pointer"
        @click="() => navigateToWorkout(session?.workout.workoutId)"
      >
        {{ session?.workout?.workoutName }}
      </div>
      <div class="text-sm font-semibold">
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
</template>

<script setup>
import { useRouter } from "vue-router";
import { useDateFormatter } from "../../composables/useDateFormatter";

defineProps(["session"]);

const router = useRouter();
const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};

const { toLocalDate } = useDateFormatter();
</script>
