<template>
  <div class="border-black border-2 flex h-[30px]">
    <p>{{ userStore.name }}さん</p>
    <button @click="signout()">ログアウト</button>
    <p @click="router.push('/home')">home</p>
    <button @click="controlOpen(true, MODAL_TYPE.PERSONAL_SETTING)">個人設定</button>
  </div>
  <SettingBaseModal v-if="isOpenPersonalSettingRef" />
  <MemberEdit v-if="isOpenMemberEditRef" />
</template>

<script setup lang="ts">
//vue plugin
import { getAuth, signOut } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, computed, onBeforeUnmount } from "vue";
//firebase
import { db, } from "../../firebase/config";
import { orderBy, collection, query, where, Unsubscribe, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//store
import useUserStore from "../../store/useUserStore";
import useTargetTopicStore from "../../store/useTargetTopicStore"
//component
//composable
import { controlOpen, MODAL_TYPE, isOpenPersonalSettingRef, isOpenMemberEditRef } from '../../composable/modalControl';
import SettingBaseModal from "../Setting/settingBaseModal.vue";
import MemberEdit from "../Setting/MemberEdit.vue";
import { onSnapList, topics } from "../../composable/onSnapList";
//model
import { TopicModel } from "../../models/TopicModel";

//define
const auth = getAuth();
const router = useRouter()
const route = useRoute()

//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore()
//logic
// サインアウト
const signout = () => {
  signOut(auth).then(() => {
    console.log("ログアウト")
    location.reload()
  });
};

//topicリスト取得
const targetTopic = computed(() => {
  return targetTopicStore.targetTopic;
});

const uid = auth.currentUser?.uid
let unsubscribe: Unsubscribe | null = null;

if (uid) {
  const q = query(collection(db, "topic"), where("authorizedUIDs", "array-contains", uid), orderBy('updatedAt', 'desc'));
  const getInstanceFunc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const addTopic = new TopicModel(doc.data(({ serverTimestamps: "estimate" })))
    addTopic.setMemberInfo();
    return addTopic;
  }

  onBeforeMount(async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapList(
          { q, getInstanceFunc, list: topics, targetState: targetTopic, targetStore: targetTopicStore }
        );
      }
    })
  });
}

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
})

</script>

<style lang="scss" scoped></style>
