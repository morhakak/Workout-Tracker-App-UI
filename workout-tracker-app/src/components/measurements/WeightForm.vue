<template>
  <div class="flex mt-6 mb-6 justify-center gap-2">
    <v-icon class>mdi-scale</v-icon>
    <h2 class="text-center text-xl font-semibold">Track Your Weight</h2>
  </div>
  <form @submit.prevent="submitForm" class="flex gap-3 px-12">
    <!-- <MeasurementInput
      label="Height"
      v-model="state.height"
      :errorMessages="v$.height.$errors.map((e) => e.$message)"
      :onBlur="v$.height.$touch"
      :onInput="v$.height.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    /> -->

    <MeasurementInput
      label="Weight"
      v-model="state.weight"
      :errorMessages="v$.weight.$errors.map((e) => e.$message)"
      :onBlur="v$.weight.$touch"
      :onInput="v$.weight.$touch"
      :suffix="weightSuffix"
    />
    <v-btn
      color="black"
      class="text-lg normal-case w-min"
      height="56"
      type="submit"
      :loading="isAddWeightLoading"
    >
      Add
    </v-btn>
  </form>
</template>

<script setup>
import MeasurementInput from "./MeasurementInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { numeric, helpers } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { useUnitUtils } from "../../stores/unitUtilsStore";
import { useMeasurementsStore } from "../../stores/measurementsStore";

const measurementsStore = useMeasurementsStore();
const { isAddWeightLoading } = storeToRefs(measurementsStore);
const { weightSuffix } = storeToRefs(useUnitUtils());

const initialState = {
  weight: 0.0,
};

const state = reactive({
  ...initialState,
});

const greaterThanZero = (value) => parseInt(value) > 0;

const rules = {
  weight: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
    await measurementsStore.addWeight(state);
    await measurementsStore.fetchWeighings();
  }
}
</script>
