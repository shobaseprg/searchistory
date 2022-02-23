<template>
  <!---------- 表示 ---------->
  <div v-if="!isEditMode" class="flex">
    <!-- タイトル -->
    <div
      class="flex items-center justify-center border-[1px] border-gray-400 bg-gray-200 p-[1px] h-[25px] min-w-[70px] text-xs"
    >{{ props.formTitle }}</div>
    <div class="w-[5px]"></div>
    <!-- 表示 -->
    <div class="flex items-center h-[25px] w-[calc(100%-110px)]">{{ props.displayWord }}</div>
    <div class="w-[5px]"></div>
    <!-- 編集ボタン -->
    <button
      class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
      @click="openEditMode"
    >編集</button>
  </div>
  <!---------- フォーム ---------->
  <div v-else class="flex">
    <!-- タイトル -->
    <div
      class="flex items-center justify-center border-[1px] border-gray-400 bg-gray-200 p-[1px] h-[25px] min-w-[70px] text-xs"
    >{{ props.formTitle }}</div>
    <div class="w-[5px]"></div>
    <!-- インプット -->
    <input
      class="flex items-center border-[1px] h-[25px] border-gray-400 w-[calc(100%-110px)]"
      v-model="formModel"
    />
    <div class="w-[5px]"></div>
    <!-- 更新ボタン -->
    <button
      class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
      @click="props.updateFunc()"
    >更新</button>
    <!-- キャンセルボタン -->
    <button
      class="bg-gray-600 text-white border-[1px] border-gray-600 text-xs w-[90px] pl-2 pr-2 rounded-full"
      @click="cancel"
    >キャンセル</button>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { Ref, toRefs } from "vue";
//firebase
//store
//component
//composable
//model
//define
//define store
//logic
interface Props {
  isEditMode: Ref<boolean>,
  formTitle: string,
  displayWord: string,
  formModel: Ref<string>,
  updateFunc: () => void,
}

const props = defineProps<Props>();
const { isEditMode, formModel } = toRefs(props);

const cancel = () => {
  isEditMode.value = false;
  formModel.value = props.displayWord;
}

const openEditMode = () => {
  isEditMode.value = true;

}
</script>

<style lang="scss" scoped>
</style>
