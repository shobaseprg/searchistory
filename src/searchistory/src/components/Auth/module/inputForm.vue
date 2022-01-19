<template>
  <div>
    <p>{{ formTitle }}</p>
    <input
      class="w-[20px] h-[50px] mb-10 text-center text-white border-2 border-pink-300 rounded-full duration-75;"
      type="text"
      v-model="formModel"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  formTitle: string;
  formModel: string;
}

const { formModel } = defineProps<Props>();

</script>


<style lang="" scoped>

</style>
