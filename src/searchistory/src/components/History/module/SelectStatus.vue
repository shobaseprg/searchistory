<!-- <template>
  <select v-model="selectedStatus" v-on:change="statusChange()">
    <option :value="HISTORY_STATUS.PENDING">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.PENDING] }}</option>
    <option :value="HISTORY_STATUS.UNSOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.UNSOLVED] }}</option>
    <option :value="HISTORY_STATUS.SOLVED">{{ HISTORY_STATUS_WORD[HISTORY_STATUS.SOLVED] }}</option>
  </select>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { db } from "../../../firebase/config"
import { getAuth, signOut } from 'firebase/auth';
import { setDoc, getFirestore, getDocs, collection, doc, serverTimestamp } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { HISTORY_STATUS, HISTORY_STATUS_WORD, HistoryStatus } from "../../../models/HistoryModel"
import useTargetHistoryStore from "../../../store/useTargetHistoryStore";
import useTargetTopicStore from "../../../store/useTargetTopicStore";

const targetHistoryStore = useTargetHistoryStore();
const targetTopicStore = useTargetTopicStore();

const router = useRouter()
const auth = getAuth();

const selectedStatus = ref(targetHistoryStore.targetHistory.status);

const statusChange = async () => {
  await setDoc(doc(db, "topic", targetTopicStore.targetTopic.docID, "history", targetHistoryStore.targetHistory.docID), {
    status: selectedStatus.value,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
</script>

<style lang="scss" scoped>
</style> -->
