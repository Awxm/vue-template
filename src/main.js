import Vue from 'vue';

import ElementUI from 'element-ui';

import urls from '@/https/urls';
import { post, get } from '@/https/request';

import { message } from '@u/resetMessage';
import Pagination from '@c/Pagination';
import SearchBox from '@c/SearchBox';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global css
import App from './App';
import store from './store';
import router from './router';

import directives from '@/directives';

import * as filters from './filters';

import '@/icons'; // icon
import '@/permission'; // permission control

Vue.use(directives); // 安装命令
Vue.use(ElementUI);

Vue.prototype.urls = urls;
Vue.prototype.$post = post;
Vue.prototype.$get = get;

Vue.prototype.$message = message;
Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.component(SearchBox.name, SearchBox);
Vue.component(Pagination.name, Pagination);

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
