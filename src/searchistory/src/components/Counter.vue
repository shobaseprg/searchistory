<template>
  <p>現在のカウント:{{ count }}</p>
  <button @click="countUp">カウントアップ</button>
</template>

<script lang="ts">
export default { name: "Counter" };
</script>

<script setup lang="ts">
import { ref } from "vue";
interface Props {
  disabled?:boolean
}
const props = defineProps<Props>();
const count = ref(0);

const countUp = () => {
  if (props.disabled) return;
  count.value++;
}
</script>
