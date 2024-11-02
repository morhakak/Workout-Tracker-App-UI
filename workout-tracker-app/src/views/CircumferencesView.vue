<template>
  <v-container
    fluid
    class="flex flex-col items-center lg:flex-row lg:gap-5 lg:justify-center lg:items-start"
  >
    <v-card class="px-12 w-[450px] rounded-xl pb-8 pt-8 mb-8">
      <div class="flex items-center justify-center mb-4">
        <v-icon class="text-4xl">mdi-tape-measure</v-icon>
        <h1 class="text-center text-3xl font-semibold tracking-wider">
          Circumference
        </h1>
      </div>
      <UnitSelector />
      <CircumferencesForm @added="onAdded" class="mt-4" />
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center px-12 w-[500px] rounded-xl pb-8 pt-8"
    >
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-4xl">mdi-clipboard-text-clock-outline</v-icon>
        <h2 class="text-center text-3xl font-semibold tracking-wider">
          History
        </h2>
      </div>
      <div class="max-h-screen overflow-y-auto px-6 custom-scrollbar mt-6">
        <v-timeline
          v-if="!isFetching"
          direction="vertical"
          side="end"
          truncate-line="both"
          class="mb-8"
        >
          <v-timeline-item
            v-for="(measurement, i) in normalizedCircumference"
            :key="measurement._id"
            icon="mdi-tape-measure"
            dot-color="black"
          >
            <template #opposite>
              <div class="flex flex-col justify-center items-center">
                <div class="flex gap-3 text-md items-center">
                  <v-icon>mdi-calendar-clock</v-icon>
                  <div class="text-xs text-wrap">
                    <span>{{ formattedDate(measurement.date).day }}</span
                    ><br />
                    <span>{{ formattedDate(measurement.date).weekday }}</span
                    ><br />
                    <span>{{ formattedDate(measurement.date).time }}</span>
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
                        circumferenceToDelete = { ...measurement };
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
              </div>
            </template>
            <v-card
              class="mt-4 flex gap-6 items-center p-4 rounded-xl border-[1px] border-white box-border w-[200px]"
            >
              <div class="text-md py-1 w-full">
                <div v-for="(value, key) in measurement" :key="key">
                  <p
                    class="flex justify-between"
                    v-if="key !== '_id' && key !== 'date'"
                  >
                    <span class="capitalize">{{ transformString(key) }}:</span>
                    <span>{{ value }} {{ lengthSuffix }}</span>
                  </p>
                </div>
              </div>
              <!-- <v-btn
                class="absolute -top-5 left-[76px] border"
                icon="mdi-trash-can-outline"
                size="small"
                @click="
                  () => {
                    circumferenceToDelete = { ...measurement };
                    deleteDialog = true;
                  }
                "
              ></v-btn> -->
            </v-card>
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
      :message="`Are you sure you want to delete the circumference from ${toLocalDate(
        circumferenceToDelete?.date
      )}?`"
      :isLoading="isLoading"
      @confirm="deleteCircumference"
    />
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import CircumferencesForm from "../components/measurements/CircumferencesForm.vue";
import UnitSelector from "../components/UnitSelector.vue";
import { useMeasurementsStore } from "../stores/measurementsStore";
import { useUnitUtils } from "../stores/unitUtilsStore";
import { onMounted, ref } from "vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import DeleteDialog from "../components/UI/dialogs/DeleteDialog.vue";

const { lengthSuffix } = storeToRefs(useUnitUtils());
const measurementsStore = useMeasurementsStore();
const { normalizedCircumference, isFetching, isLoading } =
  storeToRefs(measurementsStore);
const deleteDialog = ref(false);
const circumferenceToDelete = ref(null);

onMounted(async () => {
  await measurementsStore.fetchMeasurements();
});

const onAdded = async () => {
  await measurementsStore.fetchMeasurements();
};

const deleteCircumference = async () => {
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
