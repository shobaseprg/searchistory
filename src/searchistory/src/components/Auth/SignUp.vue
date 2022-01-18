<template>
  <AuthForm>
    <!--  タイトル -->
    <template v-slot:formType>
      <button>Log In</button>
      <button class="text-gray-500" @click="goSignUp">Sing Up</button>
    </template>
    <!-- メール -->
    <template v-slot:mail
      ><input class="inputBody" type="email" placeholder="email" v-model="mail"
    /></template>
    <!-- パスワード -->
    <template v-slot:pass
      ><input
        class="inputBody"
        type="password"
        placeholder="password"
        v-model="pass"
    /></template>
    <!-- ボタン -->
    <template v-slot:authBtn>
      <button class="btnBody" @click="signin">ログイン</button>
    </template>
    <!-- ボタン -->
    <template v-slot:testBtn>
      <button class="btnBody" @click="testSignin">テストログイン</button>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, SetupContext } from "vue";
import AuthForm from './AuthForm.vue';
const goSignUp = () => {
}
const signin = () => {
}
const testSignin = () => {
}

const pass = ref("")
const mail = ref("")


// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// // import setUserInfo from '~/composable/setUserInfo';

//     const router = useRouter();
//     const mail = ref("");
//     const pass = ref("");

//     const signin = () => {
//       const auth = getAuth();
//       signInWithEmailAndPassword(auth, mail.value, pass.value)
//         .then(async (userCredential) => {
//           const user = userCredential.user;
//           await setUserInfo(ctx, user.uid);
//           router.push("/home");
//         })
//         .catch((error) => {
//           alert(error.message);
//         });
//     };

//     const testSignin = () => {
//       const auth = getAuth();
//       signInWithEmailAndPassword(auth, "t@g.com", "11111111")
//         .then(async (userCredential) => {
//           const user = userCredential.user;
//           await setUserInfo(ctx, user.uid);
//           router.push("/home");
//           router.push("/home");
//         })
//         .catch((error) => {
//           alert(error.message);
//         });
//     };
//     const goSignUp = () => {
//       console.log("sinup");
//       router.push("/sign_up");
//     };
</script>
