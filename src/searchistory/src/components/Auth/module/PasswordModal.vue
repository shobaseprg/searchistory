<template>
  <!-- モーダル時背景 -->
  <div
    @click="passwordModalControl(false)"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>パスワードをリセットする。</p>
      <!-- <input type="text" v-model="emailForm" />
      <div></div>
      <button @click>登録</button>-->
      <button @click="passwordModalControl(false);">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref } from 'vue';
import { useRouter } from "vue-router";
//firebase
import { getAuth, Auth } from 'firebase/auth';
// import { doc, getDocs, query, collection, where } from 'firebase/firestore';
// import { db } from '../firebase/config';
//store
// import useUserStore from "../store/useUserStore";
// import useTargetTopicStore from "../store/useTargetTopicStore";
//component
import CreateTopicModal from "./Topic/CreateTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue";
//composable
// import { isOpenTopicCreateRef, controlOpen, MODAL_TYPE, } from "../composable/modalControl";
// import filterUnit from "../composable/topicFilter";
// import { topics } from "../composable/onSnapList";
// import setBeforeUser from "../composable/beforeSetUser";
// import directHistory from "../composable/directHistory"
import { stopEvent } from "../../../composable/post"
//model
// import { TopicModel, TOPIC_STATUS, TOPIC_STATUS_WORD } from "../models/TopicModel";

//define
const router = useRouter();
const auth: Auth = getAuth();

//define store
// const userStore = useUserStore();
// const targetTopicStore = useTargetTopicStore();

// const userStore = useUserStore();

interface Props {
  passwordModalControl: (flag: boolean) => void;
}

const props = defineProps<Props>();

const emailForm = ref("");

</script>

<style lang="" scoped>
</style>
