<template>
  <Header v-if="isOnHeaderPage()"></Header>
  <router-view></router-view>
</template>

<script setup lang="ts">
import Header from "./components/Layout/Header.vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const onHeaderPage = ["/home", "/history"]

const isOnHeaderPage = () => {
  return onHeaderPage.includes(route.path)
}
</script>

<style>
@import "./css/reset.scss";
#app {
  height: 100vh;
  width: 100%;
  background-color: lightgray;
  min-width: 1000px;
}
</style>
