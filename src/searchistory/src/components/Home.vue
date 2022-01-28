<template>
  <CreateTopicModal v-if="isOpenTopicCreateRef" />
  <button class="border-2 border-black" @click="controlOpen(true, MODAL_TYPE.TOPIC_CREATE)">事案新規作成</button>
  <button class="border-2 border-black" @click="changeFilterOwner('me')">自分のみ</button>
  <button class="border-2 border-black" @click="changeFilterOwner('all')">全て</button>
  <input type="text" v-model="filterWord" />
  <select v-model="filterStatus">
    <option :value="TOPIC_STATUS.ALL">{{ TOPIC_STATUS_WORD.all }}</option>
    <option :value="TOPIC_STATUS.PENDING">{{ TOPIC_STATUS_WORD.pending }}</option>
    <option :value="TOPIC_STATUS.FINISH">{{ TOPIC_STATUS_WORD.finish }}</option>
  </select>
  <table class="w-[100%]" border="1">
    <!-- テーブルヘッダー -->
    <thead>
      <tr>
        <th align="left" v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <!-- 1行 -->
    <tbody>
      <tr v-for="(topic) in matchTopics" :key="topic.docID" class="border-2 border-black">
        <td>{{ topic.title }}</td>
        <td>
          <StatusSelect :status="topic.status" :docID="topic.docID" />
        </td>
        <td>
          {{ topic.updatedAt.format("YYYY-MM-DD") }}
          <span
            class="border-2 border-red-600"
            v-if="topic.uid === userStore.uid"
          >me</span>
        </td>
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
import { orderBy, onSnapshot, collection, query, where, Unsubscribe, DocumentChange, DocumentData } from "firebase/firestore";
import { getAuth, Auth } from 'firebase/auth';
//store
import useUserStore from "../store/useUserStore";
import useTargetTopicStore from "../store/useTargetTopicStore";
//component
import CreateTopicModal from "./Topic/CreateTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue";
//composable
import { isOpenTopicCreateRef, controlOpen, MODAL_TYPE, } from "../composable/modalControl";
import filterUnit from "../composable/topicFilter";
import onSnapList from "../composable/onSnapList";
//model
import { TopicModel, TOPIC_STATUS, TOPIC_STATUS_WORD } from "../models/TopicModel";
//define
const router = useRouter();
const auth: Auth = getAuth();

//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();
//logic
const headers = ['タイトル', '状態', '更新日'];

// ----------------------------- トピック -----------------------------
const setTargetTopic = (topic: TopicModel) => {
  targetTopicStore.setTarget(topic);
};

const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});

const topics = ref<Array<TopicModel>>([])

let unsubscribe: Unsubscribe;

const uid = auth.currentUser?.uid

// リスト取得
const q = query(collection(db, "topic"), where("authorizedUIDs", "array-contains", uid), orderBy('updatedAt', 'desc'));

const getInstanceFunc = (change: DocumentChange<DocumentData>) => {
  const addTopic = new TopicModel(change.doc.data(({ serverTimestamps: "estimate" })))
  addTopic.setMemberInfo();
  return addTopic;
}

onBeforeMount(async () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      onSnapList(
        { q, getInstanceFunc, list: topics, targetState: targetTopic, targetStore: targetTopicStore }
      );
    }
  })
});
// ----------------------------- 検索-----------------------------
const { filterWord, filterStatus, matchTopics, changeFilterOwner } = filterUnit(topics, uid)

</script>
