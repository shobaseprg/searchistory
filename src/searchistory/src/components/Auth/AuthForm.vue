<template>
  <p>{{ getPageTitle() }}</p>
  <div>
    <p>メール</p>
    <input type="text" v-model="email" class="border-black border-2" />
  </div>
  <div>
    <p>パスワード</p>
    <input type="text" v-model="password" class="border-black border-2" />
  </div>
  <button @click="getActionButton()">{{ getPageTitle() }}</button>
  <button v-if="isSignUp === false" @click="signin(true)">テストログイン</button>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../../firebase/config";

const router = useRouter()
const route = useRoute()

interface Props {
  isSignUp: boolean;
}

const props = defineProps<Props>();

const auth = getAuth();

const email = ref("");
const password = ref("");

const createUser = async (user: User) => {
  await setDoc(doc(db, 'user', user.uid), {
    uid: user.uid,
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
      console.log("ok");
      // await setUserInfo(ctx, user.uid);
      router.push('/home');
    })
    .catch((error) => {
      alert(error.message);
    });
};

const signup = () => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await createUser(user);
      console.log(user.uid);
      console.log("signup");
      // setUserInfo(ctx, user.uid);
      router.push('/home');
    })
    .catch((error) => {
      alert(error.message);
    });

}

</script>
