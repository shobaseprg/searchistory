<template>
  <div class="flex items-center justify-center h-screen">
    <!-- フォームボックス -->
    <div
      class="w-[500px] flex flex-col items-center justify-center p-5 bg-black"
    >
      <!-- タイトル -->
      <div class="w-[250px] flex justify-between mb-10 text-3xl">
        <slot name="formType"></slot>
      </div>
      <!-- メール -->
      <div class="authInput"><slot name="mail"></slot></div>
      <!-- パスワード -->
      <div class="authInput"><slot name="pass"></slot></div>
      <!-- ボタン -->
      <div
        class="w-[200px] h-[50px] flex items-center justify-center mb-5 text-center hover:text-black text-white bg-black hover:bg-pink-300 border-2 border-pink-300 rounded-full"
      >
        <slot name="authBtn"></slot>
      </div>
      <slot name="testBtn"></slot>
    </div>
  </div>
</template>

<style scoped></style>
