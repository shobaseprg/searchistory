<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.MEMBER_EMAIL)"
    class="z-[3000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center"
  >
    <div class="border-2 border-black z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>チームメンバーメール</p>
      <div class="flex"></div>
      <div v-for="memberEmail in userInfo.memberEmails">
        <div class="flex">
          <div>{{ memberEmail }}</div>
          <button>編集</button>
          <button @click="deleteEmail(memberEmail)">削除</button>
        </div>
      </div>
      <!-- <button @click="controlOpen(true,MODAL_TYPE.MEMBER_EMAIL)">チームメンバーメールを登録</button> -->
      <input type="text" v-model="newMemberEmail" />
      <button @click="addMemberEmail">追加</button>
      <!-- <button @click>更新</button> -->
      <button @click="controlOpen(false, MODAL_TYPE.MEMBER_EMAIL);">閉じる</button>
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
import { getFirestore, getDoc, collection, doc, setDoc } from "firebase/firestore";
import { controlOpen, MODAL_TYPE, isOpenMemberEmailRef } from "../../composable/modalControl";
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
//model
//define
const router = useRouter()
//define store
const userStore = useUserStore();

//logic
const userInfo = computed(() => {
  return userStore
})

// メール追加
const myUserDocRef = doc(db, "user", userStore.uid);
const newMemberEmail = ref("");

const addMemberEmail = async () => {
  userInfo.value.memberEmails.push(newMemberEmail.value);
  await setDoc(myUserDocRef, {
    memberEmails: userInfo.value.memberEmails
  }, { merge: true });
  newMemberEmail.value = "";
}

// メール削除
const deleteEmail = async (deleteEmail: string) => {
  const deletedEmails = userInfo.value.memberEmails.filter((email) => {
    return email !== deleteEmail;
  }
  )
  await setDoc(myUserDocRef, {
    memberEmails: deletedEmails
  }, { merge: true });
};



const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="scss" scoped>
</style>
