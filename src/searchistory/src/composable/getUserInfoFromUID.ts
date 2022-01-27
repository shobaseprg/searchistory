import {
  collection,
  serverTimestamp,
  doc,
  setDoc,
  DocumentData,
  getDoc,
} from 'firebase/firestore';

import { db } from "../firebase/config";

const getUserInfo = async (uid: string) => {
  const userDocRef = doc(db, "user", uid);
  const snap = await getDoc(userDocRef);
  return snap.exists() ? snap.data() : { name: "", email: "", uid: "" }
}

const getMemberInfoList = async (memberUIDs: string[]) => {
  const array = [];
  for (let i = 0; i < memberUIDs.length; i++) {
    const memberInfoData = await getUserInfo(memberUIDs[i]);
    const memberInfo = {
      uid: typeof memberInfoData.uid === "string" ? memberInfoData.uid : "",
      name: typeof memberInfoData.name === "string" ? memberInfoData.name : "",
      email: typeof memberInfoData.email === "string" ? memberInfoData.email : "",
    }
    array.push(memberInfo);
  }
  return array;
};

export { getUserInfo, getMemberInfoList };
