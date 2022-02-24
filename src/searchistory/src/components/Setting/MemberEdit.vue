<template>
  <!--■■■■■■■■■■■■■■■■■ モーダル背景 ■■■■■■■■■■■■■■■■■-->
  <div
    @click="controlOpen(false, MODAL_TYPE.MEMBER_EDIT)"
    class="z-[3000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center"
  >
    <!--■■■■■■■■■■■■■■■■■ モーダル ■■■■■■■■■■■■■■■■■-->
    <div
      class="flex flex-col items-center border-2 border-black z-[2] h-[80%] w-[600px] p-[1em] bg-white"
      @click="stopEvent"
    >
      <!--============= IDフォーム =============-->
      <div class="flex items-center justify-evenly bg-white w-[calc(100%-120px)]">
        <!--============= フォームタイトル =============-->
        <div
          class="flex items-center justify-center border-[1px] border-gray-400 bg-gray-200 p-[1px] h-[25px] w-[90px] text-xs"
        >ユーザーID</div>
        <div class="w-[3px]"></div>
        <!--============= インプットフォーム =============-->
        <input
          class="h-[25px] w-[300px] border-[1px] border-gray-400 text-sm outline-none"
          type="text"
          v-model="newMemberUID"
        />
        <div class="w-[3px]"></div>
        <!--============= ボタン =============-->
        <button
          class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
          @click="addMemberUID"
        >追加</button>
      </div>
      <!--============= ユーザーリスト =============-->
      <div class="border-[1px] border-black bg-red-100 mt-2 p-1 h-[calc(100%-10px)] w-[95%]">
        <!---------- ROW ---------->
        <div
          class="flex justify-between items-center border-[1px] border-gray-400 p-[1px] bg-white"
          v-for="memberInfo in userInfo.memberInfos"
        >
          <!-- Name -->
          <div class="flex w-[230px] text-[1px]">
            <div class="border-[1px] border-gray-400 bg-gray-200">Name</div>
            <div class="w-[3px]"></div>
            <div class="flex items-center">{{ memberInfo.name }}</div>
          </div>
          <!-- UID -->
          <div class="flex w-[230px] text-[1px]">
            <div class="border-[1px] border-gray-400 bg-gray-200 text-center w-[20px]">ID</div>
            <div class="w-[3px]"></div>
            <div class="flex items-center">{{ memberInfo.uid }}</div>
          </div>
          <!-- 削除ボタン -->
          <button
            class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs w-[50px] pl-2 pr-2 rounded-full"
            @click="deleteMember(memberInfo)"
          >削除</button>
        </div>
      </div>
      <!--============= 閉じるボタン =============-->
      <div class="h-[10px]"></div>
      <button
        class="bg-gray-600 text-white text-xs h-[30px] w-[90px] pl-2 pr-2 rounded-full"
        @click="controlOpen(false, MODAL_TYPE.MEMBER_EDIT);"
      >閉じる</button>
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
import { addMemberVali, checkExistUID } from "../../composable/validate"
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

  // バリデーション
  const result = addMemberVali(nmu, userInfo.value.memberUIDs);

  if (result !== "") {
    alert(result);
    return;
  }

  // 重複チェック
  const { isExist, memberInfo } = await checkExistUID(nmu);
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
