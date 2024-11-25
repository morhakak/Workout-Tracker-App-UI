<template>
  <v-card
    height="650"
    :elevation="5"
    class="flex flex-col items-center w-[400px] max-w-[500px] overflow-hidden max-h-[700px] box-border grow rounded-xl pb-8 pt-8"
  >
    <v-btn
      variant="text"
      class="absolute right-6 top-6 rounded-full w-12 h-12"
      @click="prepereAddWeighing"
      icon="mdi-plus"
      density="compact"
      size="x-large"
      :disabled="isLoading || isFetching"
    >
    </v-btn>
    <div class="flex justify-center items-center gap-2">
      <v-icon class="text-2xl">mdi-scale</v-icon>
      <h2 class="text-center text-xl sm:text-2xl font-medium tracking-wide">
        Weighings
      </h2>
    </div>
    <div
      ref="elementForScroll"
      class="custom-scrollbar px-5 w-[400px] mt-6 flex flex-col items-center"
    >
      <v-table
        class="border-[1px] border-white box-border w-[340px] rounded-xl mt-4"
        hover
      >
        <thead>
          <tr>
            <th class="text-left text-base">Date</th>
            <th class="text-center text-no-wrap text-base">
              Weight ({{ weightSuffix }})
            </th>
            <th class="text-left text-no-wrap text-base"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="weighing in normalizedWeighings" :key="weighing._id">
            <td class="text-left tracking-wider text-no-wrap text-[16px]">
              <p class="text-xs">
                {{ dateFormatter.getDayMonthYear(weighing.date) }}
              </p>
              <p class="text-xs">
                {{ dateFormatter.getTime(weighing.date) }}
              </p>
            </td>
            <td class="text-center tracking-wider text-[16px]">
              <span>{{ weighing.weight }}</span>
            </td>
            <td>
              <div class="flex gap-2 ml-auto">
                <v-btn
                  size="small"
                  variant="text"
                  icon="mdi-pencil"
                  @click="() => prepareUpdateWeighing(weighing)"
                ></v-btn>
                <v-btn
                  size="small"
                  color="red"
                  variant="text"
                  icon="mdi-trash-can-outline"
                  @click="() => prepareDeleteWeighing(weighing)"
                ></v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div v-if="isFetching" class="flex justify-center mt-4">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </div>
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
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useWeighingsStore } from "../stores/weighingsStore";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import DeleteDialog from "../../../components/UI/DeleteDialog.vue";
import { useInfiniteScroll } from "@vueuse/core";
import { useDate } from "../../../composables/useDate";

const dateFormatter = useDate();

const { weightSuffix } = storeToRefs(useUnitUtils());
const weighingsStore = useWeighingsStore();
const {
  normalizedWeighings,
  isFetching,
  isLoading,
  weighingToUpdate,
  hasMoreData,
} = storeToRefs(weighingsStore);
const deleteDialog = ref(false);
const weighingToDelete = ref(null);
const elementForScroll = ref(null);

onMounted(async () => {
  await fetchWeighings();
});

useInfiniteScroll(
  elementForScroll,
  async () => {
    await fetchWeighings();
  },
  {
    distance: 10,
    interval: 1000,
    canLoadMore: () => {
      return hasMoreData;
    },
  }
);

const update = (weighing) => {
  weighingToUpdate.value = { ...weighing };
};

const fetchWeighings = async () => {
  await weighingsStore.fetchWeighings();
};

const deleteWeighing = async () => {
  if (weighingToDelete.value && weighingToDelete.value._id) {
    await weighingsStore.deleteWeighing(weighingToDelete.value._id);
    deleteDialog.value = false;
    weighingToUpdate.value = { weight: 0.0 };
  }
  weighingToDelete.value = {};
};

const isLastItem = (index) => {
  return index === normalizedWeighings.value.length - 1;
};

const prepareDeleteWeighing = (weighing) => {
  weighingToDelete.value = { ...weighing };
  deleteDialog.value = true;
};

const emits = defineEmits(["update-weighing", "add"]);
const prepareUpdateWeighing = (weighing) => {
  weighingToUpdate.value = { ...weighing };
  emits("update-weighing");
};

const prepereAddWeighing = () => {
  emits(`add`);
  weighingToUpdate.value = null;
};
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

:deep(.v-table__wrapper) {
  overflow-x: hidden;
}
</style>
