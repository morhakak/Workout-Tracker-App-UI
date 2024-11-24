<template>
  <v-container fluid class="px-8 flex flex-col">
    <div class="flex items-center justify-start gap-2 m-2 rounded w-max mb-4">
      <div>
        <div class="flex items-center">
          <p class="mb-0 font-semibold capitalize text-2xl">
            {{ user?.name }}
          </p>
        </div>
        <div class="flex items-center text-sm gap-3 mt-4">
          <p>{{ user?.role == `user` ? "Traniee" : `Admin` }}</p>
          <p>•</p>
          <div class="flex items-center gap-2 text-sm flex-wrap">
            <v-icon size="small">mdi-calendar-blank-outline</v-icon>
            <p class="text-wrap">
              Joined
              {{ joinedDate }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex gap-3">
        <v-card
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
        >
          <v-icon size="xs">mdi-email-outline</v-icon>
          <p class="text-sm text-wrap">{{ user?.email }}</p>
        </v-card>
        <v-card
          v-if="user?.phone"
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
        >
          <v-icon size="xs">mdi-phone-outline</v-icon>
          <p class="text-sm text-wrap">{{ user?.phone }}</p>
        </v-card>
      </div>
    </div>
    <div>
      <div class="flex gap-3">
        <v-card
          role="button"
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
          @click="
            () => {
              console.log(`edit`);
            }
          "
        >
          <v-icon size="xs">mdi-pencil</v-icon>
          <p class="text-sm text-wrap">Edit Profile</p>
        </v-card>
        <v-card
          role="button"
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
          @click="changePasswordDialog = true"
        >
          <v-icon size="xs">mdi-lock</v-icon>
          <p class="text-sm text-wrap">Change Password</p>
        </v-card>
      </div>
    </div>
    <div class="mt-8">
      <v-card
        style="height: calc(100vh - 200px)"
        class="flex flex-col items-start min-w-[300px] max-w-max pr-4 rounded-xl pb-8 pt-8"
        elevation="5"
      >
        <div class="flex gap-2 ml-6 items-center">
          <v-icon size="x-large" icon="mdi-pulse"></v-icon>
          <h2 class="text-center text-xl tracking-wide">Activity</h2>
        </div>
        <div
          ref="elForScroll"
          v-if="activities?.length > 0"
          class="overflow-auto flex custom-scrollbar pr-10 mt-4 w-full"
        >
          <v-timeline
            direction="vertical"
            side="end"
            truncate-line="both"
            class="mt-8"
          >
            <v-timeline-item
              v-for="activity in activities"
              :key="activity"
              :icon="getIcon(activity)"
              :dot-color="getDotColor(activity)"
              size="x-small"
              class="place-self-start"
            >
              <p class="text-sm w-full text-gray-500">
                {{ activityDate(activity?.date) }}
              </p>
              <p class="text-md w-full text-wrap">
                {{ activity?.activityValue }}
              </p>
            </v-timeline-item>
          </v-timeline>
        </div>
        <v-progress-circular
          v-if="isFetching"
          size="50"
          indeterminate
          class="mt-8 self-center"
        ></v-progress-circular>
        <p class="self-center mt-6" v-if="!isFetching && !activities">
          No activities for now
        </p>
      </v-card>
    </div>
  </v-container>
  <v-dialog v-model="changePasswordDialog">
    <v-card
      max-width="600"
      title="Change Password"
      subtitle="Almost done. Enter your new password and youre all set"
      rounded="xl"
      class="p-6 mx-auto relative"
    >
      <template #title>
        <div class="flex gap-2 items-center">
          <v-icon>mdi-key</v-icon>
          <h2>Change Password</h2>
        </div>
      </template>
      <template #subtitle>
        <h3 class="text-wrap">
          Almost done. Enter your new password and youre all set
        </h3>
      </template>
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="changePasswordDialog = false"
      ></v-btn>
      <v-form @submit.prevent="changePassword">
        <v-text-field
          :type="showOld ? `text` : `password`"
          variant="outlined"
          rounded="lg"
          label="Old Password"
          v-model="oldPassword"
          :append-inner-icon="showOld ? `mdi-eye` : `mdi-eye-off`"
          @click:appendInner="showOld = !showOld"
        >
        </v-text-field>
        <v-text-field
          :type="showNew ? `text` : `password`"
          variant="outlined"
          rounded="lg"
          label="New Password"
          v-model="newPassword"
          @input="validatePassword"
          :append-inner-icon="showNew ? `mdi-eye` : `mdi-eye-off`"
          @click:appendInner="showNew = !showNew"
        >
        </v-text-field>
        <v-text-field
          :color="isNewAndConfirmPassworsMatches ? `success` : `red`"
          :type="showConfirm ? `text` : `password`"
          variant="outlined"
          rounded="lg"
          label="Confirm Password"
          v-model="confirmPassword"
          :append-inner-icon="showConfirm ? `mdi-eye` : `mdi-eye-off`"
          @click:appendInner="showConfirm = !showConfirm"
        >
        </v-text-field>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div
            class="flex items-center gap-2"
            :class="passwordRequirements.lowercase ? `text-green-500` : ``"
          >
            <v-icon size="small" v-if="passwordRequirements.lowercase"
              >mdi-check-circle</v-icon
            >
            <v-icon size="small" v-else> mdi-check-circle-outline</v-icon>
            <p>one lowercase character</p>
          </div>
          <div
            class="flex items-center gap-2"
            :class="passwordRequirements.uppercase ? `text-green-500` : ``"
          >
            <v-icon size="small" v-if="passwordRequirements.uppercase"
              >mdi-check-circle</v-icon
            >
            <v-icon size="small" v-else>mdi-check-circle-outline</v-icon>
            <p>one uppercase character</p>
          </div>
          <div
            class="flex items-center gap-2"
            :class="passwordRequirements.number ? `text-green-500` : ``"
          >
            <v-icon size="small" v-if="passwordRequirements.number"
              >mdi-check-circle</v-icon
            >
            <v-icon size="small" v-else>mdi-check-circle-outline</v-icon>
            <p>one number</p>
          </div>
          <div
            class="flex items-center gap-2"
            :class="passwordRequirements.special ? `text-green-500` : ``"
          >
            <v-icon size="small" v-if="passwordRequirements.special"
              >mdi-check-circle</v-icon
            >
            <v-icon size="small" v-else>mdi-check-circle-outline</v-icon>
            <p>one special character</p>
          </div>
          <div
            class="flex items-center gap-2"
            :class="passwordRequirements.minLength ? `text-green-500` : ``"
          >
            <v-icon size="small" v-if="passwordRequirements.minLength"
              >mdi-check-circle</v-icon
            >
            <v-icon size="small" v-else>mdi-check-circle-outline</v-icon>
            <p>8 characters minimum</p>
          </div>
        </div>
        <v-btn
          block
          :loading="isLoading"
          type="submit"
          :disabled="isChangeBtnDisabled"
          class="mt-8"
          >Change Password</v-btn
        >
      </v-form>
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbarVisible"
    :color="snackbarResult.color"
    :timeout="snackbarResult.timeout"
  >
    {{ snackbarResult.message }}
  </v-snackbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useUsersStore } from "../stores/usersStore";
