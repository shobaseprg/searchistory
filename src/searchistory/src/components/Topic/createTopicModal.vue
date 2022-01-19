<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlModal(false)"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <p>著者</p>
      <input type="text" v-model="author" />
      <div>
        <mavon-editor :toolbars="markdownOption" language="en" v-model="content" />
      </div>
      <button @click="registerTopic">登録</button>

      <button @click="controlModal(false)">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import { ref } from "vue";
import TopicModel from "../../models/TopicModel"

interface Props {
  controlModal: (flag: boolean) => void
}
const { controlModal } = defineProps<Props>();
const stopEvent = (event: any) => {
  event.stopPropagation();
};

const title = ref("");
const author = ref("");
const content = ref("");

const registerTopic = () => {
  TopicModel.register(title.value, content.value, author.value, "testUID")
}

const markdownOption = {
  bold: true,
  italic: true,
  header: true,
  underline: true,
  strikethrough: true,
  mark: true,
  superscript: true,
  subscript: true,
  quote: true,
  ol: true,
  ul: true,
  link: true,
  imagelink: true,
  code: true,
  table: true,
  fullscreen: true,
  readmodel: true,
  htmlcode: true,
  help: true,
  /* 1.3.5 */
  undo: true,
  redo: true,
  trash: true,
  save: true,
  /* 1.4.2 */
  navigation: true,
  /* 2.1.8 */
  alignleft: true,
  aligncenter: true,
  alignright: true,
  /* 2.2.1 */
  subfield: true,
  preview: true,
};

</script>

<style lang="" scoped>

</style>
