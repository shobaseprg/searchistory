<template>
  <select class="outline-none" v-model="selectedStatus" v-on:change="statusChange()">
    <option :value="TOPIC_STATUS.PENDING">{{ TOPIC_STATUS_WORD[TOPIC_STATUS.PENDING] }}</option>
    <option :value="TOPIC_STATUS.FINISH">{{ TOPIC_STATUS_WORD[TOPIC_STATUS.FINISH] }}</option>
  </select>
</template>

<script setup lang="ts">

import { computed, ref, watch } from "vue";
import { db } from "../../firebase/config"
import { setDoc, doc } from "firebase/firestore";
import { TOPIC_STATUS, TOPIC_STATUS_WORD, TopicStatus, topicStatusList } from "../../models/TopicModel"

interface Props {
  status: TopicStatus,
  doc_id: string,
}
const props = defineProps<Props>();

const propsStatus = computed(() => {
  return props.status;
})

const selectedStatus = ref(propsStatus.value);

watch(propsStatus, (value) => {
  selectedStatus.value = value;
})

const statusChange = async () => {
  await setDoc(doc(db, "topics", props.doc_id), {
    status: topicStatusList.findIndex(status => status === selectedStatus.value)
  }, { merge: true });
}
</script>

<style lang="scss" scoped>
</style>
