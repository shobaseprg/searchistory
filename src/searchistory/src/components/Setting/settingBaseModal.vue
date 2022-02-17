<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <div class="z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>個人設定</p>
      <!--■■■■■■■■■■■■■■■■■ 名前 ■■■■■■■■■■■■■■■■■-->
      <!-- 名前表示 -->
      <div v-if="!isNameEdit" class="flex">
        名前:
        <p>{{ userInfo.name }}</p>
        <button @click="changeNameEdit(true)">編集</button>
      </div>
      <!-- 名前フォーム -->
      <div v-else class="flex">
        名前:
        <input type="text" v-model="formName" class="border-2 border-red-600" />
        <button @click="cancelNameEdit()">キャンセル</button>
        <button @click="updateName()">更新</button>
      </div>
      <!--■■■■■■■■■■■■■■■■■ メールアドレス ■■■■■■■■■■■■■■■■■-->
      <!-- メール表示 -->
      <div v-if="!isEmailEdit" class="flex">
        メール:
        <p>{{ userInfo.email }}</p>
        <button @click="changeEmailEdit(true)">編集</button>
      </div>
      <!-- メール表示 -->
      <div v-else class="flex">
        メール:
        <input type="text" v-model="formEmail" class="border-2 border-red-600" />
        <button @click="cancelEmailEdit()">キャンセル</button>
        <button @click="updateUserEmail()">更新</button>
      </div>
      <!--■■■■■■■■■■■■■■■■■ メンバー更新 ■■■■■■■■■■■■■■■■■-->
      <button @click="controlOpen(true, MODAL_TYPE.MEMBER_EDIT)">チームメンバーメールを登録</button>
      <!-- <button @click>更新</button> -->
      <button @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING); clearForm()">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
//firebase
import { db } from '../../firebase/config';
import { updateDoc, doc } from 'firebase/firestore';
import { getAuth, updateEmail, sendEmailVerification, signOut } from 'firebase/auth';
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
import { title, content, updateTopic, imgAdd, files, clearForm } from "../../composable/post"
import { controlOpen, MODAL_TYPE } from "../../composable/modalControl"
// option
import { actionCodeSettings } from "../Auth/authOption";
//model
//define
const auth = getAuth();
const router = useRouter()
//define store
const userStore = useUserStore();
//logic
const userInfo = computed(() => {
  return userStore;
});
const stopEvent = (event: any) => {
  event.stopPropagation();
};
//■■■■■■■■■■■■■■■■■■■ 名前変更 ■■■■■■■■■■■■■■■■■■■■
const isNameEdit = ref(false);
const formName = ref(userStore.name);

const changeNameEdit = (flag: true) => {
  isNameEdit.value = flag;
}
const cancelNameEdit = () => {
  isNameEdit.value = false;
  formName.value = userStore.name;
}
const updateName = () => {
  const userDocRef = doc(db, "user", userStore.uid);
  updateDoc(userDocRef, { name: formName.value });
  cancelNameEdit();
}
//■■■■■■■■■■■■■■■■■■■ メール変更 ■■■■■■■■■■■■■■■■■■■■
const isEmailEdit = ref(false);
const formEmail = ref(userStore.email);

const changeEmailEdit = (flag: true) => {
  isEmailEdit.value = flag;
}
const cancelEmailEdit = () => {
  isEmailEdit.value = false;
  formEmail.value = userStore.name;
}
const updateUserEmail = () => {
  if (!auth.currentUser) { return };
  updateEmail(auth.currentUser, formEmail.value).then(() => {
    if (!auth.currentUser) { return };
    sendEmailVerification(auth.currentUser, actionCodeSettings)
      .then(() => {
        alert("確認メールを送りました。メールを確認後ログインしてください。");
        signOut(auth).then(() => {
          location.reload()
        });
      }).catch((e) => {
        alert(e)
      });
  }).catch((error) => {
  });
  cancelEmailEdit();
}

</script>

<style lang="" scoped>

</style>
