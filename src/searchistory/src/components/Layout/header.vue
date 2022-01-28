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
//firebase
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
import { controlOpen, MODAL_TYPE, isOpenPersonalSettingRef, isOpenMemberEditRef } from '../../composable/modalControl';
import SettingBaseModal from "../Setting/settingBaseModal.vue";
import MemberEdit from "../Setting/MemberEdit.vue";

//model
//define
const auth = getAuth();
const router = useRouter()
//define store
const userStore = useUserStore();
//logic
const signout = () => {
  signOut(auth).then(() => {
    location.reload
  });
};
</script>

<style lang="scss" scoped></style>
