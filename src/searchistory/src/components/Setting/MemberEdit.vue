<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.MEMBER_EDIT)"
    class="z-[3000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center"
  >
    <div class="border-2 border-black z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>チームメンバー</p>
      <div class="flex"></div>
      <div v-for="memberInfo in userInfo.memberInfos">
        <div class="flex">
          <div>{{ memberInfo.name }}</div>
          <!-- <button>編集</button> -->
          <button @click="deleteMember(memberInfo)">削除</button>
        </div>
      </div>
      <input type="text" v-model="newMemberUID" />
      <button @click="addMemberUID">追加</button>
      <!-- <button @click>更新</button> -->
      <button @click="controlOpen(false, MODAL_TYPE.MEMBER_EDIT);">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref, onBeforeMount, computed } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
import { db } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDoc, collection, doc, setDoc, arrayRemove } from "firebase/firestore";
import { controlOpen, MODAL_TYPE, isOpenMemberEditRef } from "../../composable/modalControl";
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
import checkExistUID from "../../composable/checkExistUID";

//model
import { Member } from "../../types/Member"
//define
const router = useRouter()
//define store
const userStore = useUserStore();

//logic
const userInfo = computed(() => {
  return userStore
})

// メンバー追加
const newMemberUID = ref("");
const myUserPrivateDocRef = doc(db, "userPrivate", userStore.uid);

const addMemberUID = async () => {
  const nmu = newMemberUID.value
  newMemberUID.value = "";
  const { isExist, memberInfo } = await checkExistUID(nmu)
  if (!isExist) {
    alert("そのユーザーIDは存在しません。");
  } else {
    const result = window.confirm(`${memberInfo.name}さんを追加しますか？`);
    if (result) {
      userInfo.value.memberUIDs.push(memberInfo.uid);
      await setDoc(myUserPrivateDocRef, {
        memberUIDs: userInfo.value.memberUIDs
      }, { merge: true });
      alert("追加しました。");
    }
  }
}

// メンバー削除
const deleteMember = async (memberInfo: Member) => {
  const result = window.confirm(`${memberInfo.name}さんを削除しますか？`);
  if (!result) return;

  const deletedMembers = userInfo.value.memberUIDs.filter((memberUID) => {
    return memberUID !== memberInfo.uid;
  }
  )
  await setDoc(myUserPrivateDocRef, {
    memberUIDs: deletedMembers
  }, { merge: true });
};

const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="scss" scoped>
</style>
