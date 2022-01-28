import { ref, onBeforeMount, onBeforeUnmount, computed, Ref } from "vue";
import { TopicModel } from "../models/TopicModel"


export default (topics: Ref<Array<TopicModel>>, uid: string | undefined) => {
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
    console.log("↓ 【ログ】topicType.value"); console.log(JSON.stringify(topicType.value, null, 2));
    console.log("↓ 【ログ】topic.uid"); console.log(JSON.stringify(topic.uid, null, 2));
    console.log("↓ 【ログ】uid"); console.log(JSON.stringify(uid, null, 2));


    return topicType.value === "all" || (topicType.value === "me" && topic.uid === uid);
  }

  const matchTopics = computed(() => {
    return topics.value.filter((topic: TopicModel) => {
      return isTypeMatch(topic)
    }
    )

  });
  return { filterStatus, topicType, matchTopics, changeTopicType, filterStatusChange }
}
