<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useLoadingStore } from '@/stores/loading';
import { storeToRefs } from 'pinia';
import Nav from '@/components/Nav.vue';

const user = useUserStore();
const { isLoading } = storeToRefs(useLoadingStore());

onMounted(async () => {
  if (user.id === '' && localStorage.token) {
    user.setToken(JSON.parse(localStorage.token));
  }
});
</script>

<template>
  <Toast position="top-left" />
  <Nav />
  <router-view></router-view>
  <BlockUI :blocked="isLoading" :fullScreen="true"></BlockUI>
  <ProgressSpinner v-show="isLoading" class="overlay" strokeWidth="5" />
</template>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  scroll-behavior: smooth;
  /* overflow-x: hidden;
  overflow-y: auto; */
}
body {
  margin: 0px;
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
.p-toast {
  z-index: 8999;
}
.p-dialog-mask {
  z-index: 7999;
}
.p-menubar {
  /* 1 under modal overlay */
  z-index: 1099;
}

/* overwrites */
.p-grid {
  background-color: #23272a !important;
}
.p-dataview-content {
  background-color: #23272a !important;
}
#rangeSlider .slider-connect:first-child {
  background: rgb(255, 89, 89) !important;
}
#volumeSlider .slider-connect:first-child {
  background: rgb(78, 125, 255) !important;
}
#volumeSlider {
  --slider-vertical-height: 170px;
}
#volumeSlider .slider-tooltip {
  background: rgb(32, 91, 255) !important;
  border: 1px solid rgb(32, 91, 255) !important;
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
  margin-left: 5px;
  font-size: 2rem !important;
  color: rgba(224, 201, 127, 0.479);
}
.pi-question-circle:hover {
  color: rgba(224, 201, 127);
}
.filterTooltip {
  min-width: 250px !important;
}
.filterTooltip .p-tooltip-text {
  padding: 15px !important;
}
.pi-bookmark,
.pi-bookmark-fill {
  font-size: 1rem !important;
  color: rgb(224, 202, 127) !important;
}
.p-highlight.bookmark {
  background: none !important;
  border: none !important;
}
.p-dataview-content .p-grid {
  justify-content: center !important;
}

input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  border-radius: 50em;
  background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg)
    no-repeat 50% 50%;
  background-size: contain;
  opacity: 0;
  pointer-events: none;
}

input[type='search']:focus::-webkit-search-cancel-button {
  opacity: 0.3;
  pointer-events: all;
  filter: invert(1);
}
.p-datatable-header {
  margin-top: 2px;
  background-color: #23272a !important;
}
.p-datatable-wrapper {
  overflow-x: hidden;
}
.overlay {
  position: fixed !important;
  top: 50%;
  left: 50%;
  width: 10rem !important;
  height: 10rem !important;
  transform: translate(-50%, -50%);
  z-index: 9000;
}
</style>
