<template>
  <v-app-bar
    color="black"
    prominent
    class="transition-colors duration-300 ease-in block xl:hidden"
  >
    <v-app-bar-nav-icon
      variant="text"
      color="white"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

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
    <NavigationLinks class="px-2" />
    <template #append>
      <UserMenu @logout="$emit(`logout`)" />
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import NavigationLinks from "./NavigationLinks.vue";
import UserMenu from "./UserMenu.vue";

const { width } = useDisplay();
const drawer = ref(false);
const router = useRouter();
const mobileNavWidth = ref(300);
const isScrolled = ref(false);
const userMenuOpen = ref(false);

defineEmits(["logout"]);

watchEffect(() => {
  if (width.value > 500 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 500) mobileNavWidth.value = width.value;
  if (userMenuOpen && width.value > 500) {
    userMenuOpen.value = false;
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
