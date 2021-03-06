import { ref } from "vue";
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';
import { doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import { actionCodeSettings } from "./authOption";
import { fbErrorHandle } from "../../composable/fbErrorHandle";
import { nameVali } from "../../composable/validate";


export default (props: any, useUserStore: any) => {
  const userStore = useUserStore();
  const router = useRouter()

  const auth = getAuth();

  const name = ref("");
  const email = ref("");
  const password = ref("");

  const createUser = async (uid: string) => {
    await setDoc(doc(db, 'users', uid), {
      name: name.value,
      uid: uid,
    })
    await setDoc(doc(db, 'private_users', uid), {
      uid: uid,
      member_uid_list: [],
    })
  }

  const getActionButton = () => {
    props.isSignUp ? signup() : signin()
  }

  const getPageTitle = () => {
    return props.isSignUp ? "SIGN UP" : "SIGN IN";
  }

  //■■■■■■■■■■■■■■■■■■■ サインイン ■■■■■■■■■■■■■■■■■■■■
  const signin = async () => {
    await signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await userStore.setUserInfo(user.uid);
        router.push('/home');
      })
      .catch((error) => {
        fbErrorHandle(error.message);
      });
  };
  //■■■■■■■■■■■■■■■■■■■ サインアップ ■■■■■■■■■■■■■■■■■■■■
  const signup = async () => {
    const valiResult = await nameVali(name.value);
    if (valiResult !== "") {
      alert(valiResult)
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await createUser(user.uid);
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
              alert("確認メールを送りました。メールを確認後ログインしてください。確認メールが届かない場合は、サインイン画面より再送を行ってください。")
            }).catch((e) => {
              alert(e)
            });
        }
      })
      .catch((error) => {
        fbErrorHandle(error.message);
      });
  }
  //■■■■■■■■■■■■■■■■■■■ 再送する。 ■■■■■■■■■■■■■■■■■■■■
  const reSend = async () => {
    await signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async () => {
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser, actionCodeSettings)
            .then(() => {
              alert("確認メールを送りました。メールを確認後ログインしてください。確認メールが届かない場合は、サインイン画面より再送を行ってください。")
            }).catch((e) => {
              alert(e)
            });
        }
      })
      .catch((error) => {
        fbErrorHandle(error.message);
      });
  };
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
  //■■■■■■■■■■■■■■■■■ エラーハンドル ■■■■■■■■■■■■■■■■■
  const errorHandle = (errorMessage: string) => {
  }

  return { name, email, password, createUser, getActionButton, getPageTitle, movePage, reSend, isPasswordModal, passwordModalControl }

}
