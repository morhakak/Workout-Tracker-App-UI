<template>
  <v-container
    fluid
    class="flex flex-col items-center gap-8 lg:flex-row lg:gap-5 lg:justify-center lg:items-start"
  >
    <v-card class="w-[450px] rounded-xl pb-8 pt-8">
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-scale</v-icon>
        <h1 class="text-center text-3xl font-semibold tracking-wide">
          Track Your Weight
        </h1>
      </div>
      <UnitSelector />
      <WeightForm @weightAdded="onWeightAdded" class="mt-8" />
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center w-[450px] max-h-screen rounded-xl pb-8 pt-8"
    >
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-clipboard-text-clock-outline</v-icon>
        <h2 class="text-center text-3xl font-semibold tracking-wide">
          History
        </h2>
      </div>
      <div class="max-h-screen overflow-y-auto px-6 custom-scrollbar mt-6">
        <v-timeline
          v-if="!isFetching"
          direction="vertical"
          side="end"
          truncate-line="both"
        >
          <v-timeline-item
            v-for="(weighing, i) in normalizedWeighings"
            :key="weighing._id"
            icon="mdi-scale"
            dot-color="black"
          >
            <template #opposite>
              <div class="flex gap-3 text-md items-center">
                <v-icon>mdi-calendar-clock</v-icon>
                <div class="text-xs text-wrap">
                  <span>{{ formattedDate(weighing.date).day }}</span
                  ><br />
                  <span>{{ formattedDate(weighing.date).weekday }}</span
                  ><br />
                  <span>{{ formattedDate(weighing.date).time }}</span>
                </div>
              </div>
              <div class="flex justify-center items-center gap-2 mt-4">
                <v-btn
                  size="x-small"
                  icon="mdi-trash-can-outline"
                  class="border"
                  variant="text"
                  @click="
                    () => {
                      weighingToDelete = { ...weighing };
                      deleteDialog = true;
                    }
                  "
                ></v-btn>
                <v-btn
                  size="x-small"
                  class="border"
                  variant="text"
                  icon="mdi-pencil"
                ></v-btn>
              </div>
            </template>
            <div class="flex items-center">
              <v-card
                class="flex gap-6 mr-4 items-center justify-center text-center p-4 rounded-xl border-[1px] border-white box-border w-[120px]"
              >
                <span class="text-md font-semibold py-1 px-2 rounded-lg"
                  >{{ weighing.value }}{{ weightSuffix }}</span
                >
              </v-card>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
      <v-progress-circular
        v-if="isFetching"
        size="50"
        indeterminate
        class="mt-8"
      ></v-progress-circular>
    </v-card>
    <DeleteDialog
      v-model:isOpen="deleteDialog"
      :message="`Are you sure you want to delete ${weighingToDelete?.value}${weightSuffix} weighing?`"
      :isLoading="isLoading"
      @confirm="deleteWeighing"
    />
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import WeightForm from "../components/measurements/WeightForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import { useWeighingsStore } from "../stores/weighingsStore";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../stores/unitUtilsStore";
import DeleteDialog from "../components/UI/dialogs/DeleteDialog.vue";

const { weightSuffix } = storeToRefs(useUnitUtils());
const weighingsStore = useWeighingsStore();
const { normalizedWeighings, isFetching, isLoading } =
  storeToRefs(weighingsStore);
const deleteDialog = ref(false);
const weighingToDelete = ref(null);

onMounted(async () => {
  await weighingsStore.fetchWeighings();
});

const { toLocalDate } = useDateFormatter();

const dateWrapper = (date) => {
  const [day, weekday, time] = date.split(`,`);
  return { day, weekday, time };
};

const formattedDate = (date) => dateWrapper(toLocalDate(date));

const onWeightAdded = async () => {
  await weighingsStore.fetchWeighings();
};

const deleteWeighing = async () => {
  if (weighingToDelete.value && weighingToDelete.value._id) {
    await weighingsStore.deleteWeighing(weighingToDelete.value._id);
    deleteDialog.value = false;
  }
  weighingToDelete.value = {};
};
</script>
