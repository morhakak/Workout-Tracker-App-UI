import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../features/users/stores/authStore";

export function useMenuItems() {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  const updateMenuItems = computed(() => {
    if (!token.value) {
      return [
        { title: "Register", link: "/auth/register", icon: "mdi-account-plus" },
        { title: "Log in", link: "/auth/login", icon: "mdi-login" },
      ];
    } else {
      return [
        { title: "My Workouts", link: "/", icon: "mdi-weight-lifter" },
        { title: "Progress", link: "/progress", icon: "mdi-chart-line" },
        {
          title: "Measurements",
          icon: "mdi-content-paste",
          subLinks: [
            {
              title: "Weighings",
              link: "measurements/weighings",
              icon: "mdi-weight",
            },
            {
              title: "Circumferences",
              link: "measurements/circumferences",
              icon: "mdi-tape-measure",
            },
          ],
        },
        { title: "Settings", link: "/settings", icon: "mdi-cog" },
      ];
    }
  });

  return { updateMenuItems };
}
