<template>
  <h2 class="text-center text-xl font-semibold col-span-2 mb-4">
    Circumference Measurements
  </h2>
  <form
    @submit.prevent="submitForm"
    class="mb-8 grid grid-cols-2 justify-items-center gap-3"
  >
    <MeasurementInput
      label="Neck"
      v-model="state.neck"
      :errorMessages="v$.neck.$errors.map((e) => e.$message)"
      :onBlur="v$.neck.$touch"
      :onnput="v$.neck.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Shoulders"
      v-model="state.shoulders"
      :errorMessages="v$.shoulders.$errors.map((e) => e.$message)"
      :onBlur="v$.shoulders.$touch"
      :onnput="v$.shoulders.$touch"
      :suffix="lengthSuffix"
      class="justify-self-start"
    />
    <MeasurementInput
      label="Chest"
      v-model="state.chest"
      :errorMessages="v$.chest.$errors.map((e) => e.$message)"
      :onBlur="v$.chest.$touch"
      :onInput="v$.chest.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Right Arm"
      v-model="state.rightArm"
      :errorMessages="v$.rightArm.$errors.map((e) => e.$message)"
      :onBlur="v$.rightArm.$touch"
      :onInput="v$.rightArm.$touch"
      :suffix="lengthSuffix"
      class="justify-self-start"
    />
    <MeasurementInput
      label="Left Arm"
      v-model="state.leftArm"
      :errorMessages="v$.leftArm.$errors.map((e) => e.$message)"
      :onBlur="v$.leftArm.$touch"
      :onInput="v$.leftArm.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Waist"
      v-model="state.waist"
      :errorMessages="v$.waist.$errors.map((e) => e.$message)"
      :onBlur="v$.waist.$touch"
      :onInput="v$.waist.$touch"
      :suffix="lengthSuffix"
      class="justify-self-start"
    />
    <MeasurementInput
      label="Right Thigh"
      v-model="state.rightThigh"
      :errorMessages="v$.rightThigh.$errors.map((e) => e.$message)"
      :onBlur="v$.rightThigh.$touch"
      :onInput="v$.rightThigh.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Left Thigh"
      v-model="state.leftThigh"
      :errorMessages="v$.leftThigh.$errors.map((e) => e.$message)"
      :onBlur="v$.leftThigh.$touch"
      :onInput="v$.leftThigh.$touch"
      :suffix="lengthSuffix"
      class="justify-self-start"
    />
    <MeasurementInput
      label="Right Calf"
      v-model="state.rightCalf"
      :errorMessages="v$.rightCalf.$errors.map((e) => e.$message)"
      :onBlur="v$.rightCalf.$touch"
      :onInput="v$.rightCalf.$touch"
      :suffix="lengthSuffix"
      class="justify-self-end"
    />
    <MeasurementInput
      label="Left Calf"
      v-model="state.leftCalf"
      :errorMessages="v$.leftCalf.$errors.map((e) => e.$message)"
      :suffix="lengthSuffix"
      class="justify-self-start"
      :validateProp="v$.leftCalf"
      :onBlur="v$.leftCalf.$touch"
      :onInput="v$.leftCalf.$touch"
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
const { lengthSuffix } = storeToRefs(useUnitUtils());

const initialState = {
  neck: 0.0,
  shoulders: 0.0,
  chest: 0.0,
  rightArm: 0.0,
  leftArm: 0.0,
  waist: 0.0,
  rightThigh: 0.0,
  leftThigh: 0.0,
  rightCalf: 0.0,
  leftCalf: 0.0,
};

const state = reactive({
  ...initialState,
});

const rules = {
  neck: { numeric },
  shoulders: { numeric },
  chest: { numeric },
  rightArm: { numeric },
  leftArm: { numeric },
  waist: { numeric },
  rightThigh: { numeric },
  leftThigh: { numeric },
  rightCalf: { numeric },
  leftCalf: { numeric },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
  }
}
</script>
