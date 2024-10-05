<template>
  <v-app-bar
    :color="isScrolled ? 'rgba(0,0,0,0.8)' : 'black'"
    prominent
    class="transition-colors duration-300 ease-in block xl:hidden"
  >
    <v-app-bar-nav-icon
      variant="text"
      color="white"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <div
      class="flex gap-2 mr-2 justify-center items-center hover:cursor-pointer"
      @click="router.push(`/`)"
    >
      <p class="text-white text-xl">Workout Tracker</p>
      <v-icon class="text-white text-xl">mdi-dumbbell</v-icon>
    </div>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :width="mobileNavWidth"
    temporary
    :scrim="false"
    class="xl:hidden top-[64px] h-[calc(100vh-64px)] flex flex-col justify-between"
  >
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
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import UserItem from "../UserItem.vue";

const { width } = useDisplay();
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const drawer = ref(false);
const router = useRouter();
const mobileNavWidth = ref(300);
const isScrolled = ref(false);

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
        title: "Progress",
        link: "/progress",
        icon: "mdi-chart-line",
      },
      {
        title: "Settings",
        link: "/settings",
        icon: "mdi-cog",
      },
    ];
  }
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 70;
};
</script>
