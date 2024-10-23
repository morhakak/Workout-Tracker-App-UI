<template>
  <v-container class="flex flex-col items-center gap-8">
    <v-card class="px-12 w-[500px] rounded-xl pb-8 pt-8">
      <div class="flex mt-6 mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-scale</v-icon>
        <h1 class="text-center text-3xl font-semibold tracking-wide">
          Track Your Weight
        </h1>
      </div>
      <UnitSelector />
      <WeightForm @weightAdded="onWeightAdded" class="mt-8" />
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
          v-for="weighing in normalizedWeighing"
          :key="weighing._id"
          icon="mdi-scale"
          dot-color="black"
        >
          <v-card
            class="flex gap-6 items-center p-4 rounded-xl border-[1px] border-white box-border w-[200px]"
          >
            <div class="text-xs text-wrap">
              <span>{{ formattedDate(weighing.date).day }}</span
              ><br />
              <span>{{ formattedDate(weighing.date).weekday }}</span
              ><br />
              <span>{{ formattedDate(weighing.date).time }}</span>
            </div>
            <span class="text-md font-semibold py-1 px-2 rounded-lg"
              >{{ weighing.value }}{{ weightSuffix }}</span
            >
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
import { computed, onMounted } from "vue";
import WeightForm from "../components/measurements/WeightForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import { useWeighingsStore } from "../stores/weighingsStore";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../stores/unitUtilsStore";
import { convertKgToLbs } from "../utils/conversions";
import { useAppSettingsStore } from "../stores/appSettingsStore";
const { weightSuffix } = storeToRefs(useUnitUtils());
const { preferredUnit } = storeToRefs(useAppSettingsStore());

const weighingsStore = useWeighingsStore();
const { weighings, isFetching } = storeToRefs(weighingsStore);

onMounted(async () => {
  await weighingsStore.fetchWeighings();
});

const normalizedWeighing = computed(() => {
  if (preferredUnit.value === "imperial") {
    return weighings.value.map((w) => ({
      ...w,
      value: convertKgToLbs(w.value).toFixed(1),
    }));
  }
  return weighings.value.map((w) => ({ ...w, value: w.value.toFixed(1) }));
});
const { toLocalDate } = useDateFormatter();

const dateWrapper = (date) => {
  const [day, weekday, time] = date.split(`,`);
  return { day, weekday, time };
};

const formattedDate = (date) => dateWrapper(toLocalDate(date));

const onWeightAdded = async () => {
  await weighingsStore.fetchWeighings();
};
</script>
