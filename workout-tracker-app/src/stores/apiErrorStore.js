import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

export const useApiErrorStore = defineStore("apiErrorStore", () => {
  const messages = ref([]);

  const addMessage = (message) => {
    messages.value.push(message);
  };

  const resetMessages = () => {
    messages.value = [];
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      let message;
      switch (status) {
        case 400:
          message =
            data.error ??
            "Bad Request. Please check the data you have entered.";
          break;
        case 401:
          message = data.error ?? "Unauthorized. Please log in again.";
          break;
        case 403:
          message =
            data.error ??
            "Forbidden. You do not have permission to perform this action.";
          break;
        case 404:
          message =
            data.error ??
            "Not Found. The resource you are looking for could not be found.";
          break;
        case 500:
          message = data.error ?? "Server Error. Please try again later.";
          break;
        default:
          message =
            error.response.data.message || "An unexpected error occurred.";
      }

      addMessage({
        type: "error",
        message: `Error: ${message}`,
      });
    } else if (error.request) {
      addMessage({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    } else {
      addMessage({
        type: "error",
        message: `Request error: ${error.message}`,
      });
    }
  };

  return {
    messages,
    resetMessages,
    handleErrorResponse,
  };
});
