import Vue from 'vue';
import ViewUI from 'view-design';
import App from './App';
import router from './router';
import store from './store/index.js';
import directive from './directive';
import './assets/iconfont/iconfont.css';
import './styles/index.less';

Vue.config.productionTip = false

Vue.config.productionTip = false;

Vue.use(ViewUI);

Vue.use(directive);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
