import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
const dataState = createPersistedState({
  key: 'zh_persisted_state',
  // 设置要存储的参数
  reducer({ user, dataDictionarty }) {
    return { user, dataDictionarty };
  },
});

const file = require.context('./modules', false, /.js$/);
let modules = {};
file.keys().forEach((key) => {
  const fileName = key.slice(2, -3); // 文件名
  modules[fileName] = file(key).default;
});
let store = new Vuex.Store({
  modules,
  getters,
  plugins: [dataState],
});
export default store;
