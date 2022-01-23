<template>
履歴新規作成
</template>

<script setup lang="ts">
//vue plugin
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
//firebase
import {db } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
//store
//component
//composable
//model
//define
const router = useRouter()
const auth = getAuth();
//define store
//logic

</script>

<style lang="scss" scoped>
</style>
