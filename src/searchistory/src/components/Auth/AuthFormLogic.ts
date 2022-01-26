import { ref } from "vue";
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";

export default (props: any, useUserStore: any) => {
  const userStore = useUserStore();
  const router = useRouter()

  const auth = getAuth();

  const name = ref("");
  const email = ref("");
  const password = ref("");

  const createUser = async (uid: string, email: string) => {
    await setDoc(doc(db, 'user', uid), {
      name: name.value,
      uid: uid,
      email: email,
      members: [],
    })
  }

  const getActionButton = () => {
    props.isSignUp ? signup() : signin()
  }

  const getPageTitle = () => {
    return props.isSignUp ? "新規登録" : "ログイン";
  }
  // サインイン
  const signin = async (isTest: boolean = false) => {
    if (isTest) {
      email.value = "1@g.com";
      password.value = "11111111";
    }
    return await signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await userStore.setUserInfo(user.uid)
        router.push('/home');
        return true;
      })
      .catch((error) => {
        alert(error.message);
        return false;
      });
  };
  // サインアップ
  const signup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await createUser(user.uid, user.email ?? "");
        await userStore.setUserInfo(user.uid)
        router.push('/home');
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  return { name, email, password, createUser, getActionButton, getPageTitle, signin, signup }
}