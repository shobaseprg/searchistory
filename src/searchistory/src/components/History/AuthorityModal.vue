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
        <div class="border-2 border-black w-[150px]">
          <draggable
            class="list-group"
            :list="authorizedUsers"
            group="people"
            @change="updateMembers"
            item-key="email"
          >
            <template #item="{ element, index }">
              <div class="border-2 border-blue-500">{{ element.email }} {{ index }}</div>
            </template>
          </draggable>
        </div>
        <div class="border-2 border-black w-[150px]">
          <draggable class="list-group" :list="outMembers" group="people" item-key="email">
            <template #item="{ element, index }">
              <div class="border-2 border-blue-500">{{ element.email }} {{ index }}</div>
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
import { computed, onBeforeMount, ref, ComputedRef } from 'vue';
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
//logic
const authorizedUsers = computed(() => {
  return targetTopicStore.targetTopic.authorizedUsers
})

const members: ComputedRef<Member[]> = computed(() => {
  return userStore.members
})

const outMembers = computed(() => {
  const authorizedEmails = authorizedUsers.value.map((user) => {
    return user.email
  }
  )
  return members.value.filter((member: Member) => {
    console.log(member.email);
    return !authorizedEmails.includes(member.email)
  }
  );
})

const updateMembers = () => {
  targetTopicStore.targetTopic.updateMembers(authorizedUsers.value);
};
</script>

<style lang="" scoped>

</style>
