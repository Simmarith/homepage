import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/printing',
    name: 'Printing',
    component: () => import(/* webpackChunkName: "printing" */ '../views/Printing.vue'),
  },
  {
    path: '/coding',
    name: 'Coding',
    component: () => import(/* webpackChunkName: "coding" */ '../views/Coding.vue'),
  },
  {
    path: '/Schmierwurst',
    name: 'Schmierwurst',
    component: () => import(/* webpackChunkName: "schmierwurst" */ '../views/Schmierwurst.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
