import { defineStore } from "pinia";
// import { getFirestore, getDocs, collection, getDoc, doc } from "firebase/firestore";
// import { db } from "../firebase/config"
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
