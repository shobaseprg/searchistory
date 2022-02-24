import { query, where, collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from "../firebase/config";
import { getAuth } from 'firebase/auth';
//■■■■■■■■■■■■■■■■■ モジュール ■■■■■■■■■■■■■■■■■

const _isIncludeSpace = (word: string, target: string) => {
  const spaceReg = /\s/g;
  if (spaceReg.test(target)) {
    return `${word}には空白を含めることはできません。`
  }
  return "";
}

const _lengthRange = (title: string, target: string, min: number, max: number) => {
  if (target.length > max || target.length < min) {
    return `${title}は${min}文字以上、${max}文字以下で登録してください。`;
  } else {
    return "";
  }
}


const checkExistUID = async (uid: string) => {
  const userSnap = await getDoc(doc(db, "user", uid));
  if (userSnap.exists() && userSnap.data()) {
    return { isExist: true, memberInfo: userSnap.data() }
  } else {
    return { isExist: false, memberInfo: { name: "", uid: "" } }
  }
};


// const topicTitleValidsate = (word: string) => {
//   if (word.length > 10) {
//     return false;
//   } else {
//     return true;
//   }
// }
//■■■■■■■■■■■■■■■■■ サインアップ ■■■■■■■■■■■■■■■■■
const nameVali = async (inputName: string) => {

  let errorMessage = "";

  errorMessage = errorMessage + _lengthRange("ユーザー名", inputName, 3, 30)
  errorMessage = errorMessage + _isIncludeSpace("ユーザー名", inputName)

  if (errorMessage !== "") {
    return errorMessage;
  }

  //============= 重複チェック =============
  const userColRef = collection(db, "user");
  const q = query(userColRef, where("name", "==", inputName));
  const userDocs = await getDocs(q);

  if (userDocs.docs.length >= 1) {
    errorMessage = "そのユーザー名は既に存在しているため、異なる名前を設定してください。";
  }
  return errorMessage;
}

//■■■■■■■■■■■■■■■■■ メンバー追加 ■■■■■■■■■■■■■■■■■
const addMemberVali = (uid: string, memberUIDs: string[]) => {

  let errorMessage = "";

  const auth = getAuth();

  if (auth.currentUser?.uid === uid) {
    errorMessage = errorMessage + "そのIDは自分のIDです。";
  }
  if (memberUIDs.includes(uid)) {
    errorMessage = errorMessage + "そのIDのユーザーは既に登録されています。";
  }
  return errorMessage;
}

export { nameVali, addMemberVali, checkExistUID };
