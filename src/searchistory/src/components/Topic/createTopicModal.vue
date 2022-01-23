<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'create')"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="markdownOption" @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="registerTopic(controlOpen,userStore.uid)">登録</button>

      <button @click="controlOpen(false, 'create')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import useUserStore from "../../store/useUserStore";
import markdownOption from "./markdownOption";
import {title, content, registerTopic, imgAdd,stopEvent}from "../../composable/postTopic"
import{controlOpen}from"../../composable/modalControl"

const userStore = useUserStore();

</script>

<style lang="" scoped>
</style>
