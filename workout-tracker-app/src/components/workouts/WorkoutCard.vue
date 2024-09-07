<template>
  <v-card
    class="mx-auto relative"
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
      <div class="flex justify-between items-center w-full px-1">
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
</template>

<script setup>
import { useRouter } from "vue-router";
import moment from "moment";

const toLocalDate = (utcDate) => {
  const dateLocal = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
  return dateLocal;
};

const router = useRouter();
const props = defineProps(["workout"]);
const emits = defineEmits(["deleteRequest", "toggleIsFavorite"]);

const openWorkout = () => {
  if (props.workout) {
    router.push(`/workout/${props.workout._id}`);
  }
};
</script>
