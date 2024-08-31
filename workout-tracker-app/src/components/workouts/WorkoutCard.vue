<template>
  <v-card
    class="mx-auto relative border-2 border-white"
    max-width="300"
    min-width="300"
    min-height="120"
    rounded="xl"
    hover
    color="rgba(255, 255,255, 0.8)"
    @click="openWorkout"
  >
    <template #title>
      <h2 class="text-center">{{ workout.name }}</h2>
    </template>

    <v-card-actions>
      <div class="flex justify-between items-center w-full px-2">
        <p class="text-sm font-medium">
          {{ toLocalDate(workout.createdDate) }}
        </p>
        <div>
          <v-btn
            rounded="xl"
            icon
            size="small"
            @click.stop="
              () => $emit(`deleteRequest`, workout._id, workout.name)
            "
            ><v-icon size="large">mdi-delete</v-icon></v-btn
          >
          <v-btn
            rounded="xl"
            icon
            size="small"
            @click.stop="() => $emit(`toggleIsFavorite`, workout._id)"
            ><v-icon v-if="workout.isFavorite" color="red" size="large"
              >mdi-heart</v-icon
            ><v-icon v-else size="large">mdi-heart-outline</v-icon></v-btn
          >
        </div>
      </div>
    </v-card-actions>
  </v-card>
  <!-- <v-dialog v-model="deleteDialog" width="auto">
    <v-card
      class="justify-center items-center pb-3 relative py-6 text-center"
      max-width="400"
      width="400"
      height="240"
      rounded="xl"
    >
      <v-btn
        variant="plain"
        icon="mdi-close-circle-outline"
        class="absolute right-4 top-2"
        @click="deleteDialog = false"
      ></v-btn>
      <template #title> Are you sure? </template>
      <template #text>
        <p class="text-lg">
          Are you sure you want to delete {{ workout.name }} workout? This
          action cannot be undone.
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
            @click="deleteDialog = false"
          ></v-btn>
          <v-btn
            color="red"
            rounded="lg"
            variant="outlined"
            class="ms-auto"
            text="Delete"
            width="120"
            @click="()=> $emit(`deleteWorkout`,workout._id)"
          ></v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog> -->
</template>

<script setup>
import { useWorkoutStore } from "../../stores/workoutStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";

const toLocalDate = (utcDate) => {
  const dateLocal = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  return dateLocal;
};

const router = useRouter();
const workoutStore = useWorkoutStore();
const deleteDialog = ref(false);

const props = defineProps(["workout"]);
const emits = defineEmits(["deleteRequest", "toggleIsFavorite"]);

const openWorkout = () => {
  if (props.workout) {
    router.push(`/workout/${props.workout._id}`);
  }
};
</script>
