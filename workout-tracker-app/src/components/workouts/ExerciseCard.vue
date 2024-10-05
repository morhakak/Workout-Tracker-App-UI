<template>
  <v-card
    rounded="xl"
    class="flex flex-col overflow-visible w-[350px] sm:min-w-[550px] lg:min-w-[550px] bg-[rgba(255,255,255,0.5)] items-center pb-8 pt-4 mt-6 relative"
  >
    <transition name="fade">
      <v-btn
        v-if="isEditMode"
        @click="$emit(`deleteExercise`)"
        icon="mdi-trash-can"
        class="absolute -top-6"
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
        color="rgba(255, 255,255, 0.5)"
        class="flex items-center px-4 mt-2 transition-all duration-300 w-[320px] h-[60px] sm:w-[400px] lg:[550px]"
        :class="{
          '-translate-x-6 overflow-visible transition-all duration-300':
            editId === `${exercise._id}-${set._id}`,
        }"
        rounded="lg"
        @click="() => toggleEdit(exercise._id, set._id)"
      >
        <transition name="fade">
          <v-btn
            v-if="editId === `${exercise._id}-${set._id}`"
            icon="mdi-delete"
            size="small"
            class="absolute -right-10"
            @click.stop="() => $emit('deleteSet', exercise._id, set._id)"
          >
          </v-btn>
        </transition>
        <div class="flex items-center justify-evenly w-full">
          <span
            class="font-bold border p-[2px] border-black rounded-full flex items-center justify-center bg-white h-8 w-8"
          >
            {{ setIndex + 1 }}
          </span>
          <v-text-field
            variant="solo"
            type="number"
            class="font-bold text-center w-[80px] mt-5 ml-2"
            v-model.number="set.weight"
            @click.stop
            density="compact"
            suffix="Kg"
            flat
          ></v-text-field>
          <v-text-field
            variant="solo"
            type="number"
            class="font-bold text-center w-[80px] mt-5 ml-2 mr-2"
            v-model.number="set.reps"
            @click.stop
            density="compact"
            suffix="reps"
            flat
          ></v-text-field>
          <v-btn
            icon="mdi-delete"
            size="small"
            @click.stop="() => $emit('deleteSet', exercise._id, set._id)"
          >
          </v-btn>
        </div>
      </v-card>
      <v-btn
        class="mt-4 w-full"
        color="black"
        height="45"
        rounded="lg"
        variant="elevated"
        prepend-icon="mdi-plus"
        @click="() => $emit('addSet', exercise)"
      >
        Add a set</v-btn
      >
    </transition-group>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

defineProps(["exercise", "isEditMode"]);
defineEmits(["addSet", "deleteSet", "deleteExercise"]);
const editId = ref(null);
const toggleEdit = (exerciseId, setId) => {
  const id = `${exerciseId}-${setId}`;
  editId.value = editId.value === id ? null : id;
};
</script>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-move {
  transition: all 0.4s ease;
} */

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
