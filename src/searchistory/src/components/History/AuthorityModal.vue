<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.AUTHORITY)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] flex flex-col items-center w-[560px] h-[80%] bg-white p-2" @click="stopEvent">
      <!--■■■■■■■■■■■■■■■■■ ユーザーID追加 ■■■■■■■■■■■■■■■■■-->
      <div class="flex justify-evenly w-[100%] items-center mb-2">
        <!-- <div class="flex items-center justify-evenly bg-white w-[calc(100%-180px)]"> -->
        <!-- タイトル -->
        <!-- <div
            class="flex items-center justify-center border-[1px] border-gray-400 bg-gray-200 p-[1px] h-[25px] w-[70px] text-xs"
        >ユーザーID</div>-->
        <!-- フォーム -->
        <!-- <div class="w-[3px]"></div>
          <input
            class="h-[25px] w-[260px] border-[1px] border-gray-400 text-sm outline-none"
            type="text"
            v-model="uidForm"
        />-->
        <!-- <div class="w-[3px]"></div> -->
        <!-- ボタン -->
        <!-- <button
            class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
          >追加</button>
        </div>-->
      </div>
      <!--■■■■■■■■■■■■■■■■■ ドラッグユーザー追加エリア ■■■■■■■■■■■■■■■■■-->
      <div class="flex flex-col h-[100%] w-[100%]">
        <!--============= ボタンエリア =============-->
        <div class="flex w-[100%]">
          <!---------- 追加済み ---------->
          <div class="flex items-center justify-center w-[50%] text-center text-sm">
            追加済みユーザー
            <button
              class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[140px] pl-2 pr-2 rounded-full"
              @click="removeAllUser"
            >全メンバーを外す</button>
          </div>
          <!---------- 未追加 ---------->
          <div class="flex items-center justify-center w-[50%] text-center text-sm">
            未追加ユーザー
            <button
              class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[140px] pl-2 pr-2 rounded-full"
              @click="addAllUser"
            >全メンバーを追加する</button>
          </div>
        </div>
        <div class="h-2"></div>
        <!--============= ドラッグエリア =============-->
        <div class="flex h-[100%]">
          <!---------- 追加済ユーザー ---------->
          <div class="border-[1px] border-black p-3 w-[50%]">
            <draggable
              class="list-group"
              :list="authorizedMemberInfosRemoveMe"
              group="people"
              @change="update"
              item-key="uid"
            >
              <template #item="{ element, index }">
                <div
                  class="bg-gray-200 border-[1px] border-black p-[1px] rounded-md cursor-pointer"
                >{{ element.name }}</div>
              </template>
            </draggable>
          </div>
          <div class="w-[1px]"></div>
          <!---------- 未追加ユーザー ---------->
          <div class="border-[1px] border-black p-3 w-[50%]">
            <draggable class="list-group" :list="outMembers" group="people" item-key="uid">
              <template #item="{ element, index }">
                <div
                  class="bg-gray-200 border-[1px] border-black p-[1px] rounded-md cursor-pointer"
                >{{ element.name }}</div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      <!--■■■■■■■■■■■■■■■■■ 下部ボタン ■■■■■■■■■■■■■■■■■-->
      <div class="flex justify-end w-[100%] mt-2">
        <button
          class="bg-gray-600 text-white text-sm pl-2 pr-2 rounded-sm"
          @click="controlOpen(false, MODAL_TYPE.AUTHORITY);"
        >閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed, onBeforeMount, ref, ComputedRef, onMounted } from 'vue';
import draggable from "vuedraggable";
//firebase
//store
import useUserStore from "../../store/useUserStore";
import useTargetHistoryStore from "../../store/useTargetHistoryStore";
import useTargetTopicStore from "../../store/useTargetTopicStore";
//component
//composable
import { url, content, files, updateHistory, imgAdd, stopEvent, clearForm } from "../../composable/post";
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl";
import { createToolbar } from "../../settings/mavonEditor";
//model
import { Member } from '../../types/Member';
//define
//define store
const targetTopicStore = useTargetTopicStore();
const userStore = useUserStore()

const authorizedMemberInfosRemoveMe = ref<Member[]>([]);
const outMembers = ref<Member[]>([]);

onMounted(() => {
  const authorizedMemberInfos = [...targetTopicStore.targetTopic.authorizedMemberInfos];
  authorizedMemberInfosRemoveMe.value = authorizedMemberInfos.filter((memberInfo) => {
    return userStore.uid !== memberInfo.uid;
  }
  )
  const authorizedMemberUIDs = authorizedMemberInfosRemoveMe.value.map((memberInfo) => {
    return memberInfo.uid
  }
  )
  outMembers.value = [...userStore.memberInfos].filter((memberInfo) => {
    return !authorizedMemberUIDs.includes(memberInfo.uid)
  })
})

// const uidForm = ref("");

const update = () => {
  targetTopicStore.targetTopic.updateMembers(authorizedMemberInfosRemoveMe.value, userStore.uid);
};

const addAllUser = () => {
  authorizedMemberInfosRemoveMe.value = [...userStore.memberInfos];
  outMembers.value = [];
  update();
}

const removeAllUser = () => {
  authorizedMemberInfosRemoveMe.value = [];
  outMembers.value = [...userStore.memberInfos];
  update();
}

</script>

<style lang="" scoped>

</style>
