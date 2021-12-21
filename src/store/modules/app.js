import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  setStorage,
  getStorage,
  getRoutesByAccess
} from '@/utils/util';
import router from '@/router';
import { isEmpty } from 'lodash-es';
// import routers from '@/router/routes';
import setting from '@/config/system.config.js';
import routes from '@/config/router.config.js';
const { homeName } = setting;

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

export default {
  state: {
    apiEnv: '',
    menus: [],
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: getStorage('local'),
    errorList: [],
    hasReadErrorPage: false,
    prevRouter: getStorage('prevRouter', 'session'),
    closePrevRouter: false,
    setting: getStorage('Setting') || setting
  },
  getters: {
    // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.account.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setApiEnv (state, data) {
      state.apiEnv = data;
    },
    setMenus (state, datas) {
      state.menus = getMenuByRouter(datas);
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList (state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavListFromLocalstorage() || [];
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
      const homeTagIndex = tagList.findIndex(item => item.name === homeName);
      if (homeTagIndex > 0) {
        const homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag (state, route) {
      const tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    },
    addTag (state, { route, type = 'unshift' }) {
      const router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        const index = state.tagNavList.findIndex(val => val.name === route.name);
        if (!isEmpty(route.query)) {
          if (index === -1) state.tagNavList.push(router);
          else state.tagNavList.splice(index, 1, router);
        } else {
          if (router.name === homeName) state.tagNavList.unshift(router);
          else if (index !== -1) state.tagNavList.splice(index, 1, router);
          else state.tagNavList.push(router);
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setLocal (state, lang) {
      setStorage('local', lang);
      state.local = lang;
    },
    addError (state, error) {
      state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status;
    },
    setPrevRouter (state, data) {
      setStorage('prevRouter', data, 'session');
      state.prevRouter = data;
    },
    setClosePrevRouter (state, data) {
      state.closePrevRouter = data;
    },
    setSetting (state, data) {
      setStorage('Setting', data);
      state.setting = data;
    }
  },
  actions: {
    generateRoutes ({ commit }, data) {
      return new Promise((resolve) => {
        const accessRoutes = getRoutesByAccess(routes, setting.accessType === 'sso' ? data.resource : data.role);
        commit('setMenus', accessRoutes);
        resolve(accessRoutes);
      });
    },
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false);
      const { user: { token, userId, userName } } = rootState;
      const data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      };
      saveErrorLogger(info).then(() => {
        commit('addError', data);
      });
    }
  }
};
