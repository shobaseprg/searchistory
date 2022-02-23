<template>
  <!--■■■■■■■■■■■■■■■■■ モーダル時背景 ■■■■■■■■■■■■■■■■■-->
  <div
    @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING)"
    class="z-[2000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!--■■■■■■■■■■■■■■■■■ モーダル ■■■■■■■■■■■■■■■■■-->
    <div class="z-[2] w-[690px] p-[1em] bg-white" @click="stopEvent">
      <div class="flex justify-center">個人設定</div>
      <div class="h-[10px]"></div>
      <!--============= 名前 =============-->
      <SettingForm
        :isEditMode="isNameEditRef()"
        formTitle="Name"
        :displayWord="userInfo.name"
        :formModel="formNameRef()"
        :updateFunc="updateName"
      />
      <div class="h-[10px]"></div>
      <!--============= メール =============-->
      <SettingForm
        :isEditMode="isEmailEditRef()"
        formTitle="Email"
        :displayWord="userInfo.email"
        :formModel="formEmailRef()"
        :updateFunc="updateUserEmail"
      />
      <div class="h-[10px]"></div>
      <div class="flex justify-center">
        <!--============= メンバー追加ボタン =============-->
        <button
          class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs h-[25px] pl-2 pr-2 rounded-full"
          @click="controlOpen(true, MODAL_TYPE.MEMBER_EDIT)"
        >チームメンバーメールを登録</button>
        <div class="w-[10px]"></div>
        <!--============= パスワード変更ボタン =============-->
        <button
          class="bg-red-400 text-gray-50 border-[1px] border-gray-600 text-xs h-[25px] pl-2 pr-2 rounded-full"
          @click="updatePassword"
        >パスワード変更</button>
        <div class="w-[10px]"></div>
        <!--============= 閉じる =============-->
        <button
          class="bg-gray-600 text-white text-xs h-[25px] pl-2 pr-2 rounded-full"
          @click="controlOpen(false, MODAL_TYPE.PERSONAL_SETTING); clearForm()"
        >閉じる</button>
      </div>
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
import { getAuth, updateEmail, sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';
//store
import useUserStore from "../../store/useUserStore";
//component
import SettingForm from './module/settingForm.vue';
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
const isNameEditRef = () => isNameEdit;
const formName = ref(userStore.name);
const formNameRef = () => formName;

// const changeNameEdit = (flag: true) => {
//   isNameEdit.value = flag;
// }
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
const isEmailEditRef = () => isEmailEdit;
const formEmail = ref(userStore.email);
const formEmailRef = () => formEmail;

// const changeEmailEdit = (flag: true) => {
//   isEmailEdit.value = flag;
// }
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
      })
  }).catch((error) => {
    alert(error)
  });
  cancelEmailEdit();
}
//■■■■■■■■■■■■■■■■■■■ パスワード変更 ■■■■■■■■■■■■■■■■■■■■
const updatePassword = () => {
  if (auth.currentUser === null || auth.currentUser.email === null) return;
  sendPasswordResetEmail(auth, auth.currentUser.email, actionCodeSettings)
    .then(() => {
      alert("パスワード変更メールを送信しました。メール内容に沿ってパスワードを経行してください。");
      signOut(auth).then(() => {
        location.reload()
      });
    })
    .catch((error) => {
      alert("エラーが発生しました。")
      console.log(error);
    });
}
</script>

<style lang="" scoped>

</style>
