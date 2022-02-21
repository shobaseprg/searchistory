<template>
  <!--■■■■■■■■■■■■■■■■■ modal background ■■■■■■■■■■■■■■■■■-->
  <div
    @click="controlOpen(false, MODAL_TYPE.RESET_PASSWORD)"
    class="z-[1] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center bg-black"
  >
    <!--■■■■■■■■■■■■■■■■■ modal ■■■■■■■■■■■■■■■■■-->
    <div
      class="z-[2] flex flex-col justify-center items-center w-[500px] p-[1em] bg-white"
      @click="stopEvent"
    >
      <p class="text-gray-500 text-xl">パスワード再設定</p>
      <!------------------- mail ------------------->
      <InputForm :formModelRef="emailRef()" type="text" formTitle="Email" />
      <!------------------- button ------------------->
      <button class="mt-10 w-[90%] h-8 bg-red-400 text-white" @click="updatePassword">再設定メールを送る</button>
      <!------------------- close ------------------->
      <div class="h-3"></div>
      <button
        class="bg-gray-600 text-white p-1 rounded-md"
        @click="controlOpen(false, MODAL_TYPE.RESET_PASSWORD);"
      >閉じる</button>
    </div>
  </div>
</template>
<!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SCRIPT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
<script setup lang="ts">
//vue plugin
import { ref } from 'vue';
import { useRouter } from "vue-router";
//firebase
import { getAuth, Auth, sendPasswordResetEmail } from 'firebase/auth';
//store
//component
import InputForm from "../module/inputForm.vue"
//composable
import { controlOpen, MODAL_TYPE } from '../../../composable/modalControl';
import { stopEvent } from "../../../composable/post"
// option
import { actionCodeSettings } from "../authOption";
//define
const auth: Auth = getAuth();
//■■■■■■■■■■■■■■■■■■■ パスワード変更 ■■■■■■■■■■■■■■■■■■■■
const email = ref("");
const emailRef = () => email;

const updatePassword = () => {
  sendPasswordResetEmail(auth, email.value, actionCodeSettings)
    .then(() => {
      alert("パスワード変更メールを送信しました。メール内容に沿ってパスワードを変更してください。");
    })
    .catch((error) => {
      alert("エラーが発生しました。")
      console.log(error);
    });
  controlOpen(false, MODAL_TYPE.RESET_PASSWORD);
}

</script>

<style lang="" scoped>
</style>
