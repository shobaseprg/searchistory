<template>
  <EditTopicModal v-if="isOpenEditRef" />
  <CreateHistoryModal v-if="isOpenHistoryCreateRef" />
  <PreviewHistoryModal v-if="isOpenHistoryPreviewRef" />

  <!-- ベース -->
  <div class="w-[100%] h-[calc(100%-30px)] border-2 border-blue-600 flex">
    <!-- プレビュー -->
    <div class="w-[50%] h-[100%]">
      <mavon-editor
        class="h-[calc(100%-60px)]"
        defaultOpen="preview"
        :subfield="false"
        :toolbars="{}"
        language="en"
        v-model="targetTopic.content"
      />
      <button @click="controlOpen(true, 'edit')">編集する</button>
    </div>
    <!-- リスト -->
    <div class="w-[50%]">
      <button @click="controlOpen(true, 'createHistory')">調査履歴を追加</button>
      <table class="w-[100%]" border="1" @click="controlOpen(true, 'previewHistory')">
        <!-- テーブルヘッダー -->
        <thead>
          <tr>
            <th align="left" v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <!-- 1行 -->
        <tbody>
          <tr v-for="(history) in histories" :key="history.docID" class="border-2 border-black">
            <td>{{ history.url }}</td>
            <td>
              <!-- <StatusSelect :status="history.status" :docID="history.docID" /> -->
              <p>historyStatus</p>
            </td>
            <td>{{ history.updatedAt.format("YYYY-MM-DD") }}</td>
            <!-- <td @click="setTargetTopic(topic); controlOpen(true, 'preview')">事案確認</td> -->
            <!-- <td @click="setTargetTopic(topic); router.push('/history')">事案確認</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from 'vue-router'
//firebase
import { getAuth, signOut } from 'firebase/auth';
import { db } from "../../firebase/config";
import { orderBy, onSnapshot, collection, query, where, Unsubscribe } from "firebase/firestore";
//store
import useTargetTopicStore from "../../store/useTargetTopicStore"
import useTargetHistoryStore from "../../store/useTargetHistoryStore"
//component
import EditTopicModal from "../Topic/editTopicModal.vue";
import CreateHistoryModal from "./createHistoryModal.vue";
import PreviewHistoryModal from "./previewHistoryModal.vue";

//composable
import { controlOpen, isOpenEditRef, isOpenHistoryCreateRef ,isOpenHistoryPreviewRef} from "../../composable/modalControl"
import { HistoryModel } from "../../models/HistoryModel";
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
const targetTopicStore = useTargetTopicStore()
const targetHistoryStore = useTargetHistoryStore()
console.log(targetHistoryStore);

//logic
const headers = ['URL', '状態', '更新日'];

const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});
const targetHistory = computed(() => {
  return targetHistoryStore.targetHistory;
});
let unsubscribe: Unsubscribe;
const histories = ref<HistoryModel[]>([]);

onBeforeMount(async () => {
  const q = query(collection(db, "topic", targetTopic.value.docID, "history"), orderBy('updatedAt', 'desc'));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
    histories.value = [];
    querySnapshot.forEach((doc) => {
      const nextHistory = new HistoryModel(doc.data(({ serverTimestamps: "estimate" })));
      console.log(targetHistory.value)
      console.log(nextHistory)
      if (targetHistory.value.docID === nextHistory.docID) {
        targetHistoryStore.setTargetHistory(nextHistory);
      }
      histories.value.push(nextHistory);
    });
  });
});
// onBeforeUnmount(() => { unsubscribe() })


</script>

<style lang="scss" scoped>
</style>
