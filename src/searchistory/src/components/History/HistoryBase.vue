<template>
  <EditTopicModal v-if="isOpenTopicEditRef" />
  <CreateHistoryModal v-if="isOpenHistoryCreateRef" />
  <PreviewHistoryModal v-if="isOpenHistoryPreviewRef" />
  <EditHistoryModal v-if="isOpenHistoryEditRef" />
  <AuthorityModal v-if="isOpenAuthorityRef" />
  <div class="w-[100%] h-[calc(100%-60px)] flex p-2">
    <!--■■■■■■■■■■■■■■■■■ トピックプレビューエリア ■■■■■■■■■■■■■■■■■-->
    <div class="w-[50%] h-[100%]">
      <!--============= ボタンエリア =============-->
      <div class="flex justify-evenly mb-2">
        <!----------編集ボタン  ---------->
        <button
          class="bg-red-400 leading-[20px] text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full"
          @click="controlOpen(true, MODAL_TYPE.TOPIC_EDIT)"
        >トピックを編集する</button>
        <!----------権限ユーザーボタン  ---------->
        <button
          class="bg-red-400 leading-[20px] text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full"
          @click="controlOpen(true, MODAL_TYPE.AUTHORITY)"
        >権限ユーザーを追加</button>
      </div>
      <!--============= プレビューエリア =============-->
      <div
        class="w-[100%] border-[1px] border-gray-400 bg-white mb-2 pl-2 pr-2 overflow-hidden overflow-ellipsis"
      >{{ targetTopic.title }}</div>
      <mavon-editor
        class="h-[calc(100%-60px)]"
        defaultOpen="preview"
        :subfield="false"
        :toolbars="{}"
        language="en"
        v-model="targetTopic.content"
      />
    </div>
    <!--■■■■■■■■■■■■■■■■■ ヒストリーリストエリア ■■■■■■■■■■■■■■■■■-->
    <div v-if="!isHistoryPreview" class="flex flex-col items-center ml-2 w-[50%]">
      <!--============= トップ =============-->
      <div
        class="bg-white border-[1px] border-gray-400 w-[110px] h-[22px] mt-1 mb-1 text-center text-sm"
      >調査履歴一覧</div>
      <!--============= 履歴一覧枠組み =============-->
      <div
        class="border-[1px] border-gray-400 w-[100%] h-[calc(100%-25px)] p-2 bg-red-100 overflow-y-scroll"
      >
        <div class="flex justify-center items-center">
          <!-- 追加ボタン -->
          <button
            class="bg-red-400 text-gray-200 border-[1px] border-gray-600 text-xs h-[22px] pl-2 pr-2 mb-2 rounded-full"
            @click="controlOpen(true, MODAL_TYPE.HISTORY_CREATE)"
          >調査履歴を追加</button>
        </div>
        <!--============= フィルター =============-->
        <!---------- URL ---------->
        <div class="flex border-[1px] border-gray-400 w-[100%]">
          <div
            class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[50px] text-xs"
          >URL</div>
          <input class="w-[100%] outline-none" type="text" v-model="urlFilterWord" />
        </div>
        <div class="h-[5px]"></div>
        <!---------- 2列目 ---------->
        <div class="flex">
          <!-- 履歴ID -->
          <div class="flex border-[1px] border-gray-400 w-[calc(100%-110px)]">
            <div
              class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[53px] text-xs"
            >履歴ID</div>
            <input class="w-[100%] outline-none" type="text" v-model="docIdFilterWord" />
          </div>
          <div class="w-[5px]"></div>
          <!-- 状態 -->
          <div class="flex border-[1px] border-gray-400">
            <div
              class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[40px] text-center text-xs"
            >状態</div>
            <select class="outline-none text-xs" v-model="filterStatus">
              <option :value="HISTORY_STATUS.ALL">{{ HISTORY_STATUS_WORD.all }}</option>
              <option :value="HISTORY_STATUS.PENDING">{{ HISTORY_STATUS_WORD.pending }}</option>
              <option :value="HISTORY_STATUS.UNSOLVED">{{ HISTORY_STATUS_WORD.unsolved }}</option>
              <option :value="HISTORY_STATUS.SOLVED">{{ HISTORY_STATUS_WORD.solved }}</option>
            </select>
          </div>
          <div class="w-[5px]"></div>
          <!-- 作成者 -->
          <div class="flex border-[1px] border-gray-400">
            <div
              class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[50px] text-center text-xs"
            >作成者</div>
            <select class="outline-none text-xs" v-model="filterOwner">
              <option value="all">全て</option>
              <option value="my">自分</option>
              <option value="other">自分以外</option>
            </select>
          </div>
        </div>
        <div class="h-[10px]"></div>
        <!--============= 履歴一覧 =============-->
        <div class="w-[100%]">
          <div
            v-for="(history) in matchHistory"
            :key="history.doc_id"
            class="border-[1px] border-gray-400 bg-white p-1 mb-1 text-[1px]"
          >
            <!---------- 1行目 ---------->
            <div class="flex items-center justify-between">
              <!-- id -->
              <div
                class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-260px)]"
              >
                <div class="flex justify-center items-center bg-gray-200 w-[57px]">履歴ID</div>
                <div
                  class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
                >{{ history.doc_id }}</div>
                <CopyButton :copyWord="history.doc_id" />
              </div>
              <!-- <div class="w-[2px]"></div> -->
              <!-- 状態 -->
              <div class="flex border-[1px] border-gray-400 p-[2px]">
                <div class="bg-gray-200 w-[40px] text-center">状態</div>
                <StatusSelect :status="history.status" :doc_id="history.doc_id" />
              </div>
              <!-- <div class="w-[2px]"></div> -->
              <!-- 更新日 -->
              <div class="flex border-[1px] border-gray-400 p-[2px]">
                <div class="bg-gray-200 w-[40px] text-center">更新日</div>
                <div>{{ history.updated_at.format("YYYY/MM/DD H:mm") }}</div>
              </div>
            </div>
            <div class="h-[5px]"></div>
            <!---------- 2行目 ---------->
            <div class="flex items-center justify-between">
              <!-- URL -->
              <div
                class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-110px)]"
              >
                <div class="flex justify-center items-center bg-gray-200 w-[53px]">URL</div>
                <div
                  class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
                >{{ history.url }}</div>
                <CopyButton :copyWord="history.url" />
              </div>
              <!-- my history -->
              <div class="flex border-[1px] border-gray-400 p-[2px]">
                <div class="bg-gray-200 w-[70px] text-center">my history</div>
                <div class="w-[20px] text-center" v-if="history.uid === userStore.uid">✔️</div>
                <div class="w-[20px]" v-else></div>
              </div>
            </div>
            <div class="h-[5px]"></div>
            <!---------- 3行目 ---------->
            <div class="flex items-center justify-between">
              <!-- タイトル -->
              <div
                class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-110px)]"
              >
                <div class="flex justify-center items-center bg-gray-200 w-[53px]">タイトル</div>
                <div
                  class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
                >{{ history.title }}</div>
                <CopyButton :copyWord="history.title" />
              </div>
              <!-- 確認ボタン -->
              <button
                class="flex bg-blue-700 text-gray-50 text-xs pl-2 pr-2 h-[15px] rounded-full"
                @click="setTargetHistory(history); isHistoryPreview = true;"
              >確認</button>
              <!-- 削除ボタン -->
              <button
                v-if="history.uid === userStore.uid"
                class="flex bg-red-600 text-white text-xs pl-2 pr-2 h-[15px] rounded-full"
                @click="setTargetHistory(history); deleteData()"
              >削除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--■■■■■■■■■■■■■■■■■ ヒストリープレビュー ■■■■■■■■■■■■■■■■■-->
    <div v-else class="flex flex-col items-center border-2 border-black ml-2 w-[50%] h-[100%]">
      <!--============= 履歴一覧枠組み =============-->
      <div class="border-[1px] border-gray-400 w-[100%] h-[100%] p-2 bg-red-100">
        <!--============= ボタンエリア =============-->
        <div class="flex justify-evenly mb-2">
          <!----------編集ボタン  ---------->
          <button
            class="bg-red-400 leading-[20px] text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full"
            @click="isHistoryPreview = false"
          >調査履歴一覧へ</button>
        </div>
        <!--============= プレビューエリア =============-->
        <div class="border-[1px] border-gray-400 bg-white p-1 mb-1 text-[1px]">
          <!---------- 1行目 ---------->
          <div class="flex items-center justify-between">
            <!-- id -->
            <div
              class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-260px)]"
            >
              <div class="flex justify-center items-center bg-gray-200 w-[57px]">履歴ID</div>
              <div
                class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
              >{{ targetHistory.doc_id }}</div>
              <CopyButton :copyWord="targetHistory.doc_id" />
            </div>
            <!-- 状態 -->
            <div class="flex border-[1px] border-gray-400 p-[2px]">
              <div class="bg-gray-200 w-[40px] text-center">状態</div>
              <StatusSelect :status="targetHistory.status" :doc_id="targetHistory.doc_id" />
            </div>
            <!-- 更新日 -->
            <div class="flex border-[1px] border-gray-400 p-[2px]">
              <div class="bg-gray-200 w-[40px] text-center">更新日</div>
              <div>{{ targetHistory.updated_at.format("YYYY/MM/DD H:mm") }}</div>
            </div>
          </div>
          <div class="h-[5px]"></div>
          <!---------- 2行目 ---------->
          <div class="flex items-center justify-between">
            <!-- URL -->
            <div
              class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-110px)]"
            >
              <div class="flex justify-center items-center bg-gray-200 w-[53px]">URL</div>
              <div
                class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
              >{{ targetHistory.url }}</div>
              <CopyButton :copyWord="targetHistory.url" />
            </div>
            <!-- my history -->
            <div class="flex border-[1px] border-gray-400 p-[2px]">
              <div class="bg-gray-200 w-[70px] text-center">my history</div>
              <div class="w-[20px] text-center" v-if="targetHistory.uid === userStore.uid">✔️</div>
            </div>
          </div>
          <div class="h-[5px]"></div>
          <!---------- 3行目 ---------->
          <div class="flex items-center justify-between">
            <!-- タイトル -->
            <div
              class="flex items-center border-[1px] border-gray-400 p-[2px] w-[calc(100%-110px)]"
            >
              <div class="flex justify-center items-center bg-gray-200 w-[53px]">タイトル</div>
              <div
                class="w-[calc(100%-53px)] bg-white overflow-hidden overflow-ellipsis whitespace-nowrap"
              >{{ targetHistory.title }}</div>
              <CopyButton :copyWord="targetHistory.title" />
            </div>
            <!-- 編集ボタン -->
            <button
              class="flex bg-blue-700 text-gray-50 text-xs pl-2 pr-2 h-[15px] rounded-full"
              @click="controlOpen(true, MODAL_TYPE.HISTORY_EDIT)"
            >編集</button>
            <!-- 削除ボタン -->
            <button
              v-if="targetHistory.uid === userStore.uid"
              class="flex bg-red-600 text-white text-xs pl-2 pr-2 h-[15px] rounded-full"
              @click="isHistoryPreview = false; deleteData() "
            >削除</button>
          </div>
        </div>
        <mavon-editor
          class="h-[calc(100%-110px)]"
          defaultOpen="preview"
          :subfield="false"
          :toolbars="{}"
          language="en"
          v-model="targetHistory.content"
        />
      </div>
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
import useUserStore from "../../store/useUserStore";

