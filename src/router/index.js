import Vue from 'vue';
import Router from 'vue-router';
import Account from './account';
Vue.use(Router);

import Layout from '@/layout';

let filesArr = [];
let routerFiles = [];
let sortArr = ['user', 'subject', 'study', 'apply'];

const files = require.context('./modules', false, /.js$/);
files.keys().forEach((key) => {
  const fileName = key.slice(2, -3); // 文件名
  const i = sortArr.findIndex((f) => f === fileName);
  const fileValue = files(key).default;
  filesArr = filesArr.concat({ list: fileValue, sort: i });
});

filesArr.sort((a, b) => a.sort - b.sort); // 排序
filesArr.forEach((r) => {
  r.list.forEach((e) => {
    e.component = Layout;
    routerFiles.push(e);
  });
});

routerFiles.push({ path: '*', redirect: '/404', hidden: true });

export const constantRoutes = [...Account];
export const asyncRoutes = [...routerFiles];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
