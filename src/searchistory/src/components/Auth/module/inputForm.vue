<template>
  <div>
    <p>{{ formTitle }}</p>
    <input type="text" v-model="formModel" class="border-black border-2" />
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
