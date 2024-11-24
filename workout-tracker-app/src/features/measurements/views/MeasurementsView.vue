<template>
  <v-container
    fluid
    class="flex flex-col items-center justify-center lg:flex-row gap-5 lg:justify-center lg:items-start"
  >
    <WeighingsListCard
      @add="openWeighingDialog"
      @update-weighing="openWeighingDialog"
    />
    <CircumferencesListCard
      @add="openCircumferenceDialog"
      @update-circumference="openCircumferenceDialog"
    />
  </v-container>
  <v-dialog v-model="isCircumferenceDialogOpen" width="auto">
    <v-card
      class="relative justify-center items-center pb-3 py-6 text-center"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="closeCircumferenceDialog"
      ></v-btn>
      <h2 class="text-xl">{{ circumferenceDialogTitle }}</h2>
      <CircumferencesForm
        class="min-w-[400px] mt-8"
        @cancel-update="closeCircumferenceDialog"
        @updated="onUpdatedCircumference"
        @added="onAddedCircumference"
      />
    </v-card>
  </v-dialog>
  <v-dialog v-model="isWeighingDialogOpen" width="auto">
    <v-card
      class="relative justify-center items-center py-8 text-center"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="closeWeighingDialog"
      ></v-btn>
      <h2 class="text-xl">{{ weighingDialogTitle }}</h2>
      <WeightForm
        class="min-w-[400px] mt-8"
        @cancel-update="closeWeighingDialog"
        @updated="onUpdatedWeighing"
        @added="onAddedWeighing"
      />
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbarVisible"
    :color="snackbarResult.color"
    :timeout="snackbarResult.timeout"
    transition="slide-y-reverse-transition"
  >
    <p class="text-lg text-center">{{ snackbarResult.message }}</p>
  </v-snackbar>
</template>

<script setup>
import { computed, ref } from "vue";
import CircumferencesForm from "../../circumferences/components/CircumferencesForm.vue";
import CircumferencesListCard from "../../circumferences/components/CircumferencesListCard.vue";
import WeighingsListCard from "../../weighings/components/WeighingsListCard.vue";
import WeightForm from "../../weighings/components/WeightForm.vue";
import { useMeasurementsStore } from "../../circumferences/stores/measurementsStore";
import { storeToRefs } from "pinia";
import { useWeighingsStore } from "../../weighings/stores/weighingsStore";
import { useDate } from "../../../composables/useDate";

const measurementsStore = useMeasurementsStore();
const { circumferenceToUpdate } = storeToRefs(measurementsStore);

const weighingsStore = useWeighingsStore();
const { weighingToUpdate } = storeToRefs(weighingsStore);

const circuDateFormatter = useDate(circumferenceToUpdate.value?.date);
const weighingDateFormatter = useDate(weighingToUpdate.value?.date);

const snackbarVisible = ref(false);
const snackbarResult = ref({
  message: "",
  color: "",
  timeout: 3000,
});

const isCircumferenceDialogOpen = ref(false);

const openCircumferenceDialog = () => {
  isCircumferenceDialogOpen.value = true;
};

const closeCircumferenceDialog = () => {
  isCircumferenceDialogOpen.value = false;
};

const circumferenceDialogTitle = computed(() => {
  return circumferenceToUpdate.value
    ? "Update circumference"
    : "Add New circumference";
});

const onAddedCircumference = async (payload) => {
  closeCircumferenceDialog();
  const result = await measurementsStore.addMeasurement(payload);
  snackbarVisible.value = true;
  snackbarResult.value = {
    message: result
      ? "New Circumference was added"
      : "Error: Circumference was not added",
    color: result ? "green" : "red",
    timeout: 10000,
  };
};

const onUpdatedCircumference = async (payload) => {
  closeCircumferenceDialog();
  const result = await measurementsStore.updateCircumference(payload);
  snackbarVisible.value = true;
  snackbarResult.value = {
    message: result
      ? `Circumference from ${circuDateFormatter.dayMonthYear.value} was updated`
      : `Error: Circumference from ${circuDateFormatter.dayMonthYear.value} was not updated`,
    color: result ? "green" : "red",
    timeout: 3000,
  };
};

const isWeighingDialogOpen = ref(false);

const openWeighingDialog = () => {
  isWeighingDialogOpen.value = true;
};

const closeWeighingDialog = () => {
  isWeighingDialogOpen.value = false;
};

const weighingDialogTitle = computed(() => {
  return weighingToUpdate.value ? "Update Weighing" : "Add New Weighing";
});

const onAddedWeighing = async (payload) => {
  closeWeighingDialog();
  const result = await weighingsStore.addWeighing(payload);
  snackbarVisible.value = true;
  snackbarResult.value = {
    message: result
      ? `New weighing was added`
      : `Error: Weighing was not added`,
    color: result ? "green" : "red",
    timeout: 3000,
  };
};

const onUpdatedWeighing = async (payload) => {
  closeWeighingDialog();
  const result = await weighingsStore.updateWeighing(payload);
  snackbarVisible.value = true;
  snackbarResult.value = {
    message: result
      ? `Weighing from ${weighingDateFormatter.dayMonthYear.value} was updated`
      : `Error: Weighing from ${weighingDateFormatter.dayMonthYear.value} was not updated`,
    color: result ? "green" : "red",
    timeout: 3000,
  };
};
</script>
