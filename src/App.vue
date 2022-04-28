<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Nav from './components/Nav.vue';

const store = useStore();
const user = computed(() => store.state.user);

onMounted(async () => {
  if (user.value.id === '' && localStorage.token) {
    store.dispatch('user/setToken', JSON.parse(localStorage.token));
  }
});
</script>

<template>
  <Toast position="top-left" />
  <Nav />
  <router-view></router-view>
</template>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  overflow-x: hidden;
  overflow-y: auto;
}
body {
  margin: 0px;
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
  background-color: #23272a;
}
.p-menubar {
  /* 11 under toast message z-index, 1 under modal overlay */
  z-index: 1099;
}

/* overwrites */
.p-grid {
  background-color: #23272a !important;
}
.p-dataview-content {
  background-color: #23272a !important;
}
.slider-connect:first-child {
  background: rgb(255, 89, 89) !important;
}
.slider-origin:nth-child(3) .slider-tooltip {
  background: rgb(255, 89, 89) !important;
  border: 1px solid rgb(255, 89, 89) !important;
}
.pi-search-plus {
  color: #40b9ff !important;
}
#togglePlay .pi-play {
  color: #ec7171 !important;
}
/* .slider-origin:nth-child(3) .slider-handle {
  display: none;
  height: 10px;
  width: 10px;
  right: calc(10px / 2 * -1);
  top: calc(10px / 2 * -1 - var(--slider-height, 6px) / 2 * -1 + -1px);
} */
.slider-origin:nth-child(3) .slider-handle:focus {
  box-shadow: 0 0 0 var(--slider-handle-ring-width, 3px)
      var(--slider-handle-ring-color, #cacaca30),
    var(--slider-handle-shadow, 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32));
}
@media (min-width: 1700px) {
  .p-menubar-start {
    margin-left: 15vw;
  }
  .p-menubar-end {
    margin-right: 15vw;
  }
}
.p-tooltip {
  z-index: 10;
}
.pi-question-circle {
  font-size: 1.9rem !important;
  color: rgb(224, 202, 127);
}
</style>
