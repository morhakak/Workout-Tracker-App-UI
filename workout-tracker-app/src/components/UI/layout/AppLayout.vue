<template>
  <v-layout>
    <MobileNav v-if="token" @logout="logoutDialog = true" />
    <DesktopNav v-if="token" @logout="logoutDialog = true" />
    <v-main :class="mainClass">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
  </v-layout>
  <v-dialog v-model="logoutDialog" width="auto">
    <v-card
      class="justify-center items-center pb-3 relative py-6 text-center"
      max-width="400"
      width="400"
      height="220"
      rounded="xl"
      title=" Are you sure you want to log out?"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="logoutDialog = false"
      ></v-btn>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="tonal"
            class="ms-auto"
            text="Cancel"
            width="120"
            @click="logoutDialog = false"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="tonal"
            class="ms-auto"
            append-icon="mdi-logout"
            text="log out"
            width="120"
            @click="
              {
                authStore.logout();
                router.push(`/auth/login`);
                logoutDialog = false;
              }
            "
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../../../features/users/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import MobileNav from "../navigation/MobileNav.vue";
import DesktopNav from "../navigation/DesktopNav.vue";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const logoutDialog = ref(false);
const route = useRoute();

const mainClass = computed(() => {
  return route.path === "/auth/login" ||
    route.path === "/auth/register" ||
    route.path === "/welcome"
    ? "pt-0"
    : "pt-20 xl:pt-6";
});
</script>
