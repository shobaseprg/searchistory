import { db } from "../firebase/config"
import { getDocs, collection, query, where } from "firebase/firestore";


const checkExistEmail = async (email: string) => {
  const q = query(collection(db, "user"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length == 0) {
    return { isExist: false, memberInfo: {} }
  } else {
    return { isExist: true, memberInfo: querySnapshot.docs[0].data() }
  }
};

export default checkExistEmail;
