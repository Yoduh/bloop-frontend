import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Create from '../views/Create.vue';
import AuthHandler from '../components/AuthHandler.vue';
import store from '../store/index';

const redirectHome = (to, from, next) => {
  if (to.query.error) {
    next('/');
  }
  next();
};
const authenticate = (to, from, next) => {
  if (!store.state.user.id) {
    next('/');
  }
  next();
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'Create',
    component: Create,
    beforeEnter: [authenticate]
  },
  {
    path: '/auth/redirect',
    name: 'AuthHandler',
    component: AuthHandler,
    beforeEnter: [redirectHome]
  }
];

const router = new createRouter({
  history: createWebHistory(),
  routes
});

export default router;
