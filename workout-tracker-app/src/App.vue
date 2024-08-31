<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from "./components/layout/AppLayout.vue";
import { useAuthStore } from "./stores/authStore";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(async () => {
  authStore.setTokenFromLocalStorage();

  if (authStore.token) {
    await authStore.getLoggedUser();
  }
});
</script>
