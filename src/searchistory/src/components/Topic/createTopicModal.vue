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
import { TopicModel } from "../../models/TopicModel"
import useUserStore from "../../store/useUserStore";
const userStore = useUserStore();
import markdownOption from "./markdownOption";

interface Props {
  controlModal: (flag: boolean, type: string) => void
}
const { controlModal } = defineProps<Props>();
const stopEvent = (event: any) => {
  event.stopPropagation();
};

const title = ref("");
const content = ref("");

const registerTopic = async () => {
  await TopicModel.register(title.value, content.value, userStore.uid)
  clearForm();
  alert("登録しました。");
  controlModal(false, "create");
}

const imgAdd = async (filename: string, imgfile: File) => {
  const fileData = {
    file: imgfile,
    fileName: imgfile.name,
    content: content.value,
  }
  await TopicModel.uploadImg(fileData.file)
};

const clearForm = () => {
  title.value = "";
  content.value = "";
}

</script>

<style lang="" scoped>

</style>
