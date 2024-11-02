<template>
  <form
    @submit.prevent="submitForm"
    class="relative flex justify-center items-center"
  >
    <v-tooltip v-model="show" location="left">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" color="grey-lighten-1" class="self-start">
          mdi-help-circle-outline</v-icon
        >
      </template>
      <div class="w-[200px]">
        <p class="font-semibold">Guidelines:</p>
        <p><span class="font-semibold">1.</span> Weigh yourself once a week</p>
        <p>
          <span class="font-semibold">2.</span> Weigh yourself in the morning
        </p>
        <p><span class="font-semibold">3.</span> Track your progress</p>
        <p><span class="font-semibold">4.</span> Invest in a smart scale</p>
        <p class="text-wrap">
          <span class="font-semibold">5.</span> Stop, only if it doesnt trigger
          anxiety or disordered eating
        </p>
      </div>
    </v-tooltip>
    <div class="flex flex-col justify-center items-center gap-3">
      <MeasurementInput
        label="Weight"
        v-model="state.weight"
        :errorMessages="v$.weight.$errors.map((e) => e.$message)"
        :onBlur="v$.weight.$touch"
        :onInput="v$.weight.$touch"
        :suffix="weightSuffix"
      />
      <!-- <VDateInput label="Date input"></VDateInput> -->
      <v-btn
        class="text-lg normal-case rounded-xl mt-4"
        type="submit"
        variant="outlined"
        :loading="isAdding"
      >
        Add Weighing
      </v-btn>
    </div>
  </form>
</template>

<script setup>
import MeasurementInput from "./MeasurementInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { numeric, helpers } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import { useUnitUtils } from "../../stores/unitUtilsStore";
import { useWeighingsStore } from "../../stores/weighingsStore";

const weighingsStore = useWeighingsStore();
const { isAdding } = storeToRefs(weighingsStore);
const { weightSuffix } = storeToRefs(useUnitUtils());
const show = ref(false);
const date = ref(null);

watch(date, () => {
  const newDate = new Date(date.value);
  console.log(newDate);
});
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
