<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/layout/Header.vue";
</script>

<style>
@import "./css/reset.scss";
#app {
  border: solid 3px red;
}
</style>
