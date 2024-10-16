<template>
  <v-container class="flex flex-col items-center">
    <v-card class="px-6 w-[600px] rounded-xl">
      <h1 class="text-center text-3xl font-bold mt-8">Body Measurements</h1>
      <h2 class="text-center text-xl font-semibold mt-6 mb-4">
        Height and Weight
      </h2>
      <form
        @submit.prevent="submitForm"
        class="mb-8 grid grid-cols-2 justify-items-center gap-3"
      >
        <MeasurementInput
          label="Height"
          v-model="state.height"
          :error-messages="v$.height.$errors.map((e) => e.$message)"
          @blur="v$.height.$touch"
          @input="v$.height.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Weight"
          v-model="state.weight"
          :error-messages="v$.weight.$errors.map((e) => e.$message)"
          @blur="v$.weight.$touch"
          @input="v$.weight.$touch"
          :suffix="weightSuffix"
          class="justify-self-start"
        />
        <h2 class="text-center text-xl font-semibold col-span-2 mb-4">
          Circumference Measurements
        </h2>
        <MeasurementInput
          label="Neck"
          v-model="state.neck"
          :error-messages="v$.neck.$errors.map((e) => e.$message)"
          @blur="v$.neck.$touch"
          @input="v$.neck.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Shoulders"
          v-model="state.shoulders"
          :error-messages="v$.shoulders.$errors.map((e) => e.$message)"
          @blur="v$.shoulders.$touch"
          @input="v$.shoulders.$touch"
          :suffix="lengthSuffix"
          class="justify-self-start"
        />
        <MeasurementInput
          label="Chest"
          v-model="state.chest"
          :error-messages="v$.chest.$errors.map((e) => e.$message)"
          @blur="v$.chest.$touch"
          @input="v$.chest.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Right Arm"
          v-model="state.rightArm"
          :error-messages="v$.rightArm.$errors.map((e) => e.$message)"
          @blur="v$.rightArm.$touch"
          @input="v$.rightArm.$touch"
          :suffix="lengthSuffix"
          class="justify-self-start"
        />
        <MeasurementInput
          label="Left Arm"
          v-model="state.leftArm"
          :error-messages="v$.leftArm.$errors.map((e) => e.$message)"
          @blur="v$.leftArm.$touch"
          @input="v$.leftArm.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Waist"
          v-model="state.waist"
          :error-messages="v$.waist.$errors.map((e) => e.$message)"
          @blur="v$.waist.$touch"
          @input="v$.waist.$touch"
          :suffix="lengthSuffix"
          class="justify-self-start"
        />
        <MeasurementInput
          label="Right Thigh"
          v-model="state.rightThigh"
          :error-messages="v$.rightThigh.$errors.map((e) => e.$message)"
          @blur="v$.rightThigh.$touch"
          @input="v$.rightThigh.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Left Thigh"
          v-model="state.leftThigh"
          :error-messages="v$.leftThigh.$errors.map((e) => e.$message)"
          @blur="v$.leftThigh.$touch"
          @input="v$.leftThigh.$touch"
          :suffix="lengthSuffix"
          class="justify-self-start"
        />
        <MeasurementInput
          label="Right Calf"
          v-model="state.rightCalf"
          :error-messages="v$.rightCalf.$errors.map((e) => e.$message)"
          @blur="v$.rightCalf.$touch"
          @input="v$.rightCalf.$touch"
          :suffix="lengthSuffix"
          class="justify-self-end"
        />
        <MeasurementInput
          label="Left Calf"
          v-model="state.leftCalf"
          :error-messages="v$.leftCalf.$errors.map((e) => e.$message)"
          @blur="v$.leftCalf.$touch"
          @input="v$.leftCalf.$touch"
          :suffix="lengthSuffix"
          class="justify-self-start"
        />
        <v-btn
          color="black"
          class="text-lg mt-4 col-span-2 w-[57%]"
          height="45"
          type="submit"
        >
          Add Measuremnt
        </v-btn>
      </form>
    </v-card>
  </v-container>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { numeric, required } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import MeasurementInput from "../components/measurements/MeasurementInput.vue";
import { useAppSettingsStore } from "../stores/AppSettingsStore";
import { storeToRefs } from "pinia";

const initialState = {
  height: 0.0,
  weight: 0.0,
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
  height: { required, numeric },
  weight: { required, numeric },
  neck: { required, numeric },
  shoulders: { required, numeric },
  chest: { required, numeric },
  rightArm: { required, numeric },
  leftArm: { required, numeric },
  waist: { required, numeric },
  rightThigh: { required, numeric },
  leftThigh: { required, numeric },
  rightCalf: { required, numeric },
  leftCalf: { required, numeric },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
  }
}

const appSettings = useAppSettingsStore();
const lengthSuffix = computed(() => appSettings.getUnitSuffix("length"));
const weightSuffix = computed(() => appSettings.getUnitSuffix("weight"));
</script>
