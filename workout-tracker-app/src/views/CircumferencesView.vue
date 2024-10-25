<template>
  <v-container class="flex flex-col items-center">
    <v-card class="px-12 w-[500px] rounded-xl pb-8 pt-8 mb-8">
      <h1 class="text-center text-3xl font-bold mb-2">
        Circumference Measurement
      </h1>
      <UnitSelector />
      <v-card class="px-6 rounded-xl pt-8 border-[1px] border-white">
        <CircumferencesForm />
      </v-card>
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center px-12 w-[500px] rounded-xl pb-8 pt-8"
    >
      <h2 class="text-center text-3xl font-semibold mb-2 tracking-wide">
        History
      </h2>
      <v-timeline
        v-if="!isFetching"
        direction="vertical"
        side="end"
        truncate-line="both"
        class="mt-8"
      >
        <v-timeline-item
          v-for="(measurement, i) in normalizedCircumference"
          :key="measurement._id"
          icon="mdi-tape-measure"
          dot-color="black"
        >
          <template #opposite>
            <div class="text-xs text-wrap">
              <span>{{ formattedDate(measurement.date).day }}</span
              ><br />
              <span>{{ formattedDate(measurement.date).weekday }}</span
              ><br />
              <span>{{ formattedDate(measurement.date).time }}</span>
            </div>
          </template>
          <v-card
            class="flex gap-6 items-center p-4 rounded-xl border-[1px] border-white box-border w-[200px]"
          >
            <div class="text-md py-1 w-full">
              <div v-for="(value, key) in measurement" :key="key">
                <p
                  class="flex justify-between"
                  v-if="key !== '_id' && key !== 'date'"
                >
                  <span class="capitalize">{{ key }}:</span>
                  <span>{{ value }} {{ lengthSuffix }}</span>
                </p>
              </div>
              <!-- <p class="flex justify-between">
                <span>Neck:</span>
                <span>{{ measurement.neck }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Shoulders:</span>
                <span>{{ measurement.shoulders }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Chest:</span>
                <span>{{ measurement.chest }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Right Arm:</span>
                <span>{{ measurement.rightArm }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Left Arm:</span
                ><span>{{ measurement.leftArm }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Waist:</span>
                <span>{{ measurement.waist }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Right Thigh:</span>
                <span>{{ measurement.rightThigh }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Left Thigh:</span>
                <span>{{ measurement.leftThigh }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Right Calf:</span>
                <span>{{ measurement.rightCalf }} {{ lengthSuffix }}</span>
              </p>
              <p class="flex justify-between">
                <span>Left Calf:</span>
                <span>{{ measurement.leftCalf }} {{ lengthSuffix }}</span>
              </p> -->
            </div>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <v-progress-circular
        v-if="isFetching"
        size="50"
        indeterminate
        class="mt-8"
      ></v-progress-circular>
    </v-card>
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import CircumferencesForm from "../components/measurements/CircumferencesForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useMeasurementsStore } from "../stores/measurementsStore";
import { useUnitUtils } from "../stores/unitUtilsStore";
import { onMounted } from "vue";
import { useDateFormatter } from "../composables/useDateFormatter";

const { lengthSuffix } = storeToRefs(useUnitUtils());
const measurementsStore = useMeasurementsStore();
const { normalizedCircumference, isFetching } = storeToRefs(measurementsStore);

onMounted(async () => {
  await measurementsStore.fetchMeasurements();
  console.log(normalizedCircumference.value);
});

const { toLocalDate } = useDateFormatter();

const dateWrapper = (date) => {
  const [day, weekday, time] = date.split(`,`);
  return { day, weekday, time };
};

const formattedDate = (date) => dateWrapper(toLocalDate(date));
</script>
