<template>
  <v-container fluid class="px-8 flex flex-col">
    <div class="flex items-center justify-start gap-2 m-2 rounded w-max mb-4">
      <div>
        <div class="flex items-center">
          <div
            class="flex size-14 text-xl mr-4 border-[1px] border-white rounded-full justify-center items-center capitalize"
          >
            {{ user?.name[0] }}
          </div>
          <p class="mb-0 font-semibold capitalize text-2xl">
            {{ user?.name }} Hakak
          </p>
        </div>
        <div class="flex items-center text-sm gap-3 mt-4">
          <p>{{ user?.role == `user` ? "Traniee" : `Admin` }}</p>
          <p>•</p>
          <div class="flex items-center gap-2 text-sm flex-wrap">
            <v-icon size="small">mdi-calendar-blank-outline</v-icon>
            <p class="text-wrap">Joined {{ joinedDate }}</p>
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
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
        >
          <v-icon size="xs">mdi-phone-outline</v-icon>
          <p class="text-sm text-wrap">052-6640794</p>
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
          @click="
            () => {
              console.log(`change password`);
            }
          "
        >
          <v-icon size="xs">mdi-lock</v-icon>
          <p class="text-sm text-wrap">Change Password</p>
        </v-card>
      </div>
    </div>
    <div class="mt-8">
      <v-card
        class="flex flex-col items-start max-w-max pr-6 rounded-xl pb-8 pt-8"
      >
        <div class="flex gap-2 ml-6 items-center">
          <v-icon size="x-large" icon="mdi-pulse"></v-icon>
          <h2 class="text-center text-xl tracking-wide">Activity</h2>
        </div>
        <v-timeline
          v-if="!isFetching && activities?.length > 0"
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
        <v-progress-circular
          v-if="isFetching"
          size="50"
          indeterminate
          class="mt-8 self-center"
        ></v-progress-circular>
        <p v-if="!isFetching && !activities">No activities</p>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import moment from "moment";
import { computed, onMounted } from "vue";
import { useUsersStore } from "../stores/usersStore";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const usersStore = useUsersStore();
const { activities, isFetching } = storeToRefs(usersStore);

const joinedDate = computed(() =>
  moment(user.createdAt).local().format("MMM YYYY")
);

onMounted(async () => {
  await usersStore.getActivities();
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
