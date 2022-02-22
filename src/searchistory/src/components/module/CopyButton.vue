<template>
  <button
    v-if="!isCopied"
    @click="copyIt"
    class="flex items-center justify-center bg-gray-400 p-[2px] pb-1 min-h-[14px] max-h-[14px] min-w-[45px] max-w-[45px] text-xs text-white"
  >copy</button>
  <div
    v-else
    class="flex items-center justify-center bg-red-600 p-[2px] pb-1 min-h-[14px] max-h-[14px]min-w-[45px] max-w-[45px] text-xs text-white"
  >copied</div>
</template>

<script setup lang="ts">
//vue plugin
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
// import {db } from "../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
//store
//component
//composable
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
//logic
interface Props {
  copyWord: string
}
const { copyWord } = defineProps<Props>();

const isCopied = ref(false);

const copyIt = () => {
  navigator.clipboard.writeText(copyWord).then(e => {
    isCopied.value = true;
  });
  setTimeout(() => { isCopied.value = false }, 2000);
}
</script>

<style lang="scss" scoped>
</style>
