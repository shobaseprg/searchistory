<template>
  <!-- モーダル時背景 -->

  <div
    @click="controlOpen(false, MODAL_TYPE.HISTORY_EDIT)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] w-[80%] h-[80%] p-[1em] bg-white" @click="stopEvent">
      <p>メール追加</p>
      <!-- <button @click="updateHistory(targetHistory)">更新</button> -->
      <div v-for="user in authorizedUsers">{{ user }}</div>
      <button @click="controlOpen(false, MODAL_TYPE.AUTHORITY);">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed, onBeforeMount } from 'vue';
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetHistoryStore from "../../store/useTargetHistoryStore";
import useTargetTopicStore from "../../store/useTargetTopicStore";
//component
//composable
import { url, content, files, updateHistory, imgAdd, stopEvent, clearForm } from "../../composable/post";
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl";
import { createToolbar } from "../../settings/mavonEditor";
//model
//define
//define store
const targetTopicStore = useTargetTopicStore();
//logic

const authorizedUsers = computed(() => {
  return targetTopicStore.targetTopic.authorizedUsers
})
console.log(authorizedUsers.value)
</script>

<style lang="" scoped>

</style>
