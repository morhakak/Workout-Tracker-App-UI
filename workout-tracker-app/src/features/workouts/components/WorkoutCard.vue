<template>
  <v-card
    class="mx-auto relative box-border"
    max-width="350"
    min-width="350"
    height="140"
    rounded="xl"
    hover
    @click="openWorkout"
  >
    <template #title>
      <div class="flex items-center">
        <v-icon
          size="small"
          class="bg-black text-white rounded-full p-[16px] justify-self-center mr-4"
          >mdi-weight-lifter</v-icon
        >
        <h2 class="text-center">{{ workout?.name }}</h2>
      </div>
    </template>
    <template #subtitle>
      <span class="ml-12"> {{ workout?.exercises?.length }} exercises</span>
    </template>

    <v-card-actions>
      <div class="flex justify-between items-center w-full px-2">
        <p class="text-sm">
          {{ dayMonthYear }}, {{ day }},
          <span class="text-xs text-gray-600">{{ time }}</span>
        </p>
        <v-menu transition="slide-x-transition" location="start" offset="8">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list
            density="compact"
            slim
            class="flex items-center justify-center overflow-y-hidden py-6 px-2"
            height="40"
          >
            <v-btn
              rounded="xl"
              icon
              size="small"
              variant="plain"
              @click.stop="emitToggle"
              ><v-icon v-if="workout.isFavorite" color="yellow" size="large"
                >mdi-star</v-icon
              ><v-icon v-else size="large">mdi-star-outline</v-icon></v-btn
            >
            <v-btn
              rounded="xl"
              icon
              size="small"
              variant="plain"
              @click.stop="emitDelete"
              ><v-icon size="large">mdi-trash-can-outline</v-icon></v-btn
            >
          </v-list>
        </v-menu>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useDate } from "../../../composables/useDate";

const router = useRouter();
const props = defineProps(["workout"]);
const emits = defineEmits(["deleteRequest", "toggleIsFavorite"]);

const { day, time, dayMonthYear } = useDate(props.workout.createdDate);

const openWorkout = () => {
  if (props.workout) {
    router.push(`/workout/${props.workout._id}`);
  }
};

const emitToggle = () => {
  emits("toggleIsFavorite", props.workout._id);
};

const emitDelete = () => {
  emits("deleteRequest", props.workout._id, props.workout.name);
};
</script>
