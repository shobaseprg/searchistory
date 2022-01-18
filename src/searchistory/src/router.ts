import Vue from "vue";
import * as VueRouter from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import HelloWorld from "./components/HelloWorld.vue";
import Hoge from "./components/Hoge.vue";
import SignUp from "./components/Auth/SignUp.vue";

const routes = [
  {
    path: "/",
    component: HelloWorld,
  },
  {
    path: "/hoge",
    component: Hoge,
  },
  {
    path: "/signup",
    component: SignUp,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
