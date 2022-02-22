<template>
  <!--■■■■■■■■■■■■■■■■■ モーダル時背景 ■■■■■■■■■■■■■■■■■-->
  <div
    @click="controlOpen(false, MODAL_TYPE.TOPIC_CREATE)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!--============= モーダル =============-->
    <div class="z-[2] w-[90%] h-[90%] p-[1em] bg-white" @click="stopEvent">
      <!---------- タイトル ---------->
      <div class="flex border-[1px] border-gray-400 w-[100%]">
        <div class="border-r-[1px] border-gray-400 bg-gray-200 w-[70px] text-center">タイトル</div>
        <input class="w-[calc(100%-90px)] outline-none pl-2 pr-2" type="text" v-model="title" />
      </div>
      <div class="h-[10px]"></div>
      <!---------- エディターフォーム ---------->
      <mavon-editor
        class="h-[calc(100%-60px)]"
        :toolbars="createToolbar"
        @imgAdd="imgAdd"
        language="en"
        v-model="content"
      />
      <div class="flex justify-end mt-2">
        <!---------- 更新 ---------->
        <button
          class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[130px] pl-2 pr-2 rounded-full"
          @click="registerTopic(userStore.uid)"
        >登録</button>
        <div class="w-2"></div>
        <!---------- 閉じる ---------->
        <button
          class="bg-gray-600 text-gray-50 border-[1px] border-gray-600 text-xs w-[130px] pl-2 pr-2 rounded-full"
          @click="controlOpen(false, MODAL_TYPE.TOPIC_CREATE); clearForm()"
        >閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import 'mavon-editor/dist/css/index.css';
import useUserStore from "../../store/useUserStore";
import { createToolbar } from "../../settings/mavonEditor";
import { title, content, registerTopic, imgAdd, stopEvent, clearForm } from "../../composable/post";
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl";

const userStore = useUserStore();

</script>

<style lang="" scoped>
</style>
