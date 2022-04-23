<script setup>
import { useStore } from 'vuex';
const store = useStore();
if (store.state.user.id === '' && localStorage.token) {
  store.dispatch('user/setToken', JSON.parse(localStorage.token));
}
</script>

<template>
  <Toast position="top-left" />
  <img alt="Vue logo" src="./assets/logo.jpeg" style="border-radius: 50%" />
  <router-view></router-view>
</template>

<style>
body {
  margin: 0px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #23272a;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f6f6f6;
  margin-top: 60px;
  background-color: #23272a;
}

.p-grid {
  background-color: #23272a !important;
}
.p-dataview-content {
  background-color: #23272a !important;
}
</style>
