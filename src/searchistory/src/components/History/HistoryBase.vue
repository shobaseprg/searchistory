<template>
  <EditTopicModal v-if="isOpenTopicEditRef" />
  <CreateHistoryModal v-if="isOpenHistoryCreateRef" />
  <PreviewHistoryModal v-if="isOpenHistoryPreviewRef" />
  <EditHistoryModal v-if="isOpenHistoryEditRef" />
  <AuthorityModal v-if="isOpenAuthorityRef" />
  <!-- ベース -->
  <div class="w-[100%] h-[calc(100%-30px)] border-2 border-blue-600 flex">
    <!-- プレビュートピックエリア -->
    <div class="w-[50%] h-[100%]">
      <mavon-editor
        class="h-[calc(100%-60px)]"
        defaultOpen="preview"
        :subfield="false"
        :toolbars="{}"
        language="en"
        v-model="targetTopic.content"
      />
      <button @click="controlOpen(true, MODAL_TYPE.TOPIC_EDIT)">編集する</button>
      <button @click="controlOpen(true, MODAL_TYPE.AUTHORITY)">権限ユーザーを追加</button>
    </div>
    <!-- URLリスト -->
    <div class="w-[50%]">
      <button @click="controlOpen(true, MODAL_TYPE.HISTORY_CREATE)">調査履歴を追加</button>
      <input type="text" v-model="urlFilterWord" />
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
            @click="setTargetHistory(history)"
            v-for="(history) in matchHistory"
            :key="history.docID"
            class="border-2 border-black"
          >
            <td>{{ history.url }}</td>
            <td>
              <p>historyStatus</p>
            </td>
            <td>{{ history.updatedAt.format("YYYY-MM-DD") }}</td>
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
import { orderBy, onSnapshot, collection, query, where, Unsubscribe, DocumentChange, DocumentData } from "firebase/firestore";
//store
import useTargetTopicStore from "../../store/useTargetTopicStore"
import useTargetHistoryStore from "../../store/useTargetHistoryStore"
//component
import EditTopicModal from "../Topic/EditTopicModal.vue";
import CreateHistoryModal from "./CreateHistoryModal.vue";
import PreviewHistoryModal from "./PreviewHistoryModal.vue";
import EditHistoryModal from "./EditHistoryModal.vue";
import AuthorityModal from "./AuthorityModal.vue";

//composable
import { controlOpen, isOpenTopicEditRef, isOpenHistoryCreateRef, isOpenHistoryPreviewRef, isOpenHistoryEditRef, isOpenAuthorityRef, MODAL_TYPE } from "../../composable/modalControl"
import { HistoryModel } from "../../models/HistoryModel";
import historyFilter from "../../composable/historyFilter"
import onSnapList from "../../composable/onSnapList";
//model
//define
//define store
const targetTopicStore = useTargetTopicStore()
const targetHistoryStore = useTargetHistoryStore()

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

// リスト取得
const q = query(collection(db, "topic", targetTopic.value.docID, "history"), orderBy('updatedAt', 'desc'));

const getInstanceFunc = (change: DocumentChange<DocumentData>) => {
  return new HistoryModel(change.doc.data(({ serverTimestamps: "estimate" })));
}

onBeforeMount(async () => {
  onSnapList(
    { q, getInstanceFunc, list: histories, targetState: targetHistory, targetStore: targetHistoryStore }
  );
});

onBeforeUnmount(() => {
  console.log("unmount")
  unsubscribe();
})

const setTargetHistory = (history: HistoryModel) => {
  targetHistoryStore.setTarget(history);
  controlOpen(true, MODAL_TYPE.HISTORY_PREVIEW)
}
// ----------------------------- 検索-----------------------------
const { urlFilterWord, matchHistory } = historyFilter(histories)
</script>

<style lang="scss" scoped>
</style>
