<template>
  <!-- モーダル時背景 -->
  <div
    @click="controlOpen(false, MODAL_TYPE.MEMBER_EMAIL)"
    class="z-[3000] w-[100%] h-[100%] bg-opacity-[0.5] fixed left-0 top-0 flex items-center justify-center"
  >
    <div class="border-2 border-black z-[2] w-[50%] p-[1em] bg-white" @click="stopEvent">
      <p>チームメンバーメール</p>
      <div class="flex"></div>
      <!-- <button @click="controlOpen(true,MODAL_TYPE.MEMBER_EMAIL)">チームメンバーメールを登録</button> -->
      <!-- <button @click>更新</button> -->
      <button @click="controlOpen(false, MODAL_TYPE.MEMBER_EMAIL);">閉じる</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//vue plugin
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
import { db } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDoc, collection, doc } from "firebase/firestore";
import { controlOpen, MODAL_TYPE, isOpenMemberEmailRef } from "../../composable/modalControl";
//store
import useUserStore from "../../store/useUserStore";
//component
//composable
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
const userStore = useUserStore();

//logic

onBeforeMount(async () => {
  const docRef = doc(db, "user", userStore.uid);
  console.log("▼【ログ】userStore.uid");
  console.log(userStore.uid);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

});
const stopEvent = (event: any) => {
  event.stopPropagation();
};

</script>

<style lang="scss" scoped>
</style>
