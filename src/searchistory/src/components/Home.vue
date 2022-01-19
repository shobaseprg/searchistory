<template>
  <div>{{ nameRef }}</div>
  <p>home</p>
  <button>事案新規作成</button>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { firebaseApp } from "../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const db = getFirestore(firebaseApp);
const auth = getAuth();

const nameRef = ref("");

onBeforeMount(async () => {
  const querySnapshot = await getDocs(collection(db, "test"));
  const testList: string[] = [];
  querySnapshot.forEach((doc) => {
    testList.push(doc.data().testkey);
    nameRef.value = testList[0];
  });
});

const signout = () => {
  signOut(auth).then(() => {
    router.push('/signin');
  });
};
</script>
