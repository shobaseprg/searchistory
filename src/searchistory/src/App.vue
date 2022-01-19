<template>
  <div id="app">
    <Header v-if="isAuthPage()"></Header>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const authPage = ["/signin", "/signup"]
const isAuthPage = () => {
  return !authPage.includes(route.path)
}

</script>

<style>
@import "./css/reset.scss";
#app {
  border: solid 3px red;
}
</style>
