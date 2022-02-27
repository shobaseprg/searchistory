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
      member_uid_list: [""],
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
      onSnapshot(doc(db, "users", uid), async (doc) => {
        const userData = doc.data() ?? {};
        this.uid = auth.currentUser?.uid ?? "no data";
        this.name = userData.name;
      }
      )
      onSnapshot(doc(db, "private_users", uid), async (doc) => {
        const userPrivateData = doc.data() ?? {};
        this.email = auth.currentUser?.email ?? "no data";
        this.member_uid_list = userPrivateData.member_uid_list ?? "no data";
        this.memberInfos = await getMemberInfoList(this.member_uid_list);
      }
      )
    },
  }
}
)
