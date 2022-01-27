<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.HISTORY_EDIT)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!-- モーダル -->
    <div class="z-[2] w-[80%] h-[80%] p-[1em] bg-white" @click="stopEvent">
      <p>メール追加</p>
      <div class="flex">
        <!-- 許可ユーザー -->
        <div class="border-2 border-black w-[150px]">
          <draggable
            class="list-group"
            :list="authorizedMemberInfosRemoveMe"
            group="people"
            @change="update"
            item-key="uid"
          >
            <template #item="{ element, index }">
              <div class="border-2 border-blue-500">{{ element.email }} {{ element.name }}</div>
            </template>
          </draggable>
        </div>
        <!-- メンバー -->
        <div class="border-2 border-black w-[150px]">
          <draggable class="list-group" :list="outMembers" group="people" item-key="uid">
            <template #item="{ element, index }">
              <div class="border-2 border-blue-500">{{ element.email }} {{ element.name }}</div>
            </template>
          </draggable>
        </div>
      </div>
      <!-- <button @click="updateHistory(targetHistory)">更新</button> -->
      <!-- <div v-for="user in authorizedUsers">{{ user }}</div> -->
      <button @click="controlOpen(false, MODAL_TYPE.AUTHORITY);">閉じる</button>
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

const update = () => {
  targetTopicStore.targetTopic.updateMembers(authorizedMemberInfosRemoveMe.value, userStore.uid);
};
</script>

<style lang="" scoped>

</style>
