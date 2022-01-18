<template>
  <div>{{ nameRef }}</div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onBeforeMount } from "vue";

import { firebaseApp } from "../firebase/config";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import {} from "vue";
const db = getFirestore(firebaseApp);

const nameRef = ref("");

onBeforeMount(async () => {
  const querySnapshot = await getDocs(collection(db, "test"));
  const testList: string[] = [];
  querySnapshot.forEach((doc) => {
    testList.push(doc.data().testkey);
    nameRef.value = testList[0];
  });
});
</script>
