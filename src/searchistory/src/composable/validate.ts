import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/config";

const topicTitleValidate = (word: string) => {
  if (word.length > 10) {
    return false;
  } else {
    return true;
  }
}
//■■■■■■■■■■■■■■■■■ サインアップ ■■■■■■■■■■■■■■■■■
const signUpVali = async (inputName: string, inputEmail: string, inputPassword: string) => {
  let errorMessage = null;
  const userColRef = collection(db, "user");
  const q = query(userColRef, where("name", "==", inputName));
  const userDocs = await getDocs(q);

  if (userDocs.docs.length >= 1) {
    errorMessage = "そのユーザー名は既に存在しているため、異なる名前を設定してください。";
    console.log("重複");
    console.log("⬇︎【ログ】", "errorMessage"); console.log(errorMessage);

    return errorMessage;
  }
  console.log("⬇︎【ログ】", "errorMessage"); console.log(errorMessage);

  return errorMessage;

}

export { signUpVali };
