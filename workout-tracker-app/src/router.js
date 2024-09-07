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

const routes = [
  {
    path: "/",
    name: "workouts",
    component: WorkoutsView,
    meta: { requiresAuth: true, requiresLayout: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: WorkoutsView,
    meta: { requiresAuth: true, requiresLayout: false },
  },
  {
    path: "/welcome",
    name: "welcome",
    component: WelcomeView,
    meta: { requiresAuth: false, requiresLayout: false },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { requiresAuth: true, requiresLayout: false },
  },
  {
    path: "/create-workout",
    name: "create-workout",
    component: ChooseWorkoutView,
    meta: { requiresAuth: true, requiresLayout: true },
  },
  {
    path: "/workout",
    name: "new-workout",
    component: WorkoutView,
    meta: { requiresAuth: true, requiresLayout: false },
  },
  {
    path: "/workout/:id",
    name: "workout",
    component: WorkoutView,
    meta: { requiresAuth: true, requiresLayout: false },
  },
  {
    path: "/auth/register",
    name: "register",
    component: RegisterView,
    meta: { requiresLayout: false },
  },
  {
    path: "/auth/login",
    name: "login",
    component: LoginView,
    meta: { requiresLayout: false },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFoundView,
    meta: { requiresLayout: true },
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
