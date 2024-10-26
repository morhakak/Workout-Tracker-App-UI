<template>
  <v-container fluid class="px-8 flex flex-col">
    <div class="flex items-center justify-start gap-2 m-2 rounded w-max mb-4">
      <div
        class="w-14 h-14 text-xl mr-4 border-[1px] border-white rounded-full flex justify-center items-center capitalize"
      >
        {{ user?.name[0] }}
      </div>
      <div>
        <p class="mb-0 font-semibold capitalize text-2xl">
          {{ user?.name }} Hakak
        </p>
        <div class="flex items-center text-sm gap-3">
          <p>{{ user?.role == `user` ? "Traniee" : `Admin` }}</p>
          <p>•</p>
          <!-- <p>Age 33</p>
          <p>•</p> -->
          <!-- <p>Yavne, Israel</p> -->
          <div class="flex items-center gap-2 text-sm">
            <v-icon>mdi-calendar-blank-outline</v-icon>
            <p>Joined {{ joinedDate }}</p>
          </div>
        </div>
        <!-- <div class="flex items-center gap-2 mt-2 text-sm">
          <v-icon>mdi-calendar-blank-outline</v-icon>
          <p>Joined {{ joinedDate }}</p>
        </div> -->
      </div>
    </div>
    <!-- <div class="w-max flex gap-6 p-2">
      <div class="flex gap-2">
        <v-icon>mdi-calendar-blank-outline</v-icon>
        <p>Joined {{ joinedDate }}</p>
      </div>
      <div class="flex gap-2">
        <v-icon>mdi-calendar-blank-outline</v-icon>
        <p>Joined {{ joinedDate }}</p>
      </div>
    </div> -->
    <div>
      <div class="flex gap-3">
        <v-card
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
        >
          <v-icon size="xs">mdi-email-outline</v-icon>
          <p class="text-sm">{{ user?.email }}</p>
        </v-card>
        <v-card
          class="w-max flex items-center gap-2 px-6 py-[0.23rem] rounded-lg mt-6"
        >
          <v-icon size="xs">mdi-phone-outline</v-icon>
          <p class="text-sm">052-6640794</p>
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
          <p class="text-sm">Edit Profile</p>
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
          <p class="text-sm">Change Password</p>
        </v-card>
      </div>
    </div>
    <div class="mt-8">
      <v-card class="flex flex-col items-start w-[500px] rounded-xl pb-8 pt-8">
        <h2 class="ml-8 text-center text-xl mb-2 tracking-wide">Activity</h2>
        <v-timeline
          direction="vertical"
          side="end"
          truncate-line="both"
          class="mt-8"
        >
          <v-timeline-item
            v-for="(measurement, i) in 5"
            :key="i"
            icon="mdi-tape-measure"
            dot-color="black"
            class="place-self-start"
          >
            <div class="text-md py-1 w-full">Create new workout</div>
          </v-timeline-item>
        </v-timeline>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore";
import moment from "moment";
import { computed } from "vue";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const joinedDate = computed(() =>
  moment(user.createdAt).local().format("MMM YYYY")
);
</script>
