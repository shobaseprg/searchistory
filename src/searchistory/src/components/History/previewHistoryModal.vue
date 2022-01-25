<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false,MODAL_TYPE.HISTORY_PREVIEW)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] w-[80%] h-[80%] p-[1em] bg-white" @click="stopEvent">
      <p>URL:{{ targetHistory.url }}</p>
      <mavon-editor
      class="z-[2] w-[100%] h-[80%]"
        :toolbars="{}"
        :subfield="false"
        defaultOpen="preview"
        language="en"
        v-model="targetHistory.content"
      />
      <button @click="controlOpen(false, MODAL_TYPE.HISTORY_PREVIEW)">閉じる</button>
      <button @click="controlOpen(true, MODAL_TYPE.HISTORY_EDIT)">編集する</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
// import 'mavon-editor/dist/css/index.css'
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetHistoryStore from "../../store/useTargetHistoryStore";
//component
//composable
import { url, content, registerHistory, imgAdd, stopEvent } from "../../composable/post";
import { controlOpen ,MODAL_TYPE} from "../../composable/modalControl";
import { createToolbar } from "../../settings/mavonEditor";
import { computed } from 'vue';
//model
//define
//define store
const userStore = useUserStore();
const targetHistoryStore = useTargetHistoryStore();

const targetHistory = computed(() => {
  return targetHistoryStore.targetHistory;
})
//logic
</script>

<style lang="" scoped>
</style>
