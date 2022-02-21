<template>
  <!--■■■■■■■■■■■■■■■■■ password modal ■■■■■■■■■■■■■■■■■-->
  <ResetPasswordModal v-if="isResetPassWordRef" />
  <!--■■■■■■■■■■■■■■■■■ center wrap ■■■■■■■■■■■■■■■■■-->
  <div class="flex justify-center items-center flex-col">
    <!--================= title =================-->
    <div
      class="w-[300px] h-[50px] mb-10 text-center border-2 border-black background bg-pink-400 rounded-full leading-[50px] text-xl"
    >- SEARCHISTORY -</div>
    <!--=================  center form =================-->
    <div class="flex flex-col justify-center p-[30px] items-center bg-white w-[350px]">
      <p class="text-gray-500 text-xl">{{ getPageTitle() }}</p>
      <!------------------- name ------------------->
      <InputForm
        v-if="props.isSignUp"
        :isSignUp="props.isSignUp"
        :formModelRef="nameRef()"
        type="text"
        formTitle="Name"
      />
      <!------------------- mail ------------------->
      <InputForm :formModelRef="emailRef()" type="text" formTitle="Email" />
      <!------------------- password ------------------->
      <InputForm :formModelRef="passwordRef()" type="password" formTitle="Password" />
      <!------------------- button ------------------->
      <button
        class="mt-10 w-[90%] h-8 bg-red-400 text-white"
        @click="getActionButton()"
      >{{ getPageTitle() }}</button>
      <!------------------- move page ------------------->
      <button
        class="text-gray-500 text-xs mt-6"
        @click="movePage(isSignUp)"
      >{{ isSignUp ? "ログインはこちら" : "新規登録はこちら" }}</button>
      <!------------------- if forget ------------------->
      <button
        v-if="!isSignUp"
        class="text-gray-500 text-xs mt-3"
        @click="controlOpen(true, MODAL_TYPE.RESET_PASSWORD)"
      >パスワードをお忘れの場合</button>
    </div>
  </div>
</template>
<!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ SCRIPT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
<script setup lang="ts">
import useUserStore from "../../store/useUserStore";
import logic from "./AuthFormLogic";
import ResetPasswordModal from "../Auth/module/ResetPasswordModal.vue"
import InputForm from "./module/InputForm.vue"
import { controlOpen, isResetPassWordRef, MODAL_TYPE } from '../../composable/modalControl';

interface Props {
  isSignUp: boolean;
}

const props = defineProps<Props>();

const nameRef = () => name;
const emailRef = () => email;
const passwordRef = () => password;

const { name, email, password, getActionButton, getPageTitle, movePage } = logic(props, useUserStore);
</script>