import { useInfiniteScroll } from "@vueuse/core";

const authStore = useAuthStore();
const { user, isLoading } = storeToRefs(authStore);

const usersStore = useUsersStore();
const { activities, isFetching, hasFetched, hasMoreData } =
  storeToRefs(usersStore);

const changePasswordDialog = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const passwordRequirements = ref({
  lowercase: false,
  uppercase: false,
  number: false,
  special: false,
  minLength: false,
});

const snackbarVisible = ref(false);
const snackbarResult = ref({
  message: "",
  color: "",
  timeout: 2000,
});

const elForScroll = ref(null);
useInfiniteScroll(
  elForScroll,
  async () => {
    await usersStore.getActivities();
  },
  {
    distance: 10,
    interval: 1000,
    canLoadMore: () => {
      return hasMoreData;
    },
  }
);

const allRequirementsMet = computed(() =>
  Object.values(passwordRequirements.value).every((value) => value === true)
);

const isChangeBtnDisabled = computed(() => {
  return (
    !allRequirementsMet.value || newPassword.value !== confirmPassword.value
  );
});

const validatePassword = () => {
  passwordRequirements.value.lowercase = /[a-z]/.test(newPassword.value);
  passwordRequirements.value.uppercase = /[A-Z]/.test(newPassword.value);
  passwordRequirements.value.number = /[0-9]/.test(newPassword.value);
  passwordRequirements.value.special = /[^A-Za-z0-9]/.test(newPassword.value);
  passwordRequirements.value.minLength = newPassword.value.length >= 8;
};

const isNewAndConfirmPassworsMatches = computed(
  () =>
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value
);

const changePassword = async () => {
  if (!isNewAndConfirmPassworsMatches.value) return;

  const result = await authStore.updatePassword(
    oldPassword.value,
    newPassword.value
  );

  changePasswordDialog.value = false;

  snackbarVisible.value = true;
  snackbarResult.value = {
    message: result
      ? "Password was updated successfully"
      : "Error: Password was not updated",
    color: result ? "green" : "red",
    timeout: 2000,
  };
};

const joinedDate = computed(
  () => moment(user.createdAt).local().format("MMM YYYY") || "Unknown"
);

onMounted(async () => {
  if (!hasFetched.value) await usersStore.getActivities();
});

const activityDate = () => moment(user.createdAt).local().format("HH:mm, ll");

const getIcon = (activity) => {
  if (!activity) return;

  switch (activity.activityType) {
    case "weighing":
      return "mdi-scale";
    case "wircumference":
      return "mdi-tape-measure";
    case "wser":
      return "mdi-account";
    case "workout":
      return "mdi-weight-lifter";
  }
};

const getDotColor = (activity) => {
  if (!activity) return;

  switch (activity.activityType) {
    case "weighing":
      return "green";
    case "circumference":
      return "red";
    case "user":
      return "blue";
    case "workout":
      return "yellow";
  }
};
</script>
