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
    <v-list class="px-2">
      <v-list-item
        class="text-lg rounded-lg"
        prepend-icon="mdi-weight-lifter"
        to="/"
      >
        <template #title>
          <p class="text-lg">My Workouts</p>
        </template>
      </v-list-item>

      <v-list-item
        class="text-lg rounded-lg"
        prepend-icon="mdi-chart-line"
        to="/progress"
      >
        <template #title>
          <p class="text-lg">Progress</p>
        </template>
      </v-list-item>
      <v-list-group value="Measurements">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-content-paste">
            <template #title>
              <p class="text-lg">Measurments</p>
            </template>
          </v-list-item>
        </template>
        <v-list-item prepend-icon="mdi-scale" to="/measurements/weighings">
          Weighings
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-tape-measure"
          to="/measurements/circumferences"
        >
          Circumferences
        </v-list-item>
      </v-list-group>
      <v-list-item
        class="text-lg rounded-lg"
        prepend-icon="mdi-cog"
        to="/settings"
      >
        <template #title>
          <p class="text-lg">Settings</p>
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
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import UserItem from "../../UserItem.vue";
import { useMenuItems } from "../../../composables/useMenuItems";

const { updateMenuItems } = useMenuItems();
const { width } = useDisplay();
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const drawer = ref(false);
const router = useRouter();
const mobileNavWidth = ref(300);
const isScrolled = ref(false);

defineEmits(["logout"]);

watchEffect(() => {
  if (width.value > 600 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 600) mobileNavWidth.value = width.value;
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
