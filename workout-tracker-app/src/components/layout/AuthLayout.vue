<template>
    <div class="flex gap-10 items-center justify-center overflow-x-hidden">
      <div
        class="w-[450px] sm:min-w-[700px] h-[550px] sm:h-[450px] flex flex-col justify-between px-4 py-6 ml-4 "
        rounded="lg"
      >
        <div class="w-[80%] mx-auto ">
         <slot></slot>
        </div>
        <p class="text-center text-neutral-400 font-semibold">
         {{isLoginView ?  `Don't have an account yet?` : `Already registered?`}}
          <v-btn variant="plain" color="black" :to="to"> {{isLoginView ?  `Register` : `Login`}}</v-btn>
        </p>
      </div>
      <img
        class="hidden lg:block w-[50%] h-20 min-h-screen flex-1 rounded-tl-[40px] rounded-bl-[40px]"
        src="../../../public/assets/bench-press.png"
      ></img>
    </div>
    <v-snackbar color="red" v-model="snackbarError">
      <template #text>
        <div class="flex items-center gap-4">
          <v-icon>mdi-alert-circle</v-icon>
          <p class="text-lg">{{ messages[0]?.message }}</p>
        </div>
      </template>
      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="snackbarError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </template>

<script setup>
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useApiErrorStore } from '../../stores/apiErrorStore';
const props = defineProps(["isLoginView"]);
const snackbarError = ref(false);
const apiErrorStore = useApiErrorStore();
const { messages } = storeToRefs(apiErrorStore);
watchEffect(() => {
  if (messages.value.length > 0) {
    snackbarError.value = true;
  }
});

onBeforeMount(() => {
  apiErrorStore.resetMessages();
});

const to = computed(()=> {
  return props.isLoginView ? `/auth/register` : `/auth/login`
})
</script>