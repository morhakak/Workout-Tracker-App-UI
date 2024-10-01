<template>
  <v-layout>
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
      width="300"
      temporary="false"
      scrim="true"
      class="block xl:hidden"
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
            <p
              class="text-lg"
              :class="{ 'font-semibold': item.name == 'user' }"
            >
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
            @click="() => (logoutDialog = true)"
            prepend-icon="mdi-logout"
            block
            color="black"
            >Log out</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>

    <v-navigation-drawer width="300" class="top-0 bottom-0 h-auto">
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
            <p
              class="text-lg"
              :class="{ 'font-semibold': item.name == 'user' }"
            >
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
            @click="() => (logoutDialog = true)"
            prepend-icon="mdi-logout"
            block
            color="black"
            >Log out</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>
    <v-main class="pt-0">
      <router-view></router-view>
    </v-main>
  </v-layout>
  <v-dialog v-model="logoutDialog" width="auto">
    <v-card
      class="justify-center items-center pb-3 relative py-6 text-center"
      max-width="400"
      width="400"
      height="220"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="logoutDialog = false"
      ></v-btn>
      <template #title> Are you sure? </template>
      <template #text>
        <p class="text-lg">Are you sure you want to log out?</p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Cancel"
            width="120"
            @click="logoutDialog = false"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="outlined"
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import UserItem from "../UserItem.vue";

const { displayClasses } = useDisplay({ mobileBreakpoint: 600 });

const router = useRouter();

const authStore = useAuthStore();
const { token, user } = storeToRefs(authStore);

const drawer = ref(false);
const logoutDialog = ref(false);

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 70;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
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
