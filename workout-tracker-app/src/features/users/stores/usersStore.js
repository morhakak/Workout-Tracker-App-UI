import { defineStore, storeToRefs } from "pinia";
import { useApiErrorStore } from "../../../stores/apiErrorStore";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import axios from "axios";

export const useUsersStore = defineStore("usersStore", () => {
  const activities = ref(null);
  const apiErrorStore = useApiErrorStore();
  const isFetching = ref(false);
  const { token } = storeToRefs(useAuthStore());

  const getActivities = async () => {
    if (!token.value) return;
    apiErrorStore.resetMessages();
    isFetching.value = true;

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/activities",
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      activities.value = response.data.data;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
    } finally {
      isFetching.value = false;
    }
  };
  return { getActivities, activities, isFetching };
});
