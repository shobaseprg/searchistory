import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD } from "../models/TopicModel"

export default (topics: Ref<Array<TopicModel>>, uid: string | undefined) => {
  type ownerType = "all" | "me";

  // ----------------------------- 検索 -----------------------------
  const filterWord = ref("");
  const filterOwner = ref<ownerType>("all");
  const changeFilterOwner = (owner: ownerType) => {
    filterOwner.value = owner;
  };

  const filterStatus = ref<TopicStatus>(TOPIC_STATUS.ALL);

  const isOwnerMatch = (topic: TopicModel) => {
    return filterOwner.value === "all" || (filterOwner.value === "me" && topic.uid === uid);
  }

  const isStatusMatch = (topic: TopicModel) => {
    return filterStatus.value === "all" || (filterStatus.value === topic.status);
  };

  const isMatchWord = (topic: TopicModel) => {
    console.log("↓ 【ログ】filterWord.value"); console.log(JSON.stringify(filterWord.value, null, 2));
    console.log("↓ 【ログ】topic.content"); console.log(JSON.stringify(topic.content, null, 2));
    return topic.title.includes(filterWord.value)
  }

  const matchTopics = computed(() => {
    return topics.value.filter((topic: TopicModel) => {
      return isOwnerMatch(topic) && isStatusMatch(topic)
        && isMatchWord(topic)
    }
    )

  });
  return { filterStatus, filterOwner, matchTopics, changeFilterOwner, filterWord }
}
