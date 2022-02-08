import { db } from "../firebase/config"
import { getDocs, collection, query, where } from "firebase/firestore";

const checkExistUID = async (uid: string) => {
  const q = query(collection(db, "user"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length == 0) {
    return { isExist: false, memberInfo: { name: "", uid: "" } }
  } else {
    return { isExist: true, memberInfo: querySnapshot.docs[0].data() }
  }
};

export default checkExistUID;
