import { onBeforeMount } from "vue";
import { getAuth, Auth } from 'firebase/auth';



const auth: Auth = getAuth();
const beforeSetUser = (userStore: any) => {
  return onBeforeMount(() => {
    if (auth.currentUser && userStore.uid === "") {
      userStore.setUserInfo(auth.currentUser?.uid)
    }
  })
}

export default beforeSetUser;
