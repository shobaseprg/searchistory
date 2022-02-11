import { db } from "../firebase/config"
import { getDoc, doc } from "firebase/firestore";

const checkExistUID = async (uid: string) => {
  const userSnap = await getDoc(doc(db, "user", uid));
  if (userSnap.exists() && userSnap.data()) {
    return { isExist: true, memberInfo: userSnap.data() }
  } else {
    return { isExist: false, memberInfo: { name: "", uid: "" } }
  }
};

export default checkExistUID;
