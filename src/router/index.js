import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Create from '../views/Create.vue';
import AuthHandler from '../components/AuthHandler.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/auth/redirect',
    name: 'AuthHandler',
    component: AuthHandler
  }
];

const router = new createRouter({
  history: createWebHistory(),
  routes
});

export default router;
