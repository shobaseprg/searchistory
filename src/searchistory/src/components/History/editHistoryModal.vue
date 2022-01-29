<template>
  <!-- モーダル時背景 -->
  <p>履歴編集</p>
  <div
    @click="controlOpen(false, MODAL_TYPE.HISTORY_EDIT)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] w-[80%] h-[80%] p-[1em] bg-white" @click="stopEvent">
      <p>URL</p>
      <input type="text" v-model="url" />
      <!-- ステータス -->
      <div>ステータス</div>
      <select v-model="selectedStatus">
        <option :value="HISTORY_STATUS.PENDING">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.PENDING] }}</option>
        <option :value="HISTORY_STATUS.UNSOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.UNSOLVED] }}</option>
        <option :value="HISTORY_STATUS.SOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.SOLVED] }}</option>
      </select>
      <mavon-editor
        class="z-[2] w-[80%] h-[80%]"
        :toolbars="createToolbar"
        @imgAdd="imgAdd"
        language="en"
        v-model="content"
      />
      <button @click="updateHistory(targetHistory, selectedStatus)">更新</button>

      <button @click="controlOpen(false, MODAL_TYPE.HISTORY_EDIT); clearForm();">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed, ref } from 'vue';
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetHistoryStore from "../../store/useTargetHistoryStore";
import useTargetTopicStore from "../../store/useTargetTopicStore";

//component
import SelectStatus from "./module/SelectStatus.vue";

//composable
import { url, content, files, updateHistory, imgAdd, stopEvent, clearForm } from "../../composable/post";
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl";
import { createToolbar } from "../../settings/mavonEditor";
//model
import { HISTORY_STATUS, HISTORY_STATUS_WORD, HistoryStatus } from "../../models/HistoryModel"

//define
//define store
const targetHistoryStore = useTargetHistoryStore();
const userStore = useUserStore();
//logic

const targetHistory = computed(() => {
  return targetHistoryStore.targetHistory;
});

url.value = targetHistory.value.url;
content.value = targetHistory.value.content;
files.value = targetHistory.value.files;
const selectedStatus = ref(targetHistoryStore.targetHistory.status);

</script>

<style lang="" scoped>

</style>
