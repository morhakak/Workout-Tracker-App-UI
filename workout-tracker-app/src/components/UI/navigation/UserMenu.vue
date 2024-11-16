<template>
  <v-menu v-model="userMenuOpen" :close-on-content-click="false" location="top">
    <template v-slot:activator="{ props }">
      <UserItem v-bind="props" />
    </template>
    <v-card :min-width="260" class="relative right-[4px] bottom-2">
      <v-list>
        <v-list-item>
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
              @click="onUserInfoBtnClick"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          class="text-lg font-light flex justify-center items-center tracking-wide"
        >
          User Preferences</v-list-item
        >
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

<script setup>
import UserItem from "../../../features/users/components/UserItem.vue";
import { useAppSettingsStore } from "../../../stores/appSettingsStore";
import { useAuthStore } from "../../../features/users/stores/authStore";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import UnitSelector from "../../UnitSelector.vue";

const appSettingsStore = useAppSettingsStore();
const { theme } = storeToRefs(appSettingsStore);

const { width } = useDisplay();
const { token } = storeToRefs(useAuthStore());
const mobileNavWidth = ref(300);
const userMenuOpen = ref(false);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

const role = computed(() => {
  return user?.role == `user` ? "Traniee" : `Admin`;
});

const onUserInfoBtnClick = () => {
  userMenuOpen.value = false;
  router.push("/user-info");
};

defineEmits(["logout"]);

watchEffect(() => {
  if (width.value > 600 && width.value <= 1025) mobileNavWidth.value = 400;
  if (width.value < 600) mobileNavWidth.value = width.value;
  if (userMenuOpen && width.value > 600) {
    userMenuOpen.value = false;
  }
});
</script>
