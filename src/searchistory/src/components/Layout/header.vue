<template>
  <div class="border-black border-2 flex h-[30px]">
    <p>{{ userStore.name }}さん</p>
    <button @click="signout()">ログアウト</button>
    <p @click="router.push('/home')">home</p>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router'

import useUserStore from "../../store/useUserStore";
const userStore = useUserStore();

const auth = getAuth();
const router = useRouter()

const signout = () => {
  signOut(auth).then(() => {
    router.push('/signin');
  });
};
</script>

<style lang="scss" scoped></style>
