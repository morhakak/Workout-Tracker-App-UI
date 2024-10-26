<template>
  <form @submit.prevent="submitForm" class="flex gap-2 px-12">
    <v-tooltip v-model="show" location="left">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" color="grey-lighten-1">
          mdi-help-circle-outline</v-icon
        >
      </template>
      <div>
        <p>Guidelines:</p>
        <p>1. Weigh yourself once a week</p>
        <p>2. Weigh yourself in the morning</p>
        <p>3. Track your progress</p>
        <p>4. Invest in a smart scale</p>
        <p class="text-wrap">
          5. Stop, only if it doesnt trigger anxiety or disordered eating
        </p>
      </div>
    </v-tooltip>
    <MeasurementInput
      label="Weight"
      v-model="state.weight"
      :errorMessages="v$.weight.$errors.map((e) => e.$message)"
      :onBlur="v$.weight.$touch"
      :onInput="v$.weight.$touch"
      :suffix="weightSuffix"
      class="pl-12"
    />
    <v-btn
      color="black"
      class="text-lg normal-case w-min rounded-xl mr-8"
      height="56"
      type="submit"
      :loading="isAdding"
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
import { reactive, ref } from "vue";
import { useUnitUtils } from "../../stores/unitUtilsStore";
import { useWeighingsStore } from "../../stores/weighingsStore";

const weighingsStore = useWeighingsStore();
const { isAdding } = storeToRefs(weighingsStore);
const { weightSuffix } = storeToRefs(useUnitUtils());
const show = ref(false);

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

const emits = defineEmits(["weightAdded"]);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
    await weighingsStore.addWeight(state);
    emits("weightAdded");
  }
}
</script>
