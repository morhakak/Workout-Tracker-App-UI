<template>
  <v-card
    :elevation="5"
    class="relative flex flex-col justify-center items-center pb-8 pt-8 box-border h-screen min-w-[400px] max-w-[500px] grow rounded-xl"
  >
    <v-btn
      variant="text"
      class="absolute right-6 top-6 rounded-full w-12 h-12"
      @click="$emit(`add`)"
      density="compact"
      icon="mdi-plus"
      size="x-large"
    >
    </v-btn>

    <div class="flex mb-6 justify-center items-center gap-2">
      <v-icon class="text-3xl">mdi-tape-measure</v-icon>
      <h2 class="text-center text-xl sm:text-2xl font-medium tracking-wider">
        Circumferences
      </h2>
    </div>
    <div
      class="max-h-screen overflow-y-auto px-6 space-y-10 custom-scrollbar mt-6"
    >
      <div
        v-for="circumference in normalizedCircumference"
        :key="circumference._id"
      >
        <v-table
          class="relative border box-border w-[340px] rounded-xl overflow-y-visible mt-4"
          height="640px"
          hover
        >
          <thead>
            <tr>
              <th colspan="2" class="p-0">
                <div
                  class="flex justify-center items-center gap-8 rounded-t-xl w-full py-2 px-4"
                >
                  <p class="text-[14px]">
                    {{ dateFormatter.getDayMonthYear(circumference.date) }}
                  </p>
                  <div class="flex gap-2">
                    <v-btn
                      class="border"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="() => prepareUpdateCircumference(circumference)"
                    ></v-btn>
                    <v-btn
                      class="text-red-500 border"
                      size="x-small"
                      icon="mdi-trash-can-outline"
                      @click="() => prepareDeleteCircumference(circumference)"
                    ></v-btn>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th class="text-left text-base">Body Part</th>
              <th class="text-left text-no-wrap text-base">
                Circumference ({{ lengthSuffix }})
              </th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="list">
              <tr
                v-for="[key, value] in Object.entries(circumference).filter(
                  ([key]) => !['_id', '__v', 'userId', `date`].includes(key)
                )"
                :key="key"
              >
                <td class="text-left tracking-wider text-no-wrap text-[16px]">
                  {{ transformString(key) }}
                </td>
                <td class="text-center tracking-wider text-[16px]">
                  <span>{{ value }}</span>
                </td>
              </tr>
            </TransitionGroup>
          </tbody>
        </v-table>
      </div>
      <div class="flex justify-center">
        <v-btn
          v-if="hasMoreData"
          prepend-icon="mdi-reload"
          :loading="isFetching"
          @click="() => measurementsStore.fetchMeasurements()"
          class="mt-2 mx-auto border rounded-lg"
        >
          Load More
        </v-btn>
      </div>
    </div>
    <p
      v-if="!isFetching && normalizedCircumference.length == 0 && !hasMoreData"
    >
      There are no measuremnets yet
    </p>
  </v-card>
  <DeleteDialog
    v-model:isOpen="deleteDialog"
    :message="`Are you sure you want to delete this circumference?`"
    :isLoading="isLoading"
    @confirm="deleteMeasuremnet"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMeasurementsStore } from "../stores/measurementsStore";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { onBeforeUnmount, onMounted, ref } from "vue";
import DeleteDialog from "../../../components/UI/DeleteDialog.vue";
import { useDate } from "../../../composables/useDate";

const emits = defineEmits(["update-circumference", "add"]);

const { lengthSuffix } = storeToRefs(useUnitUtils());
const measurementsStore = useMeasurementsStore();
const {
  normalizedCircumference,
  isFetching,
  isLoading,
  hasMoreData,
  circumferenceToUpdate,
  hasFetched,
} = storeToRefs(measurementsStore);
const deleteDialog = ref(false);
const circumferenceToDelete = ref(null);

const dateFormatter = useDate();

onMounted(async () => {
  if (!hasFetched.value) await measurementsStore.fetchMeasurements();
});

const onAdded = async () => {
  await measurementsStore.fetchMeasurements();
};

const deleteMeasuremnet = async () => {
  if (circumferenceToDelete.value && circumferenceToDelete.value._id) {
    await measurementsStore.deleteCircumference(
      circumferenceToDelete.value._id
    );
    deleteDialog.value = false;
  }
  circumferenceToDelete.value = null;
};

const dateWrapper = (date) => {
  const [day, weekday, time] = date.split(`,`);
  return { day, weekday, time };
};

const formattedDate = (date) => dateWrapper(toLocalDate(date));

function transformString(str) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

const prepareDeleteCircumference = (circumference) => {
  circumferenceToDelete.value = { ...circumference };
  deleteDialog.value = true;
};

const prepareUpdateCircumference = (circumference) => {
  circumferenceToUpdate.value = { ...circumference };
  emits("update-circumference");
};
</script>
