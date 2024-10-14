<template>
  <v-text-field
    :label="label"
    :v-model="modelValue"
    :error-messages="errorMessages"
    @blur="onBlur"
    @input="onInput"
    clearable
    class="text-black font-semibold w-[150px]"
    variant="outlined"
    color="black"
    base-color="black"
    :suffix="suffix"
    style="font-size: 1.125rem; color: white"
    :hint="hint"
  />
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: Number,
  errorMessages: Array,
  onBlur: Function,
  onInput: Function,
  suffix: { type: String, default: "" },
  hint: String,
});

const emit = defineEmits(["update:modelValue"]);

const inputHandler = (value) => emit("update:modelValue", value);
</script>
