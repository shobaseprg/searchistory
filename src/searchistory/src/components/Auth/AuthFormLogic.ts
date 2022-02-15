import { ref } from "vue";
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, addDoc } from 'firebase/firestore';
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
    })
    await setDoc(doc(db, 'userPrivate', uid), {
      uid: uid,
      email: email,
      memberUIDs: [],
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
      if (import.meta.env.VITE_ENV === "development") {
        email.value = "1@g.com";
      } else {
        email.value = "1s@g.com"
      }
      password.value = "11111111";
    }
    await signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await userStore.setUserInfo(user.uid)
        router.push('/home');
        // return true;
      })
      .catch((error) => {
        alert(error.message);
        // return false;
      });
  };
  const actionCodeSettings = {
    url: "http://localhost:3000/home",
  }
  // サインアップ
  const signup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await createUser(user.uid, user.email ?? "");
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
              alert("認証メールを送りました。")
            }).catch((e) => {
              alert(e)
            });
        }
        // await userStore.setUserInfo(user.uid)
        // router.push('/home');
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  return { name, email, password, createUser, getActionButton, getPageTitle, signin, signup }
}
