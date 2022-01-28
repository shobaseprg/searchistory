<template>
  <CreateTopicModal v-if="isOpenTopicCreateRef" />
  <button class="border-2 border-black" @click="controlOpen(true, MODAL_TYPE.TOPIC_CREATE)">事案新規作成</button>
  <button class="border-2 border-black" @click="changeTopicType('me')">自分のみ</button>
  <button class="border-2 border-black" @click="changeTopicType('all')">全て</button>
  <input type="text" />
  <select v-model="filterStatus" v-on:change="filterStatusChange()">
    <option value="全て">全て</option>
    <option value="未決">未決</option>
    <option value="解決済">解決済み</option>
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
import { orderBy, onSnapshot, collection, query, where, Unsubscribe } from "firebase/firestore";
import { getAuth, Auth } from 'firebase/auth';
//store
import useUserStore from "../store/useUserStore";
import useTargetTopicStore from "../store/useTargetTopicStore";
//component
import CreateTopicModal from "./Topic/CreateTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue";
//composable
import { isOpenTopicCreateRef, controlOpen, MODAL_TYPE, } from "../composable/modalControl"
import filterUnit from "../composable/topicFilter"
//model
import { TopicModel } from "../models/TopicModel"
//define
const router = useRouter();
const auth: Auth = getAuth();

//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();
//logic
const headers = ['タイトル', '状態', '更新日'];

type TopicType = "all" | "me";

// // ----------------------------- 検索 -----------------------------
// const filterStatus = ref("全て");
// const topicType = ref<TopicType>("all");

// const filterStatusChange = () => {

// };

// const changeTopicType = (type: TopicType) => {
//   topicType.value = type;
// };

// const isTypeMatch = (topic: TopicModel) => {
//   if (topicType.value === "all") true;
//   if (topicType.value === "me" && topic.uid === userStore.uid) true;
//   return false;
// }

// const matchTopics = computed(() => {
//   return topics.value.filter((topic) => {
//     isTypeMatch(topic)
//   }
//   )

// });

// ----------------------------- トピック -----------------------------
const setTargetTopic = (topic: TopicModel) => {
  targetTopicStore.setTargetTopic(topic);
};

const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});

const topics = ref<Array<TopicModel>>([])

let unsubscribe: Unsubscribe;
const uid = auth.currentUser?.uid
onBeforeMount(async () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // const uid = auth.currentUser?.uid
      const q = query(collection(db, "topic"), where("authorizedUIDs"
        , "array-contains", uid), orderBy('updatedAt', 'desc'));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
          console.log("foreach")
          if (change.type == "added") {
            const addTopic = new TopicModel(change.doc.data(({ serverTimestamps: "estimate" })))
            addTopic.setMemberInfo();
            if (targetTopic.value.docID === addTopic.docID) {
              targetTopicStore.setTargetTopic(addTopic);
            }
            topics.value.push(addTopic);
          }
          if (change.type == "modified") {
            const modifyTopic = new TopicModel(change.doc.data(({ serverTimestamps: "estimate" })))
            const modifyIndex = topics.value.findIndex((topic) => {
              return topic.docID === modifyTopic.docID
            }
            )
            topics.value[modifyIndex] = modifyTopic;
          }
        });
      });
    }
  })
});

onBeforeUnmount(() => {
  console.log("unmount")
  unsubscribe();
}
)

// )
// ----------------------------- 検索-----------------------------
const { filterStatus, topicType, matchTopics, changeTopicType, filterStatusChange } = filterUnit(topics, uid)

</script>
