import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Home from "./components/Home.vue";
import SignUp from "./components/Auth/SignUp.vue";
import SignIn from "./components/Auth/SignIn.vue";
import HistoryBase from "./components/History/HistoryBase.vue";

const routes = [
  {
    name: "Root",
    path: "/",
    component: SignIn,
  },
  {
    name: "Home",
    path: "/home",
    component: Home,
    meta: { requiredAuth: true }
  },
  {
    name: "SignUp",
    path: "/signup",
    component: SignUp,
  },
  {
    name: "SignIn",
    path: "/signin",
    component: SignIn,
  },
  {
    name: "History",
    path: "/history",
    component: HistoryBase,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiredAuth = to.matched.some(record => record.meta.requiredAuth)
  if (requiredAuth) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next()
      } else {
        next({ path: '/signin' })
      }
    })
  } else {
    next()
  }
})

export default router;
