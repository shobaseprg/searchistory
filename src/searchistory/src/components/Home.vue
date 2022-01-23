<template>
  <button class="border-2 border-black" @click="controlOpen(true, 'create')">事案新規作成</button>
  <CreateTopicModal v-if="isOpenCreateRef"/>
  <PreviewTopicModal v-if="isOpenPreviewRef"/>
  <EditTopicModal v-if="isOpenEditRef"/>
  <table class="w-[100%]" border="1">
    <!-- テーブルヘッダー -->
    <thead>
      <tr>
        <th align="left" v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <!-- 1行 -->
    <tbody>
      <tr v-for="(topic) in myTopics" :key="topic.docID" class="border-2 border-black">
        <td>{{ topic.title }}</td>
        <td>
          <StatusSelect :status="topic.status" :docID="topic.docID" />
        </td>
        <td>{{ topic.updatedAt.format("YYYY-MM-DD") }}</td>
        <!-- <td @click="setTargetTopic(topic); controlOpen(true, 'preview')">事案確認</td> -->
        <td @click="setTargetTopic(topic); controlOpen(true, 'preview')">事案確認</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { db } from "../firebase/config";
import { orderBy, onSnapshot, collection, query, where, Unsubscribe } from "firebase/firestore";

import useUserStore from "../store/useUserStore";
import useTargetTopicStore from "../store/useTargetTopicStore";

import CreateTopicModal from "./Topic/createTopicModal.vue";
import PreviewTopicModal from "./Topic/previewTopicModal.vue";
import EditTopicModal from "./Topic/editTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue"

import { TopicModel } from "../models/TopicModel"

import{ isOpenCreateRef, isOpenPreviewRef, isOpenEditRef, controlOpen}from"../composable/modalControl"

const headers = ['タイトル', '状態', '更新日'];
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();

const setTargetTopic = (topic: TopicModel) => {
  targetTopicStore.setTargetTopic(topic);
};

// const unitModalControl = {
//   isOpenCreateRef: ref(false),
//   isOpenPreviewRef: ref(false),
//   isOpenEditRef: ref(false),

//   controlOpen(flag: boolean, type: string) {
//     switch (type) {
//       case "create":
//         unitModalControl.isOpenCreateRef.value = flag;
//         break;
//       case "preview":
//         unitModalControl.isOpenPreviewRef.value = flag;
//         break;
//       case "edit":
//         unitModalControl.isOpenEditRef.value = flag;
//         break;
//       default:
//         break;
//     }
//   }
// } as const

// const { isOpenCreateRef, isOpenPreviewRef, isOpenEditRef, controlOpen } = unitModalControl

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
