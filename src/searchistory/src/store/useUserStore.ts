import { defineStore } from "pinia";


type User = {
  uid: string;
  email: string;
};

export default defineStore("useUserStore", {
  state: () => {
    return {
      uid: "test_init_uid",
      email: "test_init_email",
    };
  },
  getters: {
    uidPlusMark: (state) => state.uid + "!",
  },
  actions: {
    change_uid(uid: string) {
      console.log(uid);
      this.uid = uid;
    },
  },
});
