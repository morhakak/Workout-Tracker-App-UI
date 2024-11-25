import { defineStore, storeToRefs } from "pinia";
import { useApiErrorStore } from "../../../stores/apiErrorStore";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import axios from "axios";

export const useUsersStore = defineStore("usersStore", () => {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/activities`;
  const activities = ref([]);
  const apiErrorStore = useApiErrorStore();
  const isFetching = ref(false);
  const { token } = storeToRefs(useAuthStore());
  const hasFetched = ref(false);

  //Pagination
  const currentPage = ref(1);
  const hasMoreData = ref(true);
  const totalPages = ref(0);

  const getActivities = async () => {
    if (!token.value) return;
    apiErrorStore.resetMessages();
    isFetching.value = true;

    try {
      const response = await axios.get(
        `${BASE_URL}?page=${currentPage.value}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      activities.value.push(...response.data.data);
      hasFetched.value = true;

      currentPage.value++;

      hasMoreData.value = currentPage.value <= response.data.meta.totalPages;
      totalPages.value = response.data.meta.totalPages;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      isFetching.value = false;
    }
  };
  return { getActivities, activities, isFetching, hasFetched, hasMoreData };
});
