import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { TopicModel } from "../models/TopicModel"

import { createApp } from "vue";
import App from "../../src/App.vue"
import { createPinia } from 'pinia'

createApp(App).use(createPinia())
import useUserStore from "../store/useUserStore";
const userStore = useUserStore();

export default (topics: Ref<Array<TopicModel>>) => {
  type TopicType = "all" | "me";
  // ----------------------------- 検索 -----------------------------
  const filterStatus = ref("全て");
  const topicType = ref<TopicType>("all");

  const filterStatusChange = () => {

  };

  const changeTopicType = (type: TopicType) => {
    topicType.value = type;
  };

  const isTypeMatch = (topic: TopicModel) => {
    if (topicType.value === "all") true;
    if (topicType.value === "me" && topic.uid === userStore.uid) true;
    return false;
  }

  const matchTopics = computed(() => {
    return topics.value.filter((topic: TopicModel) => {
      isTypeMatch(topic)
    }
    )

  });
  return { filterStatus, topicType, matchTopics, changeTopicType, filterStatusChange }
}
