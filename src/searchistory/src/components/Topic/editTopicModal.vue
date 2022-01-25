<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false,  MODAL_TYPE.TOPIC_EDIT)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
  <p>編集</p>
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="createToolbar"  @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="updateTopic(targetTopic)">更新</button>

      <button @click="controlOpen(false, MODAL_TYPE.TOPIC_EDIT);clearForm()">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed } from 'vue';
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useTargetTopicStore from "../../store/useTargetTopicStore";
//component
//composable
import { createToolbar } from '../../settings/mavonEditor';
import {title, content, updateTopic, imgAdd, files,clearForm}from "../../composable/post"
import{controlOpen,MODAL_TYPE}from"../../composable/modalControl"
//model
//define
//define store
const targetTopicStore = useTargetTopicStore();
//logic

const targetTopic= computed(() => {
  return targetTopicStore.targetTopic;
});

title.value = targetTopic.value.title;
content.value = targetTopic.value.content;
files.value = targetTopic.value.files;

const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="" scoped>

</style>
