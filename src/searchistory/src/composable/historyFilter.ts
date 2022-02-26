import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { HistoryModel, HistoryStatus, HISTORY_STATUS } from "../models/HistoryModel";

export default (histories: Ref<HistoryModel[]>, uid: string | undefined) => {

  const urlFilterWord = ref("");
  const docIdFilterWord = ref("");
  //■■■■■■■■■■■■■■■■■■■ owner ■■■■■■■■■■■■■■■■■■■■
  const filterOwner = ref("all")

  const isOwnerMatch = (history: HistoryModel): boolean => {
    return filterOwner.value === "all" || (filterOwner.value === "my" && history.uid === uid);
  };
  //■■■■■■■■■■■■■■■■■■■ status ■■■■■■■■■■■■■■■■■■■■
  const filterStatus = ref<HistoryStatus>(HISTORY_STATUS.ALL);

  const isStatusMatch = (history: HistoryModel): boolean => {
    return filterStatus.value === "all" || (filterStatus.value === history.status);
  };
  //■■■■■■■■■■■■■■■■■■■ check_filter ■■■■■■■■■■■■■■■■■■■■
  const matchHistory = computed(() => {
    return histories.value.filter((history) => {
      return history.url.includes(urlFilterWord.value) &&
        history.docID.includes(docIdFilterWord.value) &&
        isStatusMatch(history) &&
        isOwnerMatch(history);
    }
    )
  });

  return { urlFilterWord, docIdFilterWord, filterStatus, filterOwner, matchHistory }
}
