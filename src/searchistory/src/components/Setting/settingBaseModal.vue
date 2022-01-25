<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>個人設定</p>

      <div class="flex">
        <p>{{ userInfo.name }}</p>
        <button>編集</button>
      </div>
      <p>{{ userInfo.email }}</p>
      <button @click="controlOpen(true, MODAL_TYPE.MEMBER_EMAIL)">チームメンバーメールを登録</button>
      <!-- <button @click>更新</button> -->
      <button @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING); clearForm()">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed } from 'vue';
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
import { title, content, updateTopic, imgAdd, files, clearForm } from "../../composable/post"
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl"
//model
//define
//define store
const userStore = useUserStore();
//logic

const userInfo = computed(() => {
  return userStore;
});

const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="" scoped>

</style>
