import { ref, onBeforeMount, onBeforeUnmount, computed, Ref, ComputedRef } from "vue";
import { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD } from "../models/TopicModel"

export default (topics: Ref<Array<TopicModel>>, uid: string | undefined) => {
  type ownerType = "all" | "me";
  // ----------------------------- トピック検索 -----------------------------
  const filterWord = ref("");
  const docIdFilterWord = ref("");
  const filterOwner = ref<ownerType>("all");
  const changeFilterOwner = (owner: ownerType) => {
    filterOwner.value = owner;
  };

  const filterStatus = ref<TopicStatus>(TOPIC_STATUS.ALL);

  const isOwnerMatch = (topic: TopicModel): boolean => {
    return filterOwner.value === "all" || (filterOwner.value === "me" && topic.uid === uid);
  }

  const isStatusMatch = (topic: TopicModel): boolean => {
    return filterStatus.value === "all" || (filterStatus.value === topic.status);
  };

  const isMatchWord = (topic: TopicModel): boolean => {
    return topic.title.includes(filterWord.value)
  }

  const matchTopics = computed(() => {
    return topics.value.filter((topic: TopicModel) => {
      return isOwnerMatch(topic) && isStatusMatch(topic)
        && isMatchWord(topic)
    }
    )
  });

  return { filterStatus, docIdFilterWord, filterOwner, matchTopics, changeFilterOwner, filterWord }
}
