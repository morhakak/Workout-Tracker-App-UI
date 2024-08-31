<template>
  <div>
    <v-layout>
      <v-app-bar
        :color="isScrolled ? 'rgba(0,0,0,0.8)' : 'black'"
        prominent
        class="transition-colors duration-300 ease-in"
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

      <v-navigation-drawer v-model="drawer" color="black" temporary>
        <v-list>
          <v-list-item
            class="text-lg"
            v-for="item in updateMenuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :to="item.link"
            @click="item.action"
          >
            <template #title>
              <p
                class="text-lg"
                :class="{ 'font-semibold': item.name == 'user' }"
              >
                {{ item.title }}
              </p>
            </template></v-list-item
          >
        </v-list>
        <template #append>
          <div class="p-2">
            <v-btn
              v-if="token"
              @click="() => (logoutDialog = true)"
              prepend-icon="mdi-logout"
              block
              color="red"
              variant="outlined"
              >Log out</v-btn
            >
          </div>
        </template>
      </v-navigation-drawer>
      <MainView />
    </v-layout>
  </div>
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
import MainView from "../../views/MainView.vue";
import { useRouter } from "vue-router";

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
        title: "About",
        link: "/about",
        icon: "mdi-information",
      },
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
        name: "user",
        title: `Hi ${user.value?.name}`,
        icon: "mdi-account-box",
      },
      {
        title: "Workouts",
        link: "/",
        icon: "mdi-dumbbell",
      },
      {
        title: "Favorite",
        link: "/favorite",
        icon: "mdi-heart",
      },
      {
        title: "About",
        link: "/about",
        icon: "mdi-information",
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
