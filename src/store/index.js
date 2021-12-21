import Vue from 'vue';
import Vuex from 'vuex';
import { requireAll } from '../utils/util';
import generatorStore from './generatorStore';
import app from './modules/app';
import account from './modules/account';

Vue.use(Vuex);

/**
 * 动态创建store
 * @description 若您不需要此功能可删除
 */
const modules = {};
requireAll(require.context('@/config/modules', true, /\.js$/)).forEach(val => {
  modules[val.id] = generatorStore(val);
});

export default new Vuex.Store({
  state: {
    sceneConfigFormData: {}
  },
  getters: {
    sceneConfigFormData (state) {
      return state.sceneConfigFormData;
    }
  },
  mutations: {
    changeSceneConfigFormData (state, sceneConfigFormData) {
      state.sceneConfigFormData = sceneConfigFormData;
    }
  },
  actions: {
    changeSceneConfigFormData ({ commit }) {
      commit('changeSceneConfigFormData');
    }
  },
  modules: {
    app,
    account,
    ...modules
  }
});
