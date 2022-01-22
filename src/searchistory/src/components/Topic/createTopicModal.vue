<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlModal(false, 'create')"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>タイトル</p>
      <input type="text" v-model="title" />
      <div>
        <mavon-editor :toolbars="markdownOption" @imgAdd="imgAdd" language="en" v-model="content" />
      </div>
      <button @click="registerTopic">登録</button>

      <button @click="controlModal(false, 'create')">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mavon-editor/dist/css/index.css'
import { ref } from "vue";
import { TopicModel,FileInfo } from "../../models/TopicModel"
import useUserStore from "../../store/useUserStore";
import markdownOption from "./markdownOption";

const userStore = useUserStore();

interface Props {
  controlModal: (flag: boolean, type: string) => void
}
const { controlModal } = defineProps<Props>();
const stopEvent = (event: any) => {
  event.stopPropagation();
};

const title = ref("");
const content = ref("");
const files=ref<FileInfo[]>([]);

const registerTopic = async () => {
  await TopicModel.register(title.value, content.value, userStore.uid,files.value)
  clearForm();
  alert("登録しました。");
  controlModal(false, "create");
}

const imgAdd = async (_: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    content: content.value,
  }
  const {afterContent,afterFiles} = await TopicModel.uploadImg(fileData, files.value);
  content.value = afterContent;
  files.value = afterFiles;
};

const clearForm = () => {
  title.value = "";
  content.value = "";
}

</script>

<style lang="" scoped>

</style>
