<template>
  <v-container
    class="flex flex-col items-center gap-8 lg:gap-5 lg:justify-center"
  >
    <v-card class="w-[450px] h-[230px] rounded-xl pb-8 pt-8">
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-2xl">mdi-scale</v-icon>
        <h1 class="text-center text-2xl font-medium tracking-wide">
          Track Your Weight
        </h1>
      </div>
      <WeightForm
        @weight-added="fetchWeighings"
        @weight-updated="fetchWeighings"
        :weighing="weighingToDelete"
        class="mt-8"
      />
    </v-card>
    <v-card
      class="flex flex-col justify-center items-center w-[450px] rounded-xl pb-8 pt-8"
    >
      <div class="flex mb-6 justify-center items-center gap-2">
        <v-icon class="text-2xl">mdi-clipboard-text-clock-outline</v-icon>
        <h2 class="text-center text-xl font-medium tracking-wide">Weighings</h2>
      </div>
      <div class="max-h-screen px-6 custom-scrollbar overflow-y-hidden mt-4">
        <v-table height="250px" hover>
          <thead>
            <tr>
              <th class="text-center text-no-wrap text-[16px]">
                Weight ({{ weightSuffix }})
              </th>
              <th class="text-left text-[16px]">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="list">
              <tr v-for="weighing in normalizedWeighings" :key="weighing._id">
                <td class="text-center tracking-wider text-[16px]">
                  {{ weighing.weight }}
                </td>
                <td>
                  <div class="text-xs text-wrap">
                    <span>{{ formattedDate(weighing.date).day }}</span>
                    <br />
                    <span>{{ formattedDate(weighing.date).time }}</span>
                  </div>
                </td>
                <td class="text-center">
                  <div class="flex gap-2">
                    <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-pencil"
                      @click="update(weighing)"
                    ></v-btn>
                    <v-btn
                      size="small"
                      color="red"
                      variant="text"
                      icon="mdi-trash-can-outline"
                      @click="
                        () => {
                          weighingToDelete = { ...weighing };
                          deleteDialog = true;
                        }
                      "
                    ></v-btn>
                  </div>
                </td>
              </tr>
              <v-btn
                v-if="hasMoreData"
                prepend-icon="mdi-reload"
                :loading="isFetching"
                @click="fetchWeighings"
                class="mt-2 text-center"
                >load More</v-btn
              >
            </TransitionGroup>
          </tbody>
        </v-table>
      </div>
      <div v-if="!isFetching && normalizedWeighings.length == 0">
        No weighings have been added yet
      </div>
    </v-card>
    <v-card class="mx-auto text-center w-[450px] rounded-xl">
      <v-card-text>
        <v-sheet color="rgba(0, 0, 0, .12)" class="rounded-xl pb-4">
          <v-sparkline
            :labels="normalizedWeighings.map((w) => w.weight)"
            :model-value="normalizedWeighings.map((w) => w.weight)"
            color="rgba(255, 255, 255, .7)"
            height="200"
            padding="24"
            stroke-linecap="round"
            smooth
          >
            <template v-slot:label="item">
              {{ item.value }}{{ weightSuffix }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-card-text>

      <v-card-text>
        <div class="text-h4 font-weight-thin">weighings</div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-btn variant="text" block> Go to Report </v-btn>
      </v-card-actions>
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
import { onMounted, ref } from "vue";
import WeightForm from "../components/measurements/WeightForm.vue";
import { useDateFormatter } from "../composables/useDateFormatter";
import { useWeighingsStore } from "../stores/weighingsStore";
import { storeToRefs } from "pinia";
import { useUnitUtils } from "../stores/unitUtilsStore";
import DeleteDialog from "../components/UI/dialogs/DeleteDialog.vue";

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

onMounted(async () => {
  await fetchWeighings();
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

::v-deep .v-table__wrapper {
  overflow-x: hidden;
  padding-bottom: 10px;
  padding-right: 2px;
  padding-left: 2px;
}

::v-deep .v-table__wrapper::-webkit-scrollbar {
  width: 8px;
}

::v-deep .v-table__wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::v-deep .v-table__wrapper::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}
</style>
