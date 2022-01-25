<template>
  <button class="border-2 border-black" @click="controlOpen(true, 'create')">事案新規作成</button>
  <CreateTopicModal v-if="isOpenCreateRef" />
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
        <td @click="setTargetTopic(topic); router.push('/history')">事案確認</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
//vue plugin
import { ref, onBeforeMount, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
//firebase
import { db } from "../firebase/config";
import { orderBy, onSnapshot, collection, query, where, Unsubscribe } from "firebase/firestore";
//store
import useUserStore from "../store/useUserStore";
import useTargetTopicStore from "../store/useTargetTopicStore";
//component
import CreateTopicModal from "./Topic/createTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue";
//composable
import { isOpenCreateRef, controlOpen } from "../composable/modalControl"
//model
import { TopicModel } from "../models/TopicModel"
//define
const router = useRouter();
//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();
//logic
const headers = ['タイトル', '状態', '更新日'];

const setTargetTopic = (topic: TopicModel) => {
  targetTopicStore.setTargetTopic(topic);
};

const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});

const myTopics = ref<Array<TopicModel>>([])

let unsubscribe: Unsubscribe;

onBeforeMount(async () => {
  const q = query(collection(db, "topic"), where("uid", "==", userStore.uid), orderBy('updatedAt', 'desc'));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
    myTopics.value = [];
    querySnapshot.forEach((doc) => {
      const addTopic = new TopicModel(doc.data(({ serverTimestamps: "estimate" })))
      if (targetTopic.value.docID === addTopic.docID) {
        targetTopicStore.setTargetTopic(addTopic);
      }
      myTopics.value.push(addTopic);
    });
  });
});

</script>
