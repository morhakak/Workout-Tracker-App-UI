<template>
  <v-container
    fluid
    class="flex flex-col items-center lg:flex-row lg:gap-5 lg:justify-center lg:items-start"
  >
    <v-card class="px-12 w-[450px] rounded-xl pb-8 pt-8 mb-8">
      <div class="flex items-center justify-center mb-4">
        <h1 class="text-center text-3xl font-medium tracking-wider">
          Measure Your Progress
        </h1>
      </div>

      <CircumferencesForm @added="onAdded" class="mt-10" />
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center px-12 w-[500px] box-border rounded-xl pb-8 pt-8"
    >
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-tape-measure</v-icon>
        <h2 class="text-center text-3xl font-medium tracking-wider">
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
          <div
            class="flex justify-center items-center gap-8 border rounded-xl w-[80%] mx-auto p-2"
          >
            <p class="text-[14px]">
              {{ formattedDate(circumference.date).day }}
            </p>
            <div class="flex gap-2">
              <v-btn
                class="border"
                size="small"
                icon="mdi-pencil"
                @click="circumferenceToUpdate = { ...circumference }"
              ></v-btn>
              <v-btn
                class="text-red-500 border"
                size="small"
                icon="mdi-trash-can-outline"
                @click="
                  () => {
                    circumferenceToDelete = { ...circumference };
                    deleteDialog = true;
                  }
                "
              ></v-btn>
            </div>
          </div>
          <v-table
            class="relative border box-border w-[320px] rounded-xl overflow-y-visible mt-4"
            height="580px"
            hover
          >
            <thead>
              <tr>
                <th class="text-left text-[14px]">Body Part</th>
                <th class="text-left text-no-wrap text-[14px]">
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
        v-if="
          !isFetching && normalizedCircumference.length == 0 && !hasMoreData
        "
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
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import CircumferencesForm from "../components/CircumferencesForm.vue";
import UnitSelector from "../../../components/UnitSelector.vue";
import { useMeasurementsStore } from "../stores/measurementsStore";
import { useUnitUtils } from "../../../stores/unitUtilsStore";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useDateFormatter } from "../../../composables/useDateFormatter";
import DeleteDialog from "../../../components/UI/DeleteDialog.vue";

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

const { toLocalDate } = useDateFormatter();

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
</script>
