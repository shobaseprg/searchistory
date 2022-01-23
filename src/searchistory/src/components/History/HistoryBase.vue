<template>
プレビュー
</template>

<script setup lang="ts">
import { ref } from "vue";
import { firebaseApp } from "../../firebase/config";
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const db = getFirestore(firebaseApp);
const auth = getAuth();

</script>

<style lang="scss" scoped>
</style>
