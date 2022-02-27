<template>
  <!--■■■■■■■■■■■■■■■■■ モーダル時背景 ■■■■■■■■■■■■■■■■■-->
  <div
    @click="controlOpen(false, MODAL_TYPE.TOPIC_EDIT)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!--============= モーダル =============-->
    <div class="z-[2] w-[90%] h-[90%] p-[1em] bg-white" @click="stopEvent">
      <!---------- URL ---------->
      <div class="flex border-[1px] border-gray-400 w-[100%]">
        <div class="border-r-[1px] border-gray-400 bg-gray-200 w-[70px] text-center">URL</div>
        <input class="w-[calc(100%-90px)] outline-none pl-2 pr-2" type="text" v-model="url" />
      </div>
      <div class="h-[10px]"></div>
      <!---------- タイトル ---------->
      <div class="flex border-[1px] border-gray-400 w-[100%]">
        <div class="border-r-[1px] border-gray-400 bg-gray-200 w-[70px] text-center">タイトル</div>
        <input class="w-[calc(100%-90px)] outline-none pl-2 pr-2" type="text" v-model="title" />
      </div>
      <div class="h-[10px]"></div>
      <div class="text-[5px]">コードブロックを記載する際は文頭の```の後の言語名を入力してください。</div>

      <!---------- エディターフォーム ---------->
      <mavon-editor
        class="h-[calc(100%-110px)]"
        :toolbars="createToolbar"
        @imgAdd="imgAdd"
        language="en"
        v-model="content"
      />
      <div class="flex justify-end mt-2">
        <!---------- 更新 ---------->
        <button
          class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[130px] pl-2 pr-2 rounded-full"
          @click="updateHistory(targetHistory, selectedStatus)"
        >更新</button>
        <div class="w-2"></div>
        <!---------- 閉じる ---------->
        <button
          class="bg-gray-600 text-gray-50 border-[1px] border-gray-600 text-xs w-[130px] pl-2 pr-2 rounded-full"
          @click="controlOpen(false, MODAL_TYPE.HISTORY_EDIT); clearForm();"
        >閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed, ref } from 'vue';
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useTargetHistoryStore from "../../store/useTargetHistoryStore";
//component
//composable
import { url, title, content, files, updateHistory, imgAdd, stopEvent, clearForm } from "../../composable/post";
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl";
import { createToolbar } from "../../settings/mavonEditor";
//model
//define
//define store
const targetHistoryStore = useTargetHistoryStore();
//logic

const targetHistory = computed(() => {
  return targetHistoryStore.targetHistory;
});

url.value = targetHistory.value.url;
title.value = targetHistory.value.title;
content.value = targetHistory.value.content;
files.value = targetHistory.value.files;
const selectedStatus = ref(targetHistoryStore.targetHistory.status);

</script>

<style lang="" scoped>

</style>
