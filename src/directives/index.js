const file = require.context('./modules', false, /.js$/);
export default {
  install(Vue) {
    file.keys().forEach((key) => {
      // 截取名字
      const fileName = key.slice(2, -3);
      Vue.directive(fileName, file(key).default);
    });
  },
};
