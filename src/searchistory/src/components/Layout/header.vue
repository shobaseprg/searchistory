<template>
  <div class="border-black border-2">
    <button @click="signout()">ログアウト</button>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router'

const auth = getAuth();
const router = useRouter()


const signout = () => {
  signOut(auth).then(() => {
    router.push('/signin');
  });
};
</script>

<style lang="scss" scoped></style>
