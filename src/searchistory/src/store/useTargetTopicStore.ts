import { defineStore } from "pinia";
import { TopicModel } from "../models/TopicModel"

export default defineStore("useTargetTopicStore", {
  state: () => {
    return {
      targetTopic: new TopicModel("default"),
      authorizedMemberInfos: [{ name: "", uid: "", email: "" }]
    };
  },
  getters: {
  },
  actions: {
    setTarget(topic: TopicModel) {
      this.targetTopic = topic;
    }
  }
}
)
