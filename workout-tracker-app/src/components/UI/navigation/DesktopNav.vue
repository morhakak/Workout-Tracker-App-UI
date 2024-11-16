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
    <NavigationLinks class="px-2" />
    <template #append>
      <UserMenu @logout="$emit(`logout`)" />
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import NavigationLinks from "./NavigationLinks.vue";
import UserMenu from "./UserMenu.vue";

defineEmits(["logout"]);
</script>
