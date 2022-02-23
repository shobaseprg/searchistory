import { ref } from "vue";
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import { actionCodeSettings } from "./authOption";
import { fbErrorHandle } from "../../composable/fbErrorHandle";
import { signUpVali } from "../../composable/validate";


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
    return props.isSignUp ? "SIGN UP" : "SIGN IN";
  }
  const _checkEmail = (user: User) => {
    if (user.email !== userStore.email) {
      const userRef = doc(db, "userPrivate", user.uid);
      updateDoc(userRef, { email: user.email })
    }
  }
  //■■■■■■■■■■■■■■■■■■■ サインイン ■■■■■■■■■■■■■■■■■■■■
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
  //■■■■■■■■■■■■■■■■■■■ サインアップ ■■■■■■■■■■■■■■■■■■■■
  const signup = async () => {
    const valiResult = await signUpVali(name.value, email.value, password.value);
    if (valiResult) {
      alert(valiResult)
      return;
    }
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
        fbErrorHandle(error.message);
      });
  }
  //■■■■■■■■■■■■■■■■■■■ 移動 ■■■■■■■■■■■■■■■■■■■■
  const movePage = (isSignUp: boolean) => {
    switch (isSignUp) {
      case true:
        router.push("/signin")
        break;
      case false:
        router.push("/signup")
        break;
      default:
        break;
    }
  }
  //■■■■■■■■■■■■■■■■■■■ パスワード再発行 ■■■■■■■■■■■■■■■■■■■■
  const isPasswordModal = ref(false);

  const passwordModalControl = (flag: boolean) => {
    isPasswordModal.value = flag;
  }
  return { name, email, password, createUser, getActionButton, getPageTitle, movePage, isPasswordModal, passwordModalControl }

  //■■■■■■■■■■■■■■■■■ エラーハンドル ■■■■■■■■■■■■■■■■■
  const errorHandle = (errorMessage: string) => {

  }

}
