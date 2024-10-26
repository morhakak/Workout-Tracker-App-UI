<template>
  <div class="flex items-center justify-start gap-2 p-2 m-2 border rounded">
    <v-list class="grow">
      <v-list-item :subtitle="role" :title="user?.name" class="capitalize">
        <template #prepend>
          <div
            class="w-10 h-10 text-xl border-[1px] border-white rounded-full bg-black mr-4 flex justify-center items-center capitalize"
          >
            {{ user?.name[0] }}
          </div>
        </template>
      </v-list-item>
    </v-list>
    <v-icon @click="$emit(`openMenu`)"> mdi-unfold-more-horizontal </v-icon>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/authStore.js";
import { computed } from "vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const role = computed(() => {
  return user?.role == `user` ? "Traniee" : `Admin`;
});
</script>
