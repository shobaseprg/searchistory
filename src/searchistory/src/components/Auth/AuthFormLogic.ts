import { ref } from "vue";
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import { actionCodeSettings } from "./authOption";

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
  const _checkEmail = (user: User) => {
    if (user.email !== userStore.email) {
      const userRef = doc(db, "userPrivate", user.uid);
      updateDoc(userRef, { email: user.email })
    }
  }
  // サインイン
  const signin = async () => {
    await signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await userStore.setUserInfo(user.uid);
        _checkEmail(user);
        router.push('/home');
      })
      .catch((error) => {
        alert(error.message);
      });
  };
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
              alert("確認メールを送りました。メールを確認後ログインしてください。")
            }).catch((e) => {
              alert(e)
            });
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  return { name, email, password, createUser, getActionButton, getPageTitle, signin, signup }
}
