import access from './module/access';

const api = {
  install (Vue, option) {
    Vue.directive('access', access);
  }
};

export default api;
