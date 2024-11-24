<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="updateDialogVisibility"
    width="auto"
  >
    <v-card
      class="justify-center items-center w-[340px] sm:w-[400px] lg:w-[450px] pb-3 relative py-6 text-center"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="closeDialog"
      ></v-btn>
      <template #title> {{ title }} </template>
      <template #text>
        <p class="text-lg">
          {{ message }}
        </p>
      </template>
      <template v-slot:actions>
        <div class="flex gap-2">
          <v-btn
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Cancel"
            width="120"
            @click="closeDialog"
          ></v-btn>
          <v-btn
            :color="confirmButtonColor"
            rounded="lg"
            variant="flat"
            class="ms-auto"
            :text="confirmButtonText"
            width="120"
            :loading="isLoading"
            @click="confirmDelete"
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineEmits } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: { type: String, default: "Delete Confirmation" },
  message: {
    type: String,
    default: "Are you sure you want to delete this item?",
  },
  confirmButtonText: { type: String, default: "Delete" },
  confirmButtonColor: { type: String, default: "red" },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:isOpen", "confirm"]);

function closeDialog() {
  emit("update:isOpen", false);
}

function confirmDelete() {
  emit("confirm");
}

function updateDialogVisibility(value) {
  emit("update:isOpen", value);
}
</script>
