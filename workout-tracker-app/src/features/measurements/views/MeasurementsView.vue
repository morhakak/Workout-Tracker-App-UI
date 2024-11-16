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
      <h2 class="text-xl">Add New Circumference</h2>
      <CircumferencesForm
        class="min-w-[400px] mt-8"
        @cancel-update="closeCircumferenceDialog"
        @updated="closeCircumferenceDialog"
        @added="closeCircumferenceDialog"
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
        @updated="closeWeighingDialog"
        @added="closeWeighingDialog"
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import CircumferencesForm from "../../circumferences/components/CircumferencesForm.vue";
import CircumferencesListCard from "../../circumferences/components/CircumferencesListCard.vue";
import WeighingsListCard from "../../weighings/components/WeighingsListCard.vue";
import WeightForm from "../../weighings/components/WeightForm.vue";
import { useMeasurementsStore } from "../../circumferences/stores/measurementsStore";
import { storeToRefs } from "pinia";
import { useWeighingsStore } from "../../weighings/stores/weighingsStore";

const { circumferenceToUpdate } = storeToRefs(useMeasurementsStore());
const { weighingToUpdate } = storeToRefs(useWeighingsStore());

const isCircumferenceDialogOpen = ref(false);

watch(isCircumferenceDialogOpen, () => {
  console.log(isCircumferenceDialogOpen.value);
});

const openCircumferenceDialog = () => {
  isCircumferenceDialogOpen.value = true;
};

const closeCircumferenceDialog = () => {
  isCircumferenceDialogOpen.value = false;
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
</script>