//component
import EditTopicModal from "../Topic/EditTopicModal.vue";
import CreateHistoryModal from "./CreateHistoryModal.vue";
import PreviewHistoryModal from "./PreviewHistoryModal.vue";
import EditHistoryModal from "./EditHistoryModal.vue";
import AuthorityModal from "./AuthorityModal.vue";
import CopyButton from "../module/CopyButton.vue"
import InfoBar from "./module/InfoBar.vue";
//composable
import { controlOpen, isOpenTopicEditRef, isOpenHistoryCreateRef, isOpenHistoryPreviewRef, isOpenHistoryEditRef, isOpenAuthorityRef, MODAL_TYPE } from "../../composable/modalControl"
import historyFilter from "../../composable/historyFilter"
import { onSnapList } from "../../composable/onSnapList";
import StatusSelect from "./module/StatusSelect.vue";
import directHistory from "../../composable/directHistory";
//model
import { HistoryModel, HISTORY_STATUS, HISTORY_STATUS_WORD } from "../../models/HistoryModel";
//define
//define store
const targetTopicStore = useTargetTopicStore();
const targetHistoryStore = useTargetHistoryStore();
const userStore = useUserStore();
//logic

const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});

const targetHistory = computed(() => {
  return targetHistoryStore.targetHistory;
});

let unsubscribe: Unsubscribe;

const histories = ref<HistoryModel[]>([]);

// リスト取得
const q = query(collection(db, "topics", targetTopic.value.doc_id, "histories"), orderBy('updated_at', 'desc'));

const getInstanceFunc = (doc: QueryDocumentSnapshot<DocumentData>) => {
  return new HistoryModel(doc.data(({ serverTimestamps: "estimate" })));
}

onBeforeMount(async () => {
  unsubscribe = onSnapList(
    { q, getInstanceFunc, list: histories, targetState: targetHistory, targetStore: targetHistoryStore }
  );
  if (directHistory.value !== null) {
    docIdFilterWord.value = directHistory.value;
    directHistory.value = null;
  }
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
  targetHistory.value.delete(targetTopic.value.doc_id)
};
const isHistoryPreview = ref(false);
// ----------------------------- 検索-----------------------------
const { urlFilterWord, docIdFilterWord, filterStatus, filterOwner, matchHistory } = historyFilter(histories, userStore.uid)
</script>

<style scoped>
</style>
