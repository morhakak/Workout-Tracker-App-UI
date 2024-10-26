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
          <v-list-item
            v-bind="props"
            class="rounded-lg"
            prepend-icon="mdi-content-paste"
          >
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
      <v-menu
        v-model="userMenuOpen"
        :close-on-content-click="false"
        location="top"
      >
        <template v-slot:activator="{ props }">
          <UserItem v-bind="props" />
        </template>

        <v-card :min-width="260" class="relative right-[4px] bottom-2">
          <v-list>
            <v-list-item :subtitle="role" :title="user?.name">
              <template #prepend>
                <div
                  class="w-10 h-10 text-xl border-[1px] border-white rounded-full bg-black mr-4 flex justify-center items-center capitalize"
                >
                  {{ user.name[0] }}
                </div>
              </template>
              <template v-slot:append>
                <v-btn
                  icon="mdi-account-edit"
                  variant="text"
                  to="/user-info"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <div class="flex justify-center items-center gap-3">
                <p>Light</p>
                <v-switch
                  class="flex"
                  v-model="theme"
                  false-value="light"
                  true-value="dark"
                  false-icon="mdi-white-balance-sunny"
                  true-icon="mdi-weather-night"
                />
                <p>Dark</p>
              </div>
            </v-list-item>

            <v-list-item>
              <UnitSelector />
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <div class="w-full">
              <v-btn
                v-if="token"
                @click="$emit(`logout`)"
                prepend-icon="mdi-logout"
                block
                variant="outlined"
                >Log out</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import UserItem from "../../UserItem.vue";
import { useMenuItems } from "../../../composables/useMenuItems";
import { useAppSettingsStore } from "../../../stores/appSettingsStore";
import UnitSelector from "../../UnitSelector.vue";
const appSettingsStore = useAppSettingsStore();
const { theme } = storeToRefs(appSettingsStore);

const { updateMenuItems } = useMenuItems();
const { width } = useDisplay();
const { token } = storeToRefs(useAuthStore());
const mobileNavWidth = ref(300);
const userMenuOpen = ref(false);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const role = computed(() => {
  return user?.role == `user` ? "Traniee" : `Admin`;
});

defineEmits(["logout"]);

watchEffect(() => {
  if (width.value > 600 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 600) mobileNavWidth.value = width.value;
  if (userMenuOpen && width.value > 600) {
    userMenuOpen.value = false;
  }
});
</script>
