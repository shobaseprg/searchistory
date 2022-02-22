<template>
  <div :class="outerClass">
    <div class="border-r-[1px] border-gray-400 max-w-[53px] min-w-[53px] text-center">{{ title }}</div>
    <div class="w-[calc(100%-53px)] bg-white">{{ content }}</div>
    <div class="flex items-center bg-white h-[100%] pr-[1px]">
      <CopyButton :copyWord="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { useRoute, useRouter } from 'vue-router'
//firebase
import { getAuth, signOut } from 'firebase/auth';
//store
//component
import CopyButton from "../../module/CopyButton.vue"
//composable
//model
//define
//define store
//logic
interface Props {
  title: string,
  content: string,
  minusWith: string,
}

const props = defineProps<Props>();

const outerClass = `flex items-center border-[1px] border-gray-400 bg-gray-200 w-[calc(100%-${props.minusWith}px)]`;
</script>

<style lang="scss" scoped>
</style>
