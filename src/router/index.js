import Vue from 'vue';
import Router from 'vue-router';
import HomeList from '@/components/HomeList';
import SetHunter from '@/components/SetHunter';
import UserAgent from '@/components/UserAgent';

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
    {
      path: '/user-agent',
      name: 'UserAgent',
      component: UserAgent,
    },
  ],
});
