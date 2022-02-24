import { defineStore } from "pinia";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"
import { getMemberInfoList } from "../composable/getUserInfoFromUID";
import { getAuth } from 'firebase/auth';
const auth = getAuth();

export default defineStore("useUserStore", {
  state: () => {
    return {
      name: "",
      uid: "",
      email: "",
      memberUIDs: [""],
      memberInfos: [{ uid: "", name: "" }],
    };
  },
  getters: {
    user: (state) => state.uid,
  },
  actions: {
    change_uid(uid: string) {
      this.uid = uid;
    },
    async setUserInfo(uid: string) {
      onSnapshot(doc(db, "user", uid), async (doc) => {
        const userData = doc.data() ?? {};
        this.uid = auth.currentUser?.uid ?? "no data";
        this.name = userData.name;
      }
      )
      onSnapshot(doc(db, "userPrivate", uid), async (doc) => {
        const userPrivateData = doc.data() ?? {};
        this.email = auth.currentUser?.email ?? "no data";
        this.memberUIDs = userPrivateData.memberUIDs ?? "no data";
        this.memberInfos = await getMemberInfoList(this.memberUIDs);
      }
      )
    },
  }
}
)
