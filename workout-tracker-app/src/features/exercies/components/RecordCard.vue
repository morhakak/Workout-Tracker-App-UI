<template>
  <v-card
    v-if="!isLoading"
    class="w-[330px] h-[112px] box-border p-4 rounded-xl border-[1px] border-white"
  >
    <v-card-title class="flex gap-2 items-center">
      <v-icon>{{ computedIcon }}</v-icon>
      <h2>{{ recordType }}: {{ value }}{{ selectedUnit }}</h2>
    </v-card-title>
    <v-card-subtitle class="text-wrap"
      ><v-icon>mdi-weight-lifter</v-icon> You did it in
      <span
        class="font-semibold hover:cursor-pointer"
        @click="() => navigateToWorkout(workoutId)"
      >
        {{ workoutName }}</span
      >
    </v-card-subtitle>
  </v-card>

  <v-skeleton-loader
    v-else
    height="144"
    class="w-[330px] box-border p-4 rounded-xl"
  />
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  isLoading: {
    type: Boolean,
  },
  value: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: "mdi-info",
    required: true,
  },
  recordType: {
    type: String,
    required: true,
  },
  workoutId: {
    type: String,
  },
  workoutName: {
    type: String,
  },
  unit: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const navigateToWorkout = (id) => {
  router.push({ name: "workout", params: { id } });
};

const { weightIcon, weightSuffix } = storeToRefs(useUnitUtils());

const selectedUnit = computed(() => {
  if (props.unit) return weightSuffix.value;
});

const computedIcon = computed(() => {
  if (!props.unit || !props.recordType == "1RM") return props.icon;

  return weightIcon.value;
});
</script>
