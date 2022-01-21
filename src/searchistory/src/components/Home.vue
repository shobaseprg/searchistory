<template>
  <button class="border-2 border-black" @click="controlOpen(true, 'create')">事案新規作成</button>
  <CreateTopicModal v-if="isOpenCreateRef" :controlModal="controlOpen" />
  <PreviewTopicModal v-if="isOpenPreviewRef" :targetTopic="targetTopic" :controlOpen="controlOpen" />
  <EditTopicModal v-if="isOpenEditRef" :targetTopic="targetTopic" :controlOpen="controlOpen" />
  <table class="w-[100%]" border="1">
    <!-- テーブルヘッダー -->
    <thead>
      <tr>
        <th align="left" v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <!-- 1行 -->
    <tbody>
      <tr
        v-for="(topic: TopicModel, index) in myTopics"
        :key="topic.docID"
        class="border-2 border-black"
      >
        <td>{{ topic.title }}</td>
        <td>
          <StatusSelect :status="topic.status" :docID="topic.docID" />
        </td>
        <td>{{ topic.updatedAt.format("YYYY-MM-DD") }}</td>
        <td @click="setTargetTopic(topic); controlOpen(true, 'preview')">事案確認</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, onBeforeUnmount } from "vue";
import { db } from "../firebase/config";
import { orderBy, onSnapshot, getFirestore, getDocs, collection, query, where, Unsubscribe } from "firebase/firestore";
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';
import useUserStore from "../store/useUserStore";
const userStore = useUserStore();

import CreateTopicModal from "./Topic/createTopicModal.vue";
import PreviewTopicModal from "./Topic/previewTopicModal.vue";
import EditTopicModal from "./Topic/editTopicModal.vue";

import { TopicModel } from "../models/TopicModel"
import StatusSelect from "./module/StatusSelect.vue"
const headers = ['タイトル', '状態', '更新日'];

const targetTopic = ref<TopicModel>(new TopicModel("default"));

const setTargetTopic = (topic: TopicModel) => {
  targetTopic.value = topic
};

const unitModalControl = {
  isOpenCreateRef: ref(false),
  isOpenPreviewRef: ref(false),
  isOpenEditRef: ref(false),

  controlOpen(flag: boolean, type: string) {
    switch (type) {
      case "create":
        unitModalControl.isOpenCreateRef.value = flag;
        break;
      case "preview":
        unitModalControl.isOpenPreviewRef.value = flag;
        break;
      case "edit":
        unitModalControl.isOpenEditRef.value = flag;
        break;
      default:
        break;
    }
  }
} as const

const { isOpenCreateRef, isOpenPreviewRef, isOpenEditRef, controlOpen } = unitModalControl


const myTopics = ref<Array<TopicModel>>([])

let unsubscribe: Unsubscribe;

onBeforeMount(async () => {
  const q = query(collection(db, "topic"), where("uid", "==", userStore.uid), orderBy('updatedAt', 'desc'));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
    myTopics.value = [];
    querySnapshot.forEach((doc) => {
      const a = doc.data(({ serverTimestamps: "estimate" }));

      myTopics.value.push(new TopicModel(doc.data(({ serverTimestamps: "estimate" }))));
    });
    console.log(myTopics.value)
  });
});
onBeforeUnmount(() => { unsubscribe() })

</script>
