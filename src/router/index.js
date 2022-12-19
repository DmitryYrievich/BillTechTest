import { createRouter, createWebHistory } from "vue-router";
import AviasalesStart from "../views/AviasalesStart.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "AviasalesStart",
      component: AviasalesStart,
    },
  ],
});

export default router;
