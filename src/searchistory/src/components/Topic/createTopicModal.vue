<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlModal(false)"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <div>モーダル</div>
      <button @click="controlModal(false)">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  controlModal: (flag: boolean) => void
}
const { controlModal } = defineProps<Props>();
const stopEvent = (event: any) => {
  event.stopPropagation();
};
</script>

<style lang="" scoped>

</style>
