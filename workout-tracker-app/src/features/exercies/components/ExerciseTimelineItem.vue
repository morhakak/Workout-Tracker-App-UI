<template>
  <v-timeline-item dot-color="black" size="large" icon="mdi-weight-lifter">
    <template v-slot:opposite>
      <div class="flex gap-3 text-md items-center">
        <v-icon>mdi-calendar-clock</v-icon>
        <div class="text-sm text-wrap">
          <span>{{ dayMonthYear }}</span
          ><br />
          <span>{{ day }}</span
          ><br />
          <span>{{ time }}</span>
        </div>
      </div>
    </template>

    <v-card class="p-4 rounded-xl border-[1px] border-white">
      <div
        class="text-lg mb-4 hover:cursor-pointer text-wrap text-center"
        @click="() => navigateToWorkout(session?.workout.workoutId)"
      >
        {{ session?.workout?.workoutName }}
      </div>
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
                class="bg-black text-white h-5 w-5 text-xs rounded-full flex justify-center items-center"
              >
                {{ i + 1 }}
              </p>
            </td>
            <td class="text-center">{{ set.weight }}</td>
            <td class="text-center">{{ set.reps }}</td>
          </tr>
        </tbody>
      </v-table>
      <p class="text-center mt-4">
        <v-icon class="mr-2 mb-1">{{ weightIcon }}</v-icon
        >Total volume:&nbsp;
        <span class="font-semibold"
          >{{ session.volume }}{{ weightSuffix }}</span
        >
      </p>
    </v-card>
  </v-timeline-item>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { storeToRefs } from "pinia";
import { useDate } from "../../../composables/useDate";
const { weightIcon, weightSuffix } = storeToRefs(useUnitUtils());

const props = defineProps(["session"]);

const { day, time, dayMonthYear } = useDate(props.session.createdDate);

const router = useRouter();
const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};
</script>
