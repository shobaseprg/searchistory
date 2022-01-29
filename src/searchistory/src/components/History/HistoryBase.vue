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
    <!-- ヒストリーリスト -->
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
          <tr v-for="(history) in matchHistory" :key="history.docID" class="border-2 border-black">
            <!-- URL -->
            <td>{{ history.url }}</td>
            <!-- 状態 -->
            <StatusSelect :status="history.status" :docID="history.docID" />
            <td>{{ history.updatedAt.format("YYYY-MM-DD") }}</td>
            <!-- 編集ボタン -->
            <button
              @click="setTargetHistory(history); controlOpen(true, MODAL_TYPE.HISTORY_PREVIEW)"
            >編集する</button>
            <!-- 削除ボタン -->
            <button @click="setTargetHistory(history); deleteData()">削除</button>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
//firebase
import { db } from "../../firebase/config";
import { orderBy, collection, query, Unsubscribe, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
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
import { onSnapList } from "../../composable/onSnapList";
import StatusSelect from "./module/StatusSelect.vue";
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

const getInstanceFunc = (doc: QueryDocumentSnapshot<DocumentData>) => {
  return new HistoryModel(doc.data(({ serverTimestamps: "estimate" })));
}

onBeforeMount(async () => {
  unsubscribe = onSnapList(
    { q, getInstanceFunc, list: histories, targetState: targetHistory, targetStore: targetHistoryStore }
  );
});

onBeforeUnmount(() => {
  console.log("unmount")
  unsubscribe();
})
// ターゲットヒストリーセット
const setTargetHistory = (history: HistoryModel) => {
  targetHistoryStore.setTarget(history);
}
// 削除
const deleteData = () => {
  targetHistory.value.delete(targetTopic.value.docID)
};
// ----------------------------- 検索-----------------------------
const { urlFilterWord, matchHistory } = historyFilter(histories)
</script>

<style lang="scss" scoped>
</style>
