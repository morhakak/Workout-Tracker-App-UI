<template>
  <v-card
    rounded="xl"
    class="flex flex-col overflow-visible w-[350px] sm:min-w-[450px] lg:min-w-[550px] items-center pb-8 pt-4 mt-6 relative"
  >
    <transition name="fade">
      <v-btn
        v-if="isEditMode"
        @click="$emit(`deleteExercise`)"
        icon="mdi-trash-can"
        class="absolute -top-6"
        :elevation="5"
      ></v-btn>
    </transition>
    <v-card-title
      class="text-center text-lg lg:text-2xl mb-2 tracking-widest"
      >{{ exercise.name }}</v-card-title
    >
    <transition-group name="fade" tag="div">
      <v-card
        v-for="(set, setIndex) in exercise.sets"
        :key="set._id"
        class="flex items-center justify-between px-4 p-2 mt-2 w-[320px] sm:w-[400px] lg:[550px] box-border"
        rounded="lg"
        :elevation="16"
      >
        <span
          class="font-semibold border-solid border-[1px] border-gray-500 text-xs p-[2px] rounded-full flex items-center justify-center h-6 w-6"
        >
          {{ setIndex + 1 }}
        </span>
        <v-text-field
          variant="solo"
          type="number"
          :max-width="100"
          hide-details
          hide-spin-buttons
          class="font-bold text-center ml-2"
          v-model.number="set.weight"
          @click.stop
          density="compact"
          :suffix="weightSuffix"
          flat
        ></v-text-field>
        <v-text-field
          variant="solo"
          hide-details
          :max-width="100"
          hide-spin-buttons
          type="number"
          class="font-bold text-center w-[20px] ml-2 mr-2"
          v-model.number="set.reps"
          @click.stop
          density="compact"
          suffix="reps"
          flat
        ></v-text-field>
        <v-btn
          icon="mdi-delete"
          variant="plain"
          size="small"
          @click.stop="() => $emit('deleteSet', exercise._id, set._id)"
          :disabled="exercise.sets.length == 1"
        >
        </v-btn>
      </v-card>
      <v-btn
        :key="`button-${Date.now.toString}`"
        class="mt-4 w-full"
        color="black"
        height="45"
        rounded="lg"
        variant="elevated"
        @click="() => $emit('addSet')"
      >
        Add a set</v-btn
      >
    </transition-group>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { storeToRefs } from "pinia";

const { weightSuffix } = storeToRefs(useUnitUtils());
defineProps(["exercise", "isEditMode"]);
defineEmits(["addSet", "deleteSet", "deleteExercise"]);
</script>

<style scoped>
.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-move {
  transition: all 0.3s ease;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
}
</style>
