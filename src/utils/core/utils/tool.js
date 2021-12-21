/**
 * 处理字段
 * @param {*} fields
 * @param {*} states
 */
const handleFields = (fields, states) => {
  if (!_.isArray(fields)) throw new Error('fields配置应该是数组格式，请修改后重试！');
  return _.map(fields, val => {
    if (!val.id || !val.type || !val.name) throw new Error('field配置中的id、type或name配置项为必须项，请修改后重试！');
    if (_.includes(val.type, 'state.')) {
      val.symbols = states[val.type.split('.')[1]];
    }
    return val;
  });
};

/**
 * 处理请求配置
 * @param {*} module
 */
const handleRequest = mod => {
  let actions = {
    query: { url: `${mod.id}/query` }
  };
  _.forEach(['actions', 'extra'], key => {
    _.forEach(_.filter(mod[key], val => val.id), ({ id }) => {
      actions[id] = { url: `${mod.id}/${id}` };
    });
  });
  const state = mod.fields.find(val => val.type.includes('state.'));
  if (state) {
    actions.state = { url: `${mod.id}/state` };
    _.forEach(_.filter(_.flatten(_.map(_.keys(state), key => state[key].actions || [])), val => val.id), ({ id }) => {
      actions[id] = { url: `${mod.id}/${id}` };
    });
  }
  if (mod.request) {
    _.forEach(_.keys(mod.request), key => {
      const val = _.isString(mod.request[key]) ? { url: mod.request[key] } : mod.request[key];
      actions[key] = _.assign(actions[key] || {}, val);
    });
  }
  return actions;
};

/**
 * 处理模块
 * @param {*} modules
 * @param {*} states
 */
export const handleModules = (modules, states) => {
  if (_.isObject(modules)) {
    return _.map(_.keys(modules), key => {
      let mod = modules[key];
      if (!mod.id) mod.id = key;
      if (!mod.fields) throw new Error('模块未配置fields，请配置fields后重试！');
      mod.fields = handleFields(mod.fields, states);
      mod.request = handleRequest(mod);
      return mod;
    });
  } else {
    return modules;
  }
};
