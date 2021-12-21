import axios from '@/utils/axios';
import { accountApi } from '@/config/api.config.js';
import { getToken, setToken } from '@/utils/util';
import setting from '@/config/system.config';

export default {
  state: {
    // 用户token
    token: getToken(),
    // 用户头像
    avatar: '',
    // 用户id
    userId: '',
    // 用户名
    userName: '',
    // 用户角色
    role: undefined,
    // 验证key
    verifyKey: null,
    // 验证码
    verifyCode: null,
    // 是否获取过用户信息
    hasGetInfo: false
  },
  mutations: {
    setToken(state, data) {
      setToken(res.token);
      state.token = data;
    },
    setAvatar (state, data) {
      state.avatar = data;
    },
    setUserId (state, data) {
      state.userId = data;
    },
    setUserName (state, data) {
      state.userName = data;
    },
    setRole (state, data) {
      state.role = data;
    },
    setVerifyKey (state, data) {
      state.verifyKey = data;
    },
    setVerifyCode (state, data) {
      state.verifyCode = data;
    },
    setHasGetInfo (state, data) {
      state.hasGetInfo = data;
    }
  },
  actions: {
    // 获取验证码
    getVerifyCode ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.request(accountApi.verifyCode).then(data => {
          commit('setVerifyKey', data.key);
          commit('setVerifyCode', data.value);
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    // 登录
    handleLogin ({ commit }, data) {
      data.identifier = setting.symbol;
      return new Promise((resolve, reject) => {
        axios.request(accountApi.login, data).then(res => {
          commit('setToken', res.token);
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    // 获取用户相关信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.request(accountApi.getUserInfo).then(data => {
          commit('setUserId', data.id);
          commit('setUserName', data.name);
          commit('setAvatar', data.avatar);
          commit('setRole', data.role);
          commit('setApiEnv', data.env);
          commit('setHasGetInfo', true);
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        QscSSo.logout().then(() => {
          commit('setHasGetInfo', false);
          resolve();
        }).catch(err => {
          commit('setHasGetInfo', false);
          reject(err);
        });
      });
    }
  }
};
