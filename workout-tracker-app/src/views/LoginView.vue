<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[url('/assets/man-working-out.jpg')] bg-cover w-full"
  >
    <v-card
      class="w-[400px] h-[450px] flex flex-col justify-between bg-[rgba(0,0,0,0.8)] px-4 py-6"
      rounded="lg"
    >
      <h1 class="text-center text-3xl text-white font-bold mt-8">
        Login and track your workouts
      </h1>
      <form @submit.prevent="submitForm" class="mb-8">
        <v-text-field
          prepend-inner-icon="mdi-email"
          class="text-white font-semibold"
          variant="underlined"
          color="white"
          base-color="white"
          v-model="state.email"
          :error-messages="v$.email.$errors.map((e) => e.$message)"
          label="E-mail"
          required
          @blur="v$.email.$touch"
          @input="v$.email.$touch"
          style="font-size: 1.125rem; color: white"
        >
        </v-text-field>
        <v-text-field
          type="password"
          prepend-inner-icon="mdi-lock"
          class="text-white font-semibold"
          variant="underlined"
          color="white"
          base-color="white"
          v-model="state.password"
          :error-messages="v$.password.$errors.map((e) => e.$message)"
          label="Password"
          required
          @blur="v$.password.$touch"
          @input="v$.password.$touch"
        ></v-text-field>
        <v-btn
          variant="outlined"
          color="white"
          class="me-4 w-full text-lg mt-4"
          height="45"
          type="submit"
          :loading="isLoading"
        >
          Login
        </v-btn>
      </form>
      <p class="text-center text-white font-semibold">
        Don't have an account yet?
        <v-btn variant="plain" to="/auth/register"> register</v-btn>
      </p>
    </v-card>
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
import { reactive, watchEffect, ref, onBeforeMount } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useAuthStore } from "../stores/authStore";
import { useApiErrorStore } from "../stores/apiErrorStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
const apiErrorStore = useApiErrorStore();
const { messages } = storeToRefs(apiErrorStore);
const router = useRouter();
const snackbarError = ref(false);

watchEffect(() => {
  if (messages.value.length > 0) {
    snackbarError.value = true;
  }
});

onBeforeMount(() => {
  apiErrorStore.resetMessages();
});

const initialState = {
  email: "",
  password: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
    const loginResult = await authStore.login(state);
    if (loginResult) router.push("/");
  }
}
</script>
