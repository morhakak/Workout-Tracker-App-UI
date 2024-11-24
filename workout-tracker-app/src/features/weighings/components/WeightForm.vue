<template>
  <form
    @submit.prevent="submitForm"
    class="relative flex justify-center items-center"
  >
    <div class="flex flex-col justify-center items-center">
      <MeasurementInput
        label="Weight"
        v-model="state.weight"
        :errorMessages="v$.weight.$errors.map((e) => e.$message)"
        :onBlur="v$.weight.$touch"
        :onInput="v$.weight.$touch"
        :suffix="weightSuffix"
      />
      <TransitionGroup name="fade">
        <div v-if="weighingToUpdate" class="space-x-3">
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
          v-if="!weighingToUpdate"
          type="submit"
          class="normal-case rounded-lg transition-all duration-300"
          variant="outlined"
          size="default"
          :loading="isAdding"
        >
          Add Weighing
        </v-btn>
      </TransitionGroup>
    </div>
  </form>
</template>

<script setup>
import MeasurementInput from "../../../components/MeasurementInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { numeric, between } from "@vuelidate/validators";
import { storeToRefs } from "pinia";
import { computed, reactive, watch } from "vue";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { useWeighingsStore } from "../stores/weighingsStore";

const weighingsStore = useWeighingsStore();
const { isAdding, weighingToUpdate } = storeToRefs(weighingsStore);
const { weightSuffix } = storeToRefs(useUnitUtils());

let initialState = {
  weight: 0.0,
};

let state = reactive({
  ...initialState,
});

watch(
  weighingToUpdate,
  () => {
    if (weighingToUpdate.value) {
      Object.assign(state, weighingToUpdate.value);
    }
  },
  { immediate: true }
);

function roundToOneDecimal(value) {
  if (value && value.toString().includes(".")) {
    const decimalIndex = value.toString().indexOf(".");
    const decimalPlaces = value.toString().length - decimalIndex - 1;

    if (decimalPlaces > 1) {
      return parseFloat(value).toFixed(1);
    }
  }
  return value;
}

watch(
  () => state.weight,
  (newValue) => {
    state.weight = roundToOneDecimal(newValue);
  }
);

const isUnchanged = computed(() => {
  return (
    weighingToUpdate.value && weighingToUpdate.value.weight === state.weight
  );
});

const rules = {
  weight: {
    numeric,
    betweenValue: between(1, 999),
  },
};

const v$ = useVuelidate(rules, state);

const emits = defineEmits(["added", "updated", "cancel-update"]);

async function submitForm() {
  v$.value.$validate();
  if (!v$.value.$invalid) {
    if (weighingToUpdate.value == null) {
      emits("added", state);
      return;
    }
    emits("updated", state);
  }
}

const cancelUpdate = () => {
  emits("cancel-update");
  setTimeout(() => {
    state.weight = 0.0;
    weighingToUpdate.value = null;
  }, 1000);
};
</script>

<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
</style>
