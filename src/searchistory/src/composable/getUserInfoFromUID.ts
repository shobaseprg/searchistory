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
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);
  return snap.exists() ? snap.data() : { name: "", uid: "" }
}

const getMemberInfoList = async (memberUidList: string[]) => {
  const array = [];
  for (let i = 0; i < memberUidList.length; i++) {
    const memberInfoData = await getUserInfo(memberUidList[i]);
    const memberInfo = {
      uid: typeof memberInfoData.uid === "string" ? memberInfoData.uid : "",
      name: typeof memberInfoData.name === "string" ? memberInfoData.name : "",
    }
    array.push(memberInfo);
  }
  return array;
};

export { getUserInfo, getMemberInfoList };
