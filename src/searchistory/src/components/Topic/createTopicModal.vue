<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.TOPIC_CREATE)"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="createToolbar" @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="registerTopic(userStore.uid,userStore.name)">登録</button>
      <button @click="controlOpen(false,  MODAL_TYPE.TOPIC_CREATE);clearForm()">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// import 'mavon-editor/dist/css/index.css';
import useUserStore from "../../store/useUserStore";
import {createToolbar} from "../../settings/mavonEditor";
import {title, content, registerTopic, imgAdd,stopEvent,clearForm}from "../../composable/post";
import{controlOpen,MODAL_TYPE}from"../../composable/modalControl";

const userStore = useUserStore();

</script>

<style lang="" scoped>
</style>
