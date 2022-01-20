<template>
  <div class="bg-gray-300 h-[100%] flex justify-center items-center">
    <div class="border-2 border-red-500 w-[500px] h-[300px]">
      <p>{{ getPageTitle() }}</p>
      <!-- 名前 -->
      <div v-if="isSignUp">
        <p>名前</p>
        <input
          class="w-[300px] h-[50px] mb-10 text-center border-2 border-pink-300 rounded-full duration-75;"
          type="text"
          v-model="name"
        />
      </div>
      <!-- メール -->
      <div>
        <p>メール</p>
        <input
          class="w-[300px] h-[50px] mb-10 text-center border-2 border-pink-300 rounded-full duration-75;"
          type="text"
          v-model="email"
        />
      </div>
      <!-- パスワード -->
      <div>
        <p>パスワード</p>
        <input
          class="w-[300px] h-[50px] mb-10 text-center border-2 border-pink-300 rounded-full duration-75;"
          type="text"
          v-model="password"
        />
      </div>
      <!-- ボタン -->
      <div>
        <button @click="getActionButton()">{{ getPageTitle() }}</button>
      </div>
      <div>
        <button v-if="isSignUp === false" @click="signin(true)">テストログイン</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import useUserStore from "../../store/useUserStore";

const userStore = useUserStore();
const router = useRouter()
const route = useRoute()

interface Props {
  isSignUp: boolean;
}

const props = defineProps<Props>();

const auth = getAuth();

const name = ref("");
const email = ref("");
const password = ref("");

const createUser = async (uid: string, email: string) => {
  await setDoc(doc(db, 'user', uid), {
    name: name.value,
    uid: uid,
    email: email,
  })
}

const getActionButton = () => {
  props.isSignUp ? signup() : signin()
}

const getPageTitle = () => {
  return props.isSignUp ? "新規登録" : "ログイン";
}

const signin = (isTest: boolean = false) => {
  if (isTest) {
    email.value = "1@g.com";
    password.value = "11111111";
  }
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await userStore.setUserInfo(user.uid)
      router.push('/home');
    })
    .catch((error) => {
      alert(error.message);
    });
};

const signup = () => {
  const auth = getAuth();
  console.log(email.value);
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

</script>
