<template>
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
    <!-- <v-btn
      class="text-lg col-span-2 normal-case rounded-lg"
      height="45"
      type="submit"
      variant="outlined"
      :loading="isAdding"
    >
      Add Measuremnt
    </v-btn> -->
    <div class="col-span-2 justify-center">
      <TransitionGroup name="fade">
        <div v-if="circumferenceToUpdate" class="space-x-3">
          <v-btn
            class="normal-case rounded-lg transition-all duration-300"
            variant="tonal"
            size="default"
            :loading="isAdding"
            type="submit"
            :disabled="isUnchanged"
          >
            Update
          </v-btn>
          <v-btn
            @click="cancelUpdate"
            variant="outlined"
            size="default"
            class="normal-case rounded-lg"
          >
            Discard
          </v-btn>
        </div>
        <v-btn
          v-if="!circumferenceToUpdate"
          type="submit"
          class="normal-case rounded-lg transition-all duration-300"
          variant="outlined"
          size="default"
          :loading="isAdding"
        >
          Add Measuremnt
        </v-btn>
      </TransitionGroup>
    </div>
  </form>
</template>

<script setup>
import MeasurementInput from "../../../components/MeasurementInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { numeric, helpers } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { computed, reactive, watch } from "vue";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { useMeasurementsStore } from "../stores/measurementsStore";

const { lengthSuffix } = storeToRefs(useUnitUtils());
const measurementsStore = useMeasurementsStore();
const { isAdding, circumferenceToUpdate } = storeToRefs(measurementsStore);

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

watch(
  circumferenceToUpdate,
  () => {
    if (circumferenceToUpdate.value) {
      Object.assign(state, circumferenceToUpdate.value);
    }
  },
  { immediate: true }
);

const greaterThanZero = (value) => parseInt(value) > 0;

const rules = {
  neck: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  shoulders: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  chest: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  rightArm: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  leftArm: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  waist: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  rightThigh: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  leftThigh: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  rightCalf: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
  leftCalf: {
    numeric,
    greaterThanZero: helpers.withMessage(
      "value must be greater than 0",
      greaterThanZero
    ),
  },
};

const emits = defineEmits(["added", "updated", "cancel-update"]);

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    if (circumferenceToUpdate.value == null) {
      await measurementsStore.addMeasurement(state);
      emits("added");
      return;
    }

    await measurementsStore.updateCircumference(state);
    emits("updated");
  }
}

const cancelUpdate = () => {
  circumferenceToUpdate.value = null;
  Object.assign(state, initialState);
  emits("cancel-update");
};

const isUnchanged = computed(() => {
  if (!circumferenceToUpdate.value) return false;

  return Object.keys(state).every(
    (key) => state[key] === circumferenceToUpdate.value[key]
  );
});
</script>
