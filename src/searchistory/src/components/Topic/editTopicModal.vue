<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'edit')"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
  <p>編集</p>
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="createToolbar"  @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="updateTopic(controlOpen,targetTopic)">更新</button>

      <button @click="controlOpen(false, 'edit')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import { createToolbar } from '../../settings/mavonEditor';
import useTargetTopicStore from "../../store/useTargetTopicStore";
import {title, content, updateTopic, imgAdd, files}from "../../composable/post"
import{controlOpen}from"../../composable/modalControl"
import { computed } from 'vue';

const targetTopicStore = useTargetTopicStore();

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
