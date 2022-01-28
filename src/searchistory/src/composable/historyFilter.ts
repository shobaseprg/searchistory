import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD } from "../models/TopicModel"
import { HistoryModel } from "../models/HistoryModel";

export default (histories: Ref<HistoryModel[]>) => {

  // ------------------------------- ヒストリー検索 -------------------------------
  const urlFilterWord = ref("");
  const matchHistory = computed(() => {
    return histories.value.filter((history) => {
      return history.url.includes(urlFilterWord.value)
    }
    )
  });

  return { urlFilterWord, matchHistory }
}
