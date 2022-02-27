<template>
  <select v-model="selectedStatus" v-on:change="statusChange()">
    <option :value="HISTORY_STATUS.PENDING">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.PENDING] }}</option>
    <option :value="HISTORY_STATUS.UNSOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.UNSOLVED] }}</option>
    <option :value="HISTORY_STATUS.SOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.SOLVED] }}</option>
  </select>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { db } from "../../../firebase/config"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { HISTORY_STATUS, HISTORY_STATUS_WORD, HistoryStatus, historyStatusList } from "../../../models/HistoryModel"
import useTargetTopicStore from "../../../store/useTargetTopicStore";

interface Props {
  status: HistoryStatus,
  doc_id: string,
}
const { status, doc_id } = defineProps<Props>();

const targetTopicStore = useTargetTopicStore();

const selectedStatus = ref(status);

const statusChange = async () => {
  await updateDoc(doc(db, "topics", targetTopicStore.targetTopic.doc_id, "histories", doc_id), {
    status: historyStatusList.findIndex(status => status === selectedStatus.value),
    updated_at: serverTimestamp(),
  });
}
</script>

<style lang="scss" scoped>
</style>
