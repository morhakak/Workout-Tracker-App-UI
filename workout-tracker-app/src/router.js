import { createWebHistory, createRouter } from "vue-router";

import WorkoutsView from "./views/WorkoutsView.vue";
import ChooseWorkoutView from "./views/ChooseWorkoutView.vue";
import WorkoutView from "./views/WorkoutView.vue";
import NotFoundView from "./views/NotFoundView.vue";
import RegisterView from "./views/RegisterView.vue";
import LoginView from "./views/LoginView.vue";
import WelcomeView from "./views/WelcomeView.vue";
import { useAuthStore } from "./stores/authStore";
import AboutView from "./views/AboutView.vue";
import { storeToRefs } from "pinia";
import DashboardView from "./views/DashboardView.vue";
import ProgressView from "./views/ProgressView.vue";
import ExerciseProgressView from "./views/ExerciseProgressView.vue";
import MeasurementsView from "./views/MeasurementsView.vue";
import SettingsView from "./views/SettingsView.vue";

const routes = [
  {
    path: "/",
    name: "workouts",
    component: WorkoutsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/welcome",
    name: "welcome",
    component: WelcomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/progress",
    name: "progressView",
    component: ProgressView,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/measurements",
    name: "measurements",
    component: MeasurementsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/progress/:id",
    name: "exerciseProgressView",
    component: ExerciseProgressView,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-workout",
    name: "create-workout",
    component: ChooseWorkoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/workout",
    name: "new-workout",
    component: WorkoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/workout/:id",
    name: "workout",
    component: WorkoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/auth/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  if (to.meta.requiresAuth && !token.value) {
    next({ path: "/welcome" });
  } else if (
    token.value &&
    (to.name === "login" || to.name === "register" || to.name === "welcome")
  ) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
