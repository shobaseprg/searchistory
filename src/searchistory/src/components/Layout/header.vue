<template>
  <SettingBaseModal v-if="isOpenPersonalSettingRef" />
  <MemberEdit v-if="isOpenMemberEditRef" />
  <div class="flex justify-between items-center pl-2 pr-2 h-[60px] bg-gray-400">
    <!--■■■■■■■■■■■■■■■■■ left_block ■■■■■■■■■■■■■■■■■-->
    <div class="flex h-[100%] items-center flex-row">
      <!--■■■■■■■■■■■■■■■■■ title ■■■■■■■■■■■■■■■■■-->
      <button
        class="w-[170px] h-[30px] text-center border-2 border-black bg-pink-400 rounded-full leading-[28px] text-sm mb-2 mt-2"
        @click="router.push('/home')"
      >- SEARCHISTORY -</button>
      <div class="w-[30px]"></div>
      <!--■■■■■■■■■■■■■■■■■ user_info ■■■■■■■■■■■■■■■■■-->
      <div class="pl-2 pr-2">
        <!--================= name =================-->
        <div class="flex text-xs">
          <span class="text-gray-300">Name</span>
          <div class="w-[5px]"></div>
          <span>{{ userStore.name }}</span>
        </div>
        <!--================= email =================-->
        <div class="flex text-xs">
          <span class="text-gray-300">Email</span>
          <div class="w-[5px]"></div>
          <span>{{ userStore.email }}</span>
        </div>
        <!--================= uid =================-->
        <div class="flex text-xs">
          <span class="text-gray-300">userID</span>
          <div class="w-[5px]"></div>
          <span>{{ userStore.uid }}</span>
          <CopyButton class="border-[1px] border-grey-800" :copyWord="auth.currentUser?.uid ?? ''" />
        </div>
      </div>
    </div>
    <!--■■■■■■■■■■■■■■■■■ ボタングループ ■■■■■■■■■■■■■■■■■-->
    <div class="flex items-center flex-col w-[500px] lg:flex-row">
      <!--============= 左 =============-->
      <div class="flex justify-evenly w-[50%] mb-1 lg:mb-0">
        <!-- トピック一覧 -->
        <button
          class="bg-red-400 text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full w-[110px] h-[20px]"
          @click="router.push('/home')"
        >トピック一覧</button>
        <div class="w-[10px]"></div>
        <!-- ユーザー設定 -->
        <button
          class="bg-red-400 text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full w-[110px] h-[20px]"
          @click="controlOpen(true, MODAL_TYPE.PERSONAL_SETTING)"
        >ユーザー設定</button>
      </div>
      <div class="w-[10px]"></div>
      <!--============= 右 =============-->
      <div class="flex justify-evenly w-[50%]">
        <!-- 使用方法 -->
        <button
          class="bg-red-400 text-gray-200 border-[1px] border-gray-600 text-xs pl-2 pr-2 rounded-full w-[110px] h-[20px]"
          @click="gotoManual"
        >使用方法</button>
        <div class="w-[10px]"></div>
        <!-- ログアウト -->
        <button
          class="bg-gray-600 text-white text-sm pl-2 pr-2 rounded-sm w-[110px] h-[20px]"
          @click="signout()"
        >ログアウト</button>
      </div>
    </div>
  </div>
</template>
<!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SCRIPT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
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
import CopyButton from "../module/CopyButton.vue"
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
//define store
const userStore = useUserStore();
const targetTopicStore = useTargetTopicStore()
//logic

// サインアウト
const signout = () => {
  signOut(auth).then(() => {
    console.log("ログアウト")
    router.push("/")
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
// マニュアル遷移
const gotoManual = () => {
  window.open("https://fito2prg.com/archives/463", '_blank');
}

</script>

<style lang="scss" scoped></style>
