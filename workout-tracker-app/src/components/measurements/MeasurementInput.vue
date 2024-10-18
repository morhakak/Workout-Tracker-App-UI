<template>
  <v-text-field
    v-model="modelValue"
    :label="label"
    :error-messages="errorMessages"
    @blur="onBlur"
    @input="onInput"
    class="font-semibold w-[110px]"
    variant="outlined"
    :suffix="suffix"
    :hint="hint"
    rounded="lg"
  />
</template>

<script setup>
const modelValue = defineModel();

const props = defineProps({
  label: String,
  errorMessages: Array,
  onBlur: Function,
  onInput: Function,
  suffix: { type: String, default: "" },
  hint: String,
});
</script>
