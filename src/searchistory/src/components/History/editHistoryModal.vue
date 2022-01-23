<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'createHistory')"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>URL</p>
      <input type="text" v-model="url" />
      <div>
        <mavon-editor :toolbars="createToolbar" @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="updateHistory(userStore.uid,userStore.name)">更新</button>

      <button @click="controlOpen(false, 'createHistory')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetTopicStore from "../../store/useTargetTopicStore";
//component
//composable
import {url, content, updateHistory, imgAdd,stopEvent}from "../../composable/post";
import {controlOpen}from "../../composable/modalControl";
import {createToolbar}from "../../settings/mavonEditor";
//model
//define
//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();
//logic
</script>


<style lang="" scoped>
</style>
