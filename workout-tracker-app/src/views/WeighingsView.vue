<template>
  <v-container class="flex flex-col items-center gap-8">
    <v-card class="px-12 w-[500px] rounded-xl pb-8 pt-8">
      <h1 class="text-center text-3xl font-bold mb-2">Weighings</h1>
      <UnitSelector />
      <v-card class="px-6 rounded-xl mb-8 mt-8 pb-8 border-[1px] border-white">
        <WeightForm />
      </v-card>
    </v-card>
    <v-card class="px-12 w-[500px] rounded-xl pb-8 pt-8">
      <h2 class="text-center text-3xl font-bold mb-2">History</h2>
      <v-timeline direction="vertical" side="end">
        <v-timeline-item
          v-for="weighing in weighings"
          :key="weighing._id"
          icon="mdi-scale"
          dot-color="black"
        >
          <v-card class="flex gap-6 items-center p-4 rounded-xl">
            <div class="text-sm text-wrap">
              <span>{{ formattedDate(weighing.date).day }}</span
              ><br />
              <span>{{ formattedDate(weighing.date).weekday }}</span
              ><br />
              <span>{{ formattedDate(weighing.date).time }}</span>
            </div>
            <span class="text-lg">{{ weighing.value }}kg</span>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import WeightForm from "../components/measurements/WeightForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import { useMeasurementsStore } from "../stores/measurementsStore";
import { storeToRefs } from "pinia";

const measurementsStore = useMeasurementsStore();
const { weighings, isLoading } = storeToRefs(measurementsStore);

onMounted(async () => {
  await measurementsStore.fetchWeighings();
  console.log(weighings.value);
});

const { toLocalDate } = useDateFormatter();

const dateWrapper = (date) => {
  const [day, weekday, time] = date.split(`,`);
  return { day, weekday, time };
};

const formattedDate = (date) => dateWrapper(toLocalDate(date));
</script>
