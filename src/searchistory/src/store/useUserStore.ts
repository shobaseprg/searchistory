

import { defineStore } from "pinia";
import { getFirestore, getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config"

type User = {
  uid: string;
  email: string;
  name: string;
};

export default defineStore("useUserStore", {
  state: () => {
    return {
      name: "",
      uid: "",
      email: "",
    };
  },
  getters: {
    uidPlusMark: (state) => state.uid + "!",
  },
  actions: {
    change_uid(uid: string) {
      this.uid = uid;
    },
    async setUserInfo(uid: string) {
      const docRef = doc(db, "user", uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data() ?? {};
      this.uid = userData.uid;
      this.email = userData.email;
      this.name = userData.name;
    }
  },
});
