

import { defineStore } from "pinia";
import { getFirestore, getDocs, collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"

type User = {
  uid: string;
  email: string;
  name: string;
  memberEmails: string[]
};

export default defineStore("useUserStore", {
  state: () => {
    return {
      name: "",
      uid: "",
      email: "",
      memberEmails: [""],
    };
  },
  getters: {
    user: (state) => state.uid + "!",
  },
  actions: {
    change_uid(uid: string) {
      this.uid = uid;
    },
    async setUserInfo(uid: string) {
      onSnapshot(doc(db, "user", uid), async (doc) => {
        const userData = doc.data() ?? {};
        this.uid = userData.uid;
        this.email = userData.email;
        this.name = userData.name;
        this.memberEmails = userData.memberEmails;
      }
      )
    }
  }
}
)
