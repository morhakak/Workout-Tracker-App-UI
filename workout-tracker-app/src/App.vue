<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from "./components/UI/layout/AppLayout.vue";
import { useAppSettingsStore } from "./stores/appSettingsStore";
import { useAuthStore } from "./features/users/stores/authStore";
import { onMounted } from "vue";

const authStore = useAuthStore();
const appSettingsStore = useAppSettingsStore();

onMounted(async () => {
  authStore.setTokenFromLocalStorage();
  appSettingsStore.setVuetifyTheme();

  if (authStore.token) {
    await authStore.getLoggedUser();
  }
});
</script>
