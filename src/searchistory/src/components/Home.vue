<template>
  <button class="border-2 border-black" @click="controlOpen(true, 'create')">事案新規作成</button>
  <createTopicModal v-if="isOpenCreateRef" :controlModal="controlOpen" />
  <!-- <confirmTopicModal v-if="isOpenConfirmTopicModal" :controlModal="controlModal" /> -->
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
        v-for="(topic, index) in myTopics"
        :key="topic.getTopic.docID"
        class="border-2 border-black"
      >
        <td>{{ topic.getTopic.title }}</td>
        <td>
          <StatusSelect :status="topic.getTopic.status" :docID="topic.getTopic.docID" />
        </td>
        <td>{{ topic.getTopic.updatedAt.format("YYYY-MM-DD") }}</td>
        <td>事案確認</td>
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

import createTopicModal from "./Topic/createTopicModal.vue";
import { TopicModel } from "../models/TopicModel"
import StatusSelect from "./module/StatusSelect.vue"

const headers = ['タイトル', '状態', '更新日'];

const unitModalControl = {
  isOpenCreateRef: ref(false),
  isOpenConfirmRef: ref(false),

  controlOpen(flag: boolean, type: string) {
    switch (type) {
      case "create":
        unitModalControl.isOpenCreateRef.value = flag;
        break;
      case "confirm":
        unitModalControl.isOpenConfirmRef.value = flag;
        break;

      default:
        break;
    }
  }
} as const




const myTopics = ref<Array<TopicModel>>([])

let unsubscribe: Unsubscribe;

onBeforeMount(async () => {
  const q = query(collection(db, "topic"), where("uid", "==", userStore.uid), orderBy('updatedAt', 'desc'));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
    myTopics.value = [];
    querySnapshot.forEach((doc) => {
      myTopics.value.push(new TopicModel(doc.data(({ serverTimestamps: "estimate" }))));
    });
    console.log(myTopics.value)
  });
});
onBeforeUnmount(() => { unsubscribe() })

const { isOpenCreateRef, isOpenConfirmRef, controlOpen } = unitModalControl

</script>
