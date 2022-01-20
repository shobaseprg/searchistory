<template>
  <button class="border-2 border-black" @click="controlModal(true)">事案新規作成</button>
  <createTopicModal v-if="isOpenCreateTopicModal" :controlModal="controlModal" />
  <table class="w-[100%]" border="1">
    <!-- テーブルヘッダー -->
    <thead>
      <tr>
        <th align="left" v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <!-- 1行 -->
    <tbody>
      <tr v-for="(topic, index) in myTopics" :key="index" class="border-2 border-black">
        <td>{{ topic.getTopic.title }}</td>
        <td>
          {{ topic.getTopic.statusWord }}
          <StatusSelect :status="topic.getTopic.status" :docID="topic.getTopic.docID" />
        </td>
        <td>{{ topic.getTopic.updatedAt.format("YYYY-MM-DD") }}</td>
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

import createTopicModal from "./Topic/createTopicModal.vue";
import { TopicModel } from "../models/TopicModel"
import StatusSelect from "./module/StatusSelect.vue"

const sectionModalControl = () => {
  const isOpenCreateTopicModal = ref(false)

  const controlModal = (flag: boolean) => {
    isOpenCreateTopicModal.value = flag;
  }
  return { isOpenCreateTopicModal, controlModal }
}

const headers = ['タイトル', '状態', '更新日'];

const userStore = useUserStore();

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

const { isOpenCreateTopicModal, controlModal } = sectionModalControl()


</script>
