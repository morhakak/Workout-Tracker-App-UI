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
import { ref, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import UserItem from "../../UserItem.vue";
import { useMenuItems } from "../../../composables/useMenuItems";

const { updateMenuItems } = useMenuItems();
const { width } = useDisplay();
const { token } = storeToRefs(useAuthStore());
const mobileNavWidth = ref(300);

defineEmits(["logout"]);

watchEffect(() => {
  if (width.value > 600 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 600) mobileNavWidth.value = width.value;
});
</script>
