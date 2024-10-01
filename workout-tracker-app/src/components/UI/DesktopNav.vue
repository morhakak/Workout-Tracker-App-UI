<template>
  <v-navigation-drawer width="300" class="top-0 bottom-0 min-h-screen">
    <div class="flex justify-start items-center p-4 gap-2 border-b">
      <div
        class="h-10 w-10 rounded-full bg-black flex justify-center items-center"
      >
        <v-icon>mdi-dumbbell</v-icon>
      </div>
      <h1 class="font-semibold text-xl">Workout Tracker</h1>
    </div>
    <v-list>
      <v-list-item
        class="text-lg"
        v-for="item in updateMenuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :to="item.link"
        @click="item.action"
        active-class="border-r-black border-r-2"
      >
        <template #title>
          <p class="text-lg" :class="{ 'font-semibold': item.name == 'user' }">
            {{ item.title }}
          </p>
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <UserItem />
      <div class="p-2">
        <v-btn
          v-if="token"
          @click="$emit(`logout`)"
          prepend-icon="mdi-logout"
          block
          color="black"
          >Log out</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import UserItem from "../UserItem.vue";

const { width } = useDisplay();
const { token } = storeToRefs(useAuthStore());
const logoutDialog = ref(false);
const mobileNavWidth = ref(300);

watchEffect(() => {
  if (width.value > 600 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 600) mobileNavWidth.value = width.value;
});

const updateMenuItems = computed(() => {
  if (!token.value) {
    return [
      {
        title: "Register",
        link: "/auth/register",
        icon: "mdi-account-plus",
      },
      {
        title: "Log in",
        link: "/auth/login",
        icon: "mdi-login",
      },
    ];
  } else {
    return [
      {
        title: "My Workouts",
        link: "/",
        icon: "mdi-weight-lifter",
      },
      {
        title: "Settings",
        link: "/settings",
        icon: "mdi-cog",
      },
    ];
  }
});
</script>
