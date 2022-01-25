<template>
  <counter :disabled="disabled" />
  <child />
</template>

<script setup lang="ts">
//vue plugin
import { ref } from "vue";
//firebase
//store
//component
import Counter from "./Counter.vue";
import Child from "./Child.vue";
//composable
//model
//define
//define store
//logic
// interface Props {
//   example:string
//   }
// const {example} = defineProps<Props>();

const disabled=ref(false)
</script>

<style lang="scss" scoped>
</style>
