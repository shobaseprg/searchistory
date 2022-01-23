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
        <mavon-editor :toolbars="markdownOption" @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="registerHistory(controlOpen,userStore.uid,userStore.name)">登録</button>

      <button @click="controlOpen(false, 'createHistory')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import useUserStore from "../../store/useUserStore";
import markdownOption from "./markdownOption";
import {url, content, registerHistory, imgAdd,stopEvent}from "../../composable/post"
import{controlOpen}from"../../composable/modalControl"

const userStore = useUserStore();

</script>

<style lang="" scoped>
</style>
