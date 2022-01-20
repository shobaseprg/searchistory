<template>
  <div>{{ nameRef }}</div>
  <p>home</p>
  <p>{{ uid }}</p>
  <p>{{ newUid }}</p>
  <button @click="controlModal(true)">事案新規作成</button>
  <createTopicModal v-if="isOpenCreateTopicModal" :controlModal="controlModal" />
  <button @click="stateChange">statechange</button>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import { firebaseApp } from "../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import useUserStore from "../store/useUserStore";
import createTopicModal from "./Topic/createTopicModal.vue";
import { storeToRefs } from 'pinia'

const router = useRouter()
const db = getFirestore(firebaseApp);
const auth = getAuth();

const userStore = useUserStore();

const { uid } = storeToRefs(userStore);

const nameRef = ref("");

const stateChange = () => {
  userStore.change_uid('changed');
}

const newUid = computed(() => {
  return userStore.uidPlusMark;
}
)

onBeforeMount(async () => {
  const querySnapshot = await getDocs(collection(db, "test"));
  const testList: string[] = [];
  querySnapshot.forEach((doc) => {
    testList.push(doc.data().testkey);
    nameRef.value = testList[0];
  });
});

const isOpenCreateTopicModal = ref(false)

const controlModal = (flag: boolean) => {
  isOpenCreateTopicModal.value = flag;
}

</script>
