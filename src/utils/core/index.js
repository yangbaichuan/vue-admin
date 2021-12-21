// 安装方法
const install = function (Vue, options = {}) {
  // 注册中央总线
  Vue.prototype.$event = new Vue();
  // 解构配置
  let { store, modules, states, ...config } = options;
  // 注册配置项
  window.VUE_ADMIN = Vue.prototype.$VUE_ADMIN = config;
};

export default {
  install
};
