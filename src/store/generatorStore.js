import axios from '@/utils/axios';

const createGetters = config => {
  const getters = {};
  Object.keys(config).map(k => {
    if (k === 'list') {
      getters[k] = () => {
        const fields = config.fields || [];
        const listConfig = Array.isArray(config.list) ? { fields: config.list } : config.list;
        return {
          ...listConfig,
          fields: listConfig.fields.map(v => {
            if (typeof v === 'string') {
              v = { key: v };
            }
            return { ...fields.find(n => n.key === v.key), ...v };
          })
        };
      };
    } else {
      getters[k] = () => config[k];
    }
  });
  return getters;
};

const createActions = (config, baseUrl, level) => {
  if (!config) return {};
  const actions = {};
  Object.keys(config).forEach(k => {
    if (typeof config[k] === 'string') config[k] = { url: config[k] };
    const { url, method, before, after } = config[k];
    actions[k] = ({ commit, state }, data) => {
      if (before) data = before(data);
      return new Promise((resolve, reject) => {
        axios[method || 'post'](baseUrl + url, data).then(res => {
          if (after) res = after(res);
          if (level === 1 || !data || data.page === 0) {
            commit('setDatas', res.datas);
          }
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    };
  });
  return actions;
};

export default option => ({
  namespaced: true,
  state: {
    datas: [],
    queue: []
  },
  mutations: {
    setDatas (state, data) {
      state.datas = data;
    },
    setQueue (state, data) {
      state.queue = data;
    }
  },
  getters: createGetters(option),
  actions: createActions(option.request, option.baseUrl, option.level)
});
