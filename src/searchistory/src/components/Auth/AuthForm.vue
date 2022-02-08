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
        <p>{{ email }}</p>
        <input
          class="w-[300px] h-[50px] mb-10 text-center border-2 border-pink-300 rounded-full duration-75;"
          type="text"
          v-model="email"
          data-testid="inputEmail"
        />
      </div>
      <!-- パスワード -->
      <div>
        <p>パスワード</p>
        <input
          class="w-[300px] h-[50px] mb-10 text-center border-2 border-pink-300 rounded-full duration-75;"
          type="text"
          v-model="password"
          data-testid="inputPassword"
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
import useUserStore from "../../store/useUserStore";
import logic from "./AuthFormLogic";

interface Props {
  isSignUp: boolean;
}

const props = defineProps<Props>();

const { name, email, password, getActionButton, getPageTitle, signin, } = logic(props, useUserStore);
</script>
