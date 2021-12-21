import { deriveParser } from './derive';
import store from '../../store';
import Scalar from '../scalar';
import formScalar from '../scalar/form';
import { findTreeNode } from './util';

/**
 * 根据field显示内容
 * @param {Object}        scalar  要解析的scalar
 * @param {Object|String} ast     解析后的type
 * @param {Object}        config  字段全部配置
 * @returns {true|Object|Function}
 */
export const showValueFunc = (scalar, ast, config) => {
  if (typeof ast === 'string') {
    if (scalar[ast]) {
      if (typeof scalar[ast] === 'function') {
        return value => scalar[ast](value, config.symbols);
      } else {
        return scalar[ast];
      }
    } else if (ast === 'module') {
      if (config.render) {
        return (h, value) => config.render(h, value);
      } else {
        let nameKey = config.nameKey || 'name';
        return value => value[nameKey];
      }
    }
    const subMod = store.getters[`${ast}/config`];
    if (subMod) {
      if (subMod.level > 1) {
        if (subMod.render) {
          return () => subMod.render;
        } else {
          return value => {
            return value ? value[subMod.nameKey || 'name'] : '-';
          };
        }
        // const render = data => data ? subMod.render ? subMod.render(data) : data[subMod.nameKey || 'name'] : '-';
        // return value => render(value);
      } else if (subMod.level === 1) {
        // 没数据时进行查询
        if (!store.state[ast].datas.length) {
          store.dispatch(`${subMod.id}/query`, config.query || null, { root: true });
        }
        return (value) => {
          const datas = store.state[ast].datas || config.symbols;
          const func = val => val[config.valueKey || subMod.valueKey] === value;
          const data = subMod.type === 'tree' ? findTreeNode(datas, func) : _.find(datas, func);
          if (!data) return '-';
          if (subMod.render) {
            return (h) => subMod.render(h, { data });
          } else {
            return data[subMod.nameKey || 'name'];
          }
        };
      } else {
        return subMod.view ? data => subMod.view(data) : null;
      }
    } else {
      throw new Error(`Error: 解析失败！未在sclar和module中找到type为${ast}的配置项！`);
    }
  } else if (ast.action === 'state') {
    return (value, data) => {
      if (_.isUndefined(value) || _.isNull(value)) return '-';
      else {
        const state = config.symbols.find(val => val.id === value);
        if (!state) return '-';
        else if (state.render) {
          return state.render(data);
        } else {
          return { component: 'Tag', props: { type: 'border', color: state.color }, children: state.name };
        }
      }
    };
  } else if (ast.action === '[]') {
    // 数组转换
    const multiAst = ast.params[0];
    const multiFunc = showValueFunc(scalar, multiAst, config);
    if (typeof multiFunc === 'function') {
      return value => _.map(value, multiFunc).filter(val => typeof val !== 'undefined').join('、');
    } else {
      return value => value;
    }
  } else if (ast.action === '|') {
    return value => {
      if (!value) {
        return config.symbols ? config.symbols[0] : '关闭';
      } else {
        const eAst = ast.params[1];
        return showValueFunc(scalar, eAst)(value);
      }
    };
  } else if (ast.action === '$$') {
    const eAst = ast.params[0];
    return showValueFunc(scalar, eAst, config);
  }
};

/**
 * columns的render渲染
 * @param {*} h
 * @param {*} m
 */
export const columnRender = (h, m, params) => {
  if (!m) return null;
  if (_.isArray(m)) {
    return _.map(m, n => columnRender(h, n));
  } else if (_.isFunction(m)) {
    return m(h, params);
  } else if (m.component) {
    const { component, children, ...props } = m;
    return h(component, props, children);
  } else {
    const { column } = params;
    const style = {
      whiteSpace: (column.ellipsis || column.tooltip) ? 'nowrap' : 'normal',
      display: 'block',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden'
    };
    if (column && column.tooltip) {
      return h('Tooltip', {
        style: {
          width: '100%'
        },
        props: {
          content: m,
          theme: 'light',
          maxWidth: 200,
          transfer: true
        }
      }, [h('span', {
        style,
        domProps: {
          innerHTML: m
        }
      })]);
    }
    return h('span', {
      style,
      domProps: {
        innerHTML: m
      }
    });
  }
};

