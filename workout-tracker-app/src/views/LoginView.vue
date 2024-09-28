<template>
  <AuthLayout :isLogin="true">
    <h1 class="text-center text-3xl text-black font-bold mt-8 uppercase">
      Weolcome Back!
    </h1>
    <h2 class="text-center text-xl text-neutral-500 font-semibold mt-2">
      Login and track your workouts
    </h2>
    <form @submit.prevent="submitForm" class="mb-8">
      <v-text-field
        prepend-inner-icon="mdi-email"
        class="text-black font-semibold mt-8"
        variant="outlined"
        color="black"
        base-color="black"
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
        class="text-black font-semibold"
        variant="outlined"
        color="black"
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
        Login
      </v-btn>
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, watchEffect, ref, onBeforeMount, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { useAuthStore } from "../stores/authStore";
import { useApiErrorStore } from "../stores/apiErrorStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import AuthLayout from "../components/layout/AuthLayout.vue";

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
