<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, 'edit')"
    class="z-[1] w-[100%] h-[100%] fixed left-0 top-0 flex items-center justify-center"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="markdownOption" language="en" v-model="content" />
      </div>
      <button @click="updateTopic">登録</button>

      <button @click="controlOpen(false, 'edit')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import { ref } from "vue";
import { TopicModel } from "../../models/TopicModel"
import useUserStore from "../../store/useUserStore";
import markdownOption from "./markdownOption";

const userStore = useUserStore();

interface Props {
  controlOpen: (flag: boolean, type: string) => void
  targetTopic: TopicModel
}
const { controlOpen, targetTopic } = defineProps<Props>();
const stopEvent = (event: any) => {
  event.stopPropagation();
};

const title = ref(targetTopic.title);
const content = ref(targetTopic.content);

const updateTopic = async () => {
  await TopicModel.update(title.value, content.value, targetTopic.docID)
  clearForm();
  alert("登録しました。");
  controlOpen(false, "create");
}

const clearForm = () => {
  title.value = "";
  content.value = "";
}

</script>

<style lang="" scoped>

</style>
