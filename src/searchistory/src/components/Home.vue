<template>
  <CreateTopicModal v-if="isOpenTopicCreateRef" />
  <!--■■■■■■■■■■■■■■■■■ history-id-search ■■■■■■■■■■■■■■■■■-->
  <div class="flex justify-end mr-3 items-center h-[50px]">
    <div
      class="flex items-center justify-evenly bg-white border-[1px] border-gray-400 pt-[4px] pb-[4px] w-[350px]"
    >
      <!-- form_title -->
      <div class="border-[1px] border-gray-400 bg-gray-200 text-sm p-[1px] h-[25px]">調査履歴ID</div>
      <!-- form -->
      <input
        class="border-[1px] border-gray-400 h-[25px] w-[200px] outline-none"
        type="text"
        v-model="historyID"
      />
      <!-- button -->
      <button
        class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
        @click="getDirectHistory()"
      >検索</button>
    </div>
  </div>
  <!--■■■■■■■■■■■■■■■■■ topic-list-wrap ■■■■■■■■■■■■■■■■■-->
  <div class="bg-red-100 h-[calc(100%-110px)] ml-3 mr-3 border-[1px] border-gray-400">
    <!--================= header-area =================-->
    <div class="flex p-2 h-[42px] mt-5">
      <!------------------- create-topic ------------------->
      <button
        class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[130px] pl-2 pr-2 rounded-full"
        @click="controlOpen(true, MODAL_TYPE.TOPIC_CREATE)"
      >トピック新規作成</button>
      <!------------------- filter ------------------->
      <div class="flex justify-evenly w-[100%] ml-2">
        <!-- タイトル・ID -->
        <div class="flex border-[1px] border-gray-400 w-[calc(100%-280px)]">
          <div
            class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[130px] text-center text-xs"
          >トピックID or タイトル</div>
          <input class="w-[calc(100%-130px)] pl-1 outline-none" type="text" v-model="filterWord" />
        </div>
        <div class="w-[10px]"></div>
        <!-- 状態 -->
        <div class="flex border-[1px] border-gray-400">
          <div
            class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[40px] text-center text-xs"
          >状態</div>
          <select class="outline-none text-center text-xs" v-model="filterStatus">
            <option :value="TOPIC_STATUS.ALL">{{ TOPIC_STATUS_WORD.all }}</option>
            <option :value="TOPIC_STATUS.PENDING">{{ TOPIC_STATUS_WORD.pending }}</option>
            <option :value="TOPIC_STATUS.FINISH">{{ TOPIC_STATUS_WORD.finish }}</option>
          </select>
        </div>
        <div class="w-[10px]"></div>
        <!-- 作成者 -->
        <div class="flex border-[1px] border-gray-400">
          <div
            class="flex items-center justify-center border-r-[1px] border-gray-400 bg-gray-200 w-[60px] text-center text-xs"
          >作成者</div>
          <select class="outline-none text-center text-xs" v-model="filterOwner">
            <option :value="TOPIC_OWNER.all">全て</option>
            <option :value="TOPIC_OWNER.me">自分</option>
            <option :value="TOPIC_OWNER.other">自分以外</option>
          </select>
        </div>
      </div>
    </div>
    <!--================= トピックリスト =================-->
    <div class="h-[calc(100%-42px)] p-2">
      <table class="w-[100%]">
        <!------------------- テーブル-ヘッダー ------------------->
        <tr class="h-[20px] bg-gray-400 text-sm text-white">
          <th class="font-thin w-[230px]">トピックID</th>
          <th class="font-thin max-w-[400px]">タイトル</th>
          <th class="font-thin w-[80px]">状態</th>
          <th class="font-thin w-[60px]">my topic</th>
          <th class="font-thin w-[120px]">更新日</th>
          <th class="w-[50px]"></th>
          <th class="w-[50px]"></th>
        </tr>
        <!------------------- テーブル-ボディー ------------------->
        <tr v-for="(topic) in matchTopics" :key="topic.docID">
          <!-- トピックID -->
          <td
            class="flex items-center justify-end pr-3 border-t-[1px] border-b-[1px] border-l-[1px] border-gray-400 border-r-[1px] border-r-gray-300"
          >
            {{ topic.docID }}
            <div class="w-2"></div>
            <CopyButton :copyWord="topic.docID" />
          </td>
          <!-- タイトル -->
          <td
            class="border-t-[1px] border-b-[1px] border-gray-400 border-r-[1px] border-r-gray-200"
          >{{ topic.title }}</td>
          <!-- ステータス変更 -->
          <td
            class="border-t-[1px] border-b-[1px] border-gray-400 border-r-[1px] border-r-gray-200"
          >
            <StatusSelect :status="topic.status" :docID="topic.docID" />
          </td>
          <td
            class="border-t-[1px] border-b-[1px] border-gray-400 border-r-[1px] border-r-gray-200"
          >
            <span class v-if="topic.uid === userStore.uid">✔️</span>
          </td>
          <!-- 更新日 -->
          <td
            class="border-t-[1px] border-b-[1px] border-gray-400 border-r-[1px] border-r-gray-200"
          >{{ topic.updatedAt.format("YYYY/MM/DD H:mm") }}</td>
          <!-- 事案確認 -->
          <td class="border-t-[1px] border-b-[1px] border-gray-400">
            <button
              class="bg-blue-700 text-gray-50 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full"
              @click="setTargetTopic(topic); router.push('/history')"
            >確認</button>
          </td>
          <!-- 削除 -->
          <td
            class="border-t-[1px] border-b-[1px] border-gray-400 border-r-[1px] border-r-gray-400"
          >
            <button
              v-if="topic.uid === userStore.uid"
              class="bg-red-600 text-white border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full"
              @click="deleteData(topic)"
            >削除</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SCRIPT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
