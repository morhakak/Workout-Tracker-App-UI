<template>
  <h2 class="text-center text-xl font-semibold mt-6 mb-6">Height and Weight</h2>
  <form
    @submit.prevent="submitForm"
    class="grid grid-cols-2 justify-items-center gap-3"
  >
    <MeasurementInput
      label="Height"
      v-model="state.height"
      :errorMessages="v$.height.$errors.map((e) => e.$message)"
      :onBlur="v$.height.$touch"
      :onInput="v$.height.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Weight"
      v-model="state.weight"
      :errorMessages="v$.weight.$errors.map((e) => e.$message)"
      :onBlur="v$.weight.$touch"
      :onInput="v$.weight.$touch"
      :suffix="weightSuffix"
      class="justify-self-start"
    />
    <v-btn color="black" class="text-lg col-span-2" height="45" type="submit">
      Add Measuremnt
    </v-btn>
  </form>
</template>

<script setup>
import MeasurementInput from "./MeasurementInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { numeric } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { useUnitUtils } from "../../stores/unitUtilsStore";
const { lengthSuffix, weightSuffix } = storeToRefs(useUnitUtils());

const initialState = {
  height: 0.0,
  weight: 0.0,
};

const state = reactive({
  ...initialState,
});

const rules = {
  height: { numeric },
  weight: { numeric },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
  }
}
</script>
