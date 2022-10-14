import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/preview",
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/views/main"),
    },
    {
      path: "/preview",
      name: "preview",
      component: () => import("@/views/preview"),
    },
  ],
});
