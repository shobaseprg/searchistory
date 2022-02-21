<template>
  <div class="w-[90%] mt-[30px]">
    <p class="text-xs">{{ props.formTitle }}</p>
    <input
      class="mt-[3px] border-b-2 border-gray-400 w-[100%] border-red-50 outline-none"
      :type="props.type"
      v-model="formModelRef"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, toRefs } from "vue";
interface Props {
  formModelRef: Ref<string>
  type: string,
  formTitle: string,
}

const props = defineProps<Props>();
const { formModelRef } = toRefs(props);

</script>

<style lang="scss" scoped>
</style>
