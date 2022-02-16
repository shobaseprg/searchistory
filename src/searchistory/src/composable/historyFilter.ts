import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { HistoryModel, HistoryStatus, HISTORY_STATUS } from "../models/HistoryModel";

export default (histories: Ref<HistoryModel[]>) => {

  // ------------------------------- ヒストリー検索 -------------------------------
  const urlFilterWord = ref("");
  const docIdFilterWord = ref("");
  const filterStatus = ref<HistoryStatus>(HISTORY_STATUS.ALL);

  const isStatusMatch = (history: HistoryModel): boolean => {
    return filterStatus.value === "all" || (filterStatus.value === history.status);
  };

  const matchHistory = computed(() => {
    return histories.value.filter((history) => {
      return history.url.includes(urlFilterWord.value) &&
        history.docID.includes(docIdFilterWord.value) &&
        isStatusMatch(history)
    }
    )
  });

  return { urlFilterWord, docIdFilterWord, filterStatus, matchHistory }
}
