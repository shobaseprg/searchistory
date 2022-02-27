import { ref, onBeforeMount, onBeforeUnmount, computed, Ref, ComputedRef } from "vue";
import { TopicModel, TopicStatus, TOPIC_STATUS, TOPIC_STATUS_WORD, TOPIC_OWNER, TopicOwner } from "../models/TopicModel"


export default (topics: Ref<Array<TopicModel>>, uid: string | undefined) => {
  //■■■■■■■■■■■■■■■■■■■ owner ■■■■■■■■■■■■■■■■■■■■
  const filterOwner = ref<TopicOwner>("all");

  const isOwnerMatch = (topic: TopicModel): boolean => {
    return filterOwner.value === "all" || (filterOwner.value === "me" && topic.uid === uid);
  }
  //■■■■■■■■■■■■■■■■■■■ status ■■■■■■■■■■■■■■■■■■■■
  const filterStatus = ref<TopicStatus>(TOPIC_STATUS.ALL);

  const isStatusMatch = (topic: TopicModel): boolean => {
    return filterStatus.value === "all" || (filterStatus.value === topic.status);
  };
  //■■■■■■■■■■■■■■■■■■■ word ■■■■■■■■■■■■■■■■■■■■
  const filterWord = ref("");
  const docIdFilterWord = ref("");

  const isMatchWord = (topic: TopicModel): boolean => {
    return topic.title.includes(filterWord.value) || topic.doc_id.includes(filterWord.value);
  }
  //■■■■■■■■■■■■■■■■■■■ check_filter ■■■■■■■■■■■■■■■■■■■■
  const matchTopics = computed(() => {
    return topics.value.filter((topic: TopicModel) => {
      return isOwnerMatch(topic) && isStatusMatch(topic)
        && isMatchWord(topic)
    }
    )
  });

  return { filterStatus, docIdFilterWord, filterOwner, matchTopics, filterWord }
}
