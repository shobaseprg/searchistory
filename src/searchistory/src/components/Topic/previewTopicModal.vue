<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'preview')"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル:{{ targetTopic.title }}</p>
      <p>状態:{{ targetTopic.statusWord }}</p>
      <div>
        <mavon-editor
          defaultOpen="preview"
          :subfield="false"
          :toolbars="{}"
          language="en"
          v-model="targetTopic.content"
        />
      </div>
      <button @click="controlOpen(true, 'edit');controlOpen(false, 'preview')">編集する</button>
      <button @click="controlOpen(false, 'preview')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import { ref, Ref } from "vue";
import { TopicModel } from "../../models/TopicModel"
import useTargetTopicStore from "../../store/useTargetTopicStore";
import{controlOpen}from"../../composable/modalControl"

const targetTopicStore = useTargetTopicStore();
const targetTopic =targetTopicStore.targetTopic;

const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="" scoped>

</style>
