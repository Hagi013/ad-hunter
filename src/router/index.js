import Vue from 'vue';
import Router from 'vue-router';
import HomeList from '@/components/HomeList';
import SetHunter from '@/components/SetHunter';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomeList',
      component: HomeList,
    },
    {
      path: '/set-hunter',
      name: 'SetHunter',
      component: SetHunter,
    },
  ],
});
