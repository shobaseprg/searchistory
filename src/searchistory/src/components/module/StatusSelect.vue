<template>
  <select v-model="selectedStatus" v-on:change="statusChange()">
    <option :value="TOPIC_STATUS.PENDING">{{ disWord[TOPIC_STATUS.PENDING] }}</option>
    <option :value="TOPIC_STATUS.FINISH">{{ disWord[TOPIC_STATUS.FINISH] }}</option>
  </select>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { firebaseApp } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { setDoc, getFirestore, getDocs, collection, doc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const db = getFirestore(firebaseApp);
const auth = getAuth();

import { TOPIC_STATUS, disWord, TopicStatus } from "../../models/TopicModel"

interface Props {
  status: TopicStatus,
  docID: string,
}
const { status, docID } = defineProps<Props>();
const selectedStatus = ref(status);

const statusChange = async () => {
  console.log(docID)
  console.log(status)
  await setDoc(doc(db, "topic", docID), {
    status: selectedStatus.value
  }, { merge: true });
}
</script>

<style lang="scss" scoped>
</style>
