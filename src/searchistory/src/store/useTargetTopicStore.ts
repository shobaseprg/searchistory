import { defineStore } from "pinia";
import { TopicModel } from "../models/TopicModel"
import { getMemberInfoList } from "../composable/getUserInfoFromUID";

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
      console.log("↓ 【ログ】topic"); console.log(topic);
      this.targetTopic = topic;
      console.log("↓ 【ログ】this.targetTopic"); console.log(this.targetTopic);

    }
  }
}
)
