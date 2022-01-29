<template>
  <select v-model="selectedStatus" v-on:change="statusChange()">
    <option :value="TOPIC_STATUS.PENDING">{{ TOPIC_STATUS_WORD[TOPIC_STATUS.PENDING] }}</option>
    <option :value="TOPIC_STATUS.FINISH">{{ TOPIC_STATUS_WORD[TOPIC_STATUS.FINISH] }}</option>
  </select>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { db } from "../../firebase/config"
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { TOPIC_STATUS, TOPIC_STATUS_WORD, TopicStatus } from "../../models/TopicModel"

interface Props {
  status: TopicStatus,
  docID: string,
}
const { status, docID } = defineProps<Props>();
const selectedStatus = ref(status);

const statusChange = async () => {
  await setDoc(doc(db, "topic", docID), {
    status: selectedStatus.value,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
</script>

<style lang="scss" scoped>
</style>
