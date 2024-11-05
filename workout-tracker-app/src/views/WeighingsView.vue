<template>
  <v-container
    class="flex flex-col items-center gap-8 lg:flex-row lg:gap-5 lg:justify-center lg:items-start"
  >
    <v-card class="w-[450px] h-[330px] rounded-xl pb-8 pt-8">
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-scale</v-icon>
        <h1 class="text-center text-3xl font-medium tracking-wide">
          Track Your Weight
        </h1>
      </div>
      <UnitSelector />
      <WeightForm
        @weight-added="() => weighingsStore.fetchWeighings()"
        @weight-updated="() => weighingsStore.fetchWeighings()"
        :weighing="weighingToDelete"
        class="mt-8"
      />
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center w-[450px] max-h-screen rounded-xl pb-8 pt-8"
    >
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-clipboard-text-clock-outline</v-icon>
        <h2 class="text-center text-3xl font-medium tracking-wide">
          Weighings
        </h2>
      </div>
      <div class="max-h-screen overflow-y-auto px-6 custom-scrollbar mt-6">
        <v-timeline
          v-if="!isFetching && normalizedWeighings.length"
          direction="vertical"
          side="end"
          truncate-line="both"
          class="pt-5"
        >
          <v-timeline-item
            v-for="weighing in normalizedWeighings"
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
              <!-- <div class="flex justify-center items-center gap-2 mt-4"> -->
              <!-- <v-btn
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
                ></v-btn> -->
              <!-- </div> -->
            </template>
            <div
              class="relative flex flex-col gap-2 justify-center items-center"
            >
              <v-card
                class="flex gap-6 mr-4 mb-4 items-center justify-center text-center p-4 rounded-xl border-[1px] border-white box-border w-[120px]"
              >
                <span class="text-md font-semibold py-1 px-2 rounded-lg"
                  >{{ weighing.weight }}{{ weightSuffix }}</span
                >
              </v-card>
              <div
                class="absolute -top-4 left-[25px] flex gap-2 justify-center items-center"
              >
                <v-btn
                  size="x-small"
                  class="border"
                  icon="mdi-trash-can-outline"
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
                  icon="mdi-pencil"
                  @click="update(weighing)"
                ></v-btn>
              </div>
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
      <div v-if="!isFetching && normalizedWeighings.length == 0">
        No weighings have been added yet
      </div>
    </v-card>
    <DeleteDialog
      v-model:isOpen="deleteDialog"
      :message="`Are you sure you want to delete ${weighingToDelete?.weight}${weightSuffix} weighing?`"
      :isLoading="isLoading"
      @confirm="deleteWeighing"
    />
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import WeightForm from "../components/measurements/WeightForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import { useWeighingsStore } from "../stores/weighingsStore";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../stores/unitUtilsStore";
import DeleteDialog from "../components/UI/dialogs/DeleteDialog.vue";

const { weightSuffix } = storeToRefs(useUnitUtils());
const weighingsStore = useWeighingsStore();
const { normalizedWeighings, isFetching, isLoading, weighingToUpdate } =
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

const update = (weighing) => {
  console.log("something is going on");

  weighingToUpdate.value = { ...weighing };
};

const deleteWeighing = async () => {
  if (weighingToDelete.value && weighingToDelete.value._id) {
    await weighingsStore.deleteWeighing(weighingToDelete.value._id);
    deleteDialog.value = false;
    weighingToUpdate.value = { weight: 0.0 };
  }
  weighingToDelete.value = {};
};
</script>
