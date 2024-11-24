import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useApiErrorStore } from "../../../stores/apiErrorStore";

export const useAuthStore = defineStore("authStore", () => {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/auth`;
  console.log(BASE_URL);

  const apiErrorStore = useApiErrorStore();
  const user = ref(null);
  const token = ref(localStorage.getItem("authToken") || null);
  const isLoading = ref(false);

  const setTokenFromLocalStorage = () => {
    token.value = localStorage.getItem("authToken");
  };

  const register = async (userCred) => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.post(`${BASE_URL}/register`, userCred);
      token.value = response.data.token;
      localStorage.setItem("authToken", token.value);
      await getLoggedUser();
      return true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (userCred) => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.post(`${BASE_URL}/login`, userCred);
      token.value = response.data.token;
      localStorage.setItem("authToken", token.value);
      await getLoggedUser();
      return true;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const getLoggedUser = async () => {
    isLoading.value = true;
    if (!token.value) return;

    try {
      const response = await axios.get(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      user.value = response.data.data;
    } catch (error) {
      console.log("Error fetching user:", error.message);
      localStorage.removeItem("authToken");
      token.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  if (token.value) {
    getLoggedUser();
  }

  const logout = () => {
    localStorage.removeItem("authToken");
    token.value = null;
    user.value = null;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    apiErrorStore.resetMessages();
    isLoading.value = true;
    try {
      const response = await axios.put(
        `${BASE_URL}/updatepassword`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      const result = response.data.success;
      if (result) token.value = response.data.token;
      return result;
    } catch (error) {
      apiErrorStore.handleErrorResponse(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    token,
    user,
    register,
    login,
    setTokenFromLocalStorage,
    getLoggedUser,
    logout,
    updatePassword,
    isLoading,
  };
});