<script setup lang="ts">
//vue plugin
import { ref } from 'vue';
import { useRouter } from "vue-router";
//firebase
import { getAuth, Auth } from 'firebase/auth';
import { doc, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../firebase/config';
//store
import useUserStore from "../store/useUserStore";
import useTargetTopicStore from "../store/useTargetTopicStore";
//component
import CreateTopicModal from "./Topic/CreateTopicModal.vue";
import StatusSelect from "./module/StatusSelect.vue";
import CopyButton from "./module/CopyButton.vue"
//composable
import { isOpenTopicCreateRef, controlOpen, MODAL_TYPE, } from "../composable/modalControl";
import filterUnit from "../composable/topicFilter";
import { topics } from "../composable/onSnapList";
import setBeforeUser from "../composable/beforeSetUser";
import directHistory from "../composable/directHistory"
//model
import { TopicModel, TOPIC_STATUS, TOPIC_STATUS_WORD, TOPIC_OWNER } from "../models/TopicModel";
//define
const router = useRouter();
const auth: Auth = getAuth();
const currentUser = auth.currentUser;
//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore();
//logic
//■■■■■■■■■■■■■■■■■■■ ユーザーセット ■■■■■■■■■■■■■■■■■■■■
setBeforeUser(userStore);
//■■■■■■■■■■■■■■■■■■■ トピック制御 ■■■■■■■■■■■■■■■■■■■■
const setTargetTopic = (topic: TopicModel) => {
  targetTopicStore.setTarget(topic);
};
// 削除
const deleteData = (topic: TopicModel) => {
  topic.delete()
};
//■■■■■■■■■■■■■■■■■■■ ヒストリー検索 ■■■■■■■■■■■■■■■■■■■■
const historyID = ref("");
const getDirectHistory = async () => {
  for (let i = 0; i < topics.value.length; i++) {
    if (topics.value[i].historyList.includes(historyID.value)) {
      setTargetTopic(topics.value[i])
      directHistory.value = historyID.value;
      router.push('/history');
      return;
    }
  }
  alert("そのヒストリーIDの履歴は存在しないか、アクセスの権限がありません。")
}
//■■■■■■■■■■■■■■■■■■■ トピック検索 ■■■■■■■■■■■■■■■■■■■■
const { filterWord, filterStatus, matchTopics, filterOwner } = filterUnit(topics, currentUser?.uid)
</script>

<style>
table {
  border-collapse: separate !important;
  border-spacing: 0px 5px;
}
td {
  text-align: center;
  background: white;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  height: 24px;
}
</style>
