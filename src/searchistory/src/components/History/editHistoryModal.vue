<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'editHistory')"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
  <!-- モーダル -->
    <div class="z-[2] w-[80%] h-[80%] p-[1em] bg-white" @click="stopEvent">
      <p>URL</p>
      <input type="text" v-model="url" />
        <mavon-editor class="z-[2] w-[80%] h-[80%]" :toolbars="createToolbar" @imgAdd="imgAdd" language="en" v-model="content" />
      <button @click="updateHistory(targetHistory)">更新</button>

      <button @click="controlOpen(false, 'editHistory');clearForm();">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed } from 'vue';
import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetHistoryStore from "../../store/useTargetHistoryStore";

//component
//composable
import {url, content,files, updateHistory, imgAdd,stopEvent,clearForm}from "../../composable/post";
import {controlOpen}from "../../composable/modalControl";
import {createToolbar}from "../../settings/mavonEditor";
//model
//define
//define store
const targetHistoryStore = useTargetHistoryStore();
//logic

const targetHistory= computed(() => {
  return targetHistoryStore.targetHistory;
});

url.value = targetHistory.value.url;
content.value = targetHistory.value.content;
files.value = targetHistory.value.files;

</script>

<style lang="" scoped>
</style>
