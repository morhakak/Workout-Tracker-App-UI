<template>
  <AuthLayout :isLoginView="false">
    <h2 class="text-center text-3xl text-black font-bold mt-4">
      Welcome To Workout Tracker!
    </h2>
    <h2 class="text-center text-xl text-neutral-400 font-semibold mt-4">
      Create an account and track your workouts
    </h2>
    <form @submit.prevent="submitForm" class="mb-8 mt-8">
      <v-text-field
        prepend-inner-icon="mdi-account"
        class="text-black font-semibold"
        variant="outlined"
        color="black"
        base-color="black"
        v-model="state.name"
        :counter="10"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="Name"
        required
        @blur="v$.name.$touch"
        @input="v$.name.$touch"
      ></v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-email"
        class="text-black font-semibold"
        variant="outlined"
        color="black"
        base-color="black"
        v-model="state.email"
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        label="E-mail"
        required
        @blur="v$.email.$touch"
        @input="v$.email.$touch"
        style="font-size: 1.125rem; color: black"
      >
      </v-text-field>
      <v-text-field
        prepend-inner-icon="mdi-lock"
        class="text-black font-semibold"
        variant="outlined"
        color="white"
        type="password"
        base-color="black"
        v-model="state.password"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        label="Password"
        required
        @blur="v$.password.$touch"
        @input="v$.password.$touch"
      ></v-text-field>
      <v-btn
        color="black"
        class="me-4 w-full text-lg mt-4"
        height="45"
        type="submit"
        :loading="isLoading"
      >
        Register
      </v-btn>
    </form>
  </AuthLayout>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, watchEffect } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useAuthStore } from "../stores/authStore";
import { useApiErrorStore } from "../stores/apiErrorStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import AuthLayout from "../components/UI/layout/AuthLayout.vue";

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

onBeforeUnmount(() => {
  apiErrorStore.resetMessages();
});

const initialState = {
  name: "",
  email: "",
  password: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  name: { required },
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, state);

async function submitForm() {
  v$.value.$validate();

  if (!v$.value.$invalid) {
    const loginResult = await authStore.register(state);
    if (!authStore.isLoading && loginResult) {
      router.push("/");
    }
  }
}
</script>

<style scoped></style>
