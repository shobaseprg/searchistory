<template>
  <div class="h-[100%] flex items-center justify-center">
    <AuthForm :isSignUp="false"></AuthForm>
  </div>
</template>

<script setup lang="ts">
import AuthForm from "./AuthForm.vue";
</script>