/**
 * 解析scalar
 * @param {*} v
 * @param {*} cfg
 */
export const calcScalar = (v, props, type) => {
  v = type ? Scalar[type][v] : v;
  if (typeof v === 'string') {
    return { component: v };
  } else if (typeof v === 'function') {
    return v(props);
  } else {
    return v;
  }
};

/**
 * 解析栅格布局
 */
export const getGridProps = (col) => {
  if (!col) return { span: 24 };
  else {
    if (_.isNumber(col)) return { span: col };
    else if (_.isObject(col) && !_.isArray(col)) return col;
    else return { span: 24 };
  }
};

/**
 * 构造字段配置。
 * @description 将细节配置和fields配置进行合并，并转换type
 * @param {*} moduleId
 * @param {*} type
 */
export const constractFields = (moduleId, type) => {
  const fields = store.getters[`${moduleId}/fields`];
  let typeFields = store.getters[`${moduleId}/${type}`];
  if (!typeFields) return fields;
  if (!_.isArray(typeFields)) typeFields = typeFields.fields;
  const groupField = datas => {
    return _.map(datas, val => {
      if (_.isString(val)) val = { id: val };
      if (val.id) { // 字段配置
        val = _.assign({}, _.find(fields, v => v.id === val.id), val);
        val.type = deriveParser(val.type);
      } else if (val.fields) {
        val.fields = groupField(val.fields); // 细节配置
      }
      return val;
    });
  };
  return { fields: groupField(typeFields) };
};

/**
 * 获取默认数据
 * @description 表单嵌套结构会先进行校验，导致控制台报错，需预先设置默认数据
 * @param {*} ast
 */
export const generateDefaultValue = (ast, first) => {
  // 传递
  if (typeof ast === 'string') {
    const level = store.getters[`${ast}/level`];
    if (!_.isUndefined(level) || ast === 'module') { // moudule
      if (ast === 'module' || level === 0) return {};
      else if (!first) return undefined;
      const config = constractFields(ast, 'form');
      const getValue = fields => {
        return _.reduce(fields, (result, field) => {
          if (field.id) {
            if (!_.isUndefined(field.value)) {
              const value = _.isFunction(field.value) ? field.value() : field.value;
              result[field.id] = !field.relations ? value : undefined;
            } else {
              result[field.id] = generateDefaultValue(field.type);
            }
          } else if (field.fields) {
            result = _.assign({}, result, getValue(field.fields));
          }
          return result;
        }, {});
      };
      return getValue(config.fields);
    } else { // scalar
      if (_.isObject(formScalar[ast]) && typeof formScalar[ast].value !== 'undefined') return formScalar[ast].value;
      else return undefined;
    }
  } else if (ast.action === '[]') {
    return [];
  } else if (ast.action === '|') {
    // 假设为null|xxx
    return undefined;
  }
};

/**
 * 解析type，获取module
 * @param {String} type
 */
export const getModuleIdFromType = type => {
  const ast = deriveParser(type);
  if (_.isString(ast)) return ast;
  else return getModuleIdFromType(ast.params[0]);
};

/**
 * 动态加载组件
 * @param {*} component
 */
export const importComponent = (component) => {
  if (/^([A-Z]|i-|form-|detail-)/.test(component)) { // iview组件或类型组件子组件直接返回
    return component;
  } else if ((/tc-/).test(component)) { // 通用组件库组件
    const path = component.replace('tc-', '');
    return resolve => require([`_c/tc-components/${path}`], resolve);
  } else { // 本地组件
    // return component;
    return resolve => require([`_c/${component || 'empty'}`], resolve);
  }
};
