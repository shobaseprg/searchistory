import { defineStore } from "pinia";
import { TopicModel } from "../models/TopicModel"

export default defineStore("useTargetTopicStore", {
  state: () => {
    return {
      targetTopic: new TopicModel("default"),
    };
  },
  getters: {
  },
  actions: {
    setTargetTopic(topic: TopicModel) {
      this.targetTopic = topic;
    },
  },
});
