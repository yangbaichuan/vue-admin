import Vue from 'vue';
import Router from 'vue-router';
import { LoadingBar } from 'view-design';
import routes from './routes';
import store from '../store';
import { getToken, setToken, setTitle, getParams } from '@/utils/util';
import setting from '../config/system.config.js';

/**
 * 隐藏报错
 */
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

const { homePath, loginPath } = setting;

/**
 * 地址栏获取token本地存储
 */
const searchParam = getParams(location.search);
if (searchParam.token) {
  setToken(unescape(searchParam.token));
  const { origin, pathname, hash } = location;
  window.location.replace(`${origin}${pathname}${hash}`);
}

Vue.use(Router);

/**
 * window.__POWERED_BY_QIANKUN__为微服务配置
 * 若介意可删除
 */
const router = new Router({
  base: window.__POWERED_BY_QIANKUN__ ? '/advertService/' : '/',
  mode: window.__POWERED_BY_QIANKUN__ ? 'history' : 'hash',
  routes
});

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.name === from.name) next(false);
  LoadingBar.start();
  const token = getToken();
  if (!token) {
    if (to.path !== loginPath) {
      next({ path: loginPath });
    } else {
      next();
    }
  } else if (store.state.account.hasGetInfo) {
    // 非刷新情况，判断跳转地址是否为登录，若为登录跳转首页，否则鉴权跳转
    if (to.path === loginPath) {
      next({ path: homePath });
    } else {
      next();
    }
  } else {
    // 获取用户信息
    store.dispatch('getUserInfo').then(res => {
      // 处理权限路由
      store.dispatch('generateRoutes', res).then(datas => {
        datas.forEach(route => {
          router.addRoute(route);
        });
        next({ path: (!to.redirectedFrom || to.redirectedFrom === loginPath) ? to.path : to.redirectedFrom });
      });
    }).catch(() => {
      setToken('');
      next({ path: loginPath });
    });
  }
});

router.afterEach(to => {
  setTitle(to.meta);
  LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
