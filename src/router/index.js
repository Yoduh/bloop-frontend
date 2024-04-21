import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Create from '../views/Create.vue';
import Help from '../views/Help.vue';
import AuthHandler from '../components/AuthHandler.vue';

const redirectHome = to => {
  if (to.query.error) {
    return { name: 'Home' };
  }
  return true;
};
const authenticate = () => {
  if (!localStorage.id) {
    return { name: 'Home' };
  }
  return true;
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
    path: '/help',
    name: 'Help',
    component: Help,
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
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

export default router;
