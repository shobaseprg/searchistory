import { defineStore } from "pinia";
import { HistoryModel } from "../models/HistoryModel"

export default defineStore("useTargetHistoryStore", {
  state: () => {
    return {
      targetHistory: new HistoryModel("default"),
    };
  },
  getters: {
  },
  actions: {
    setTargetHistory(topic: HistoryModel) {
      this.targetHistory = topic;
    },
  },
});
