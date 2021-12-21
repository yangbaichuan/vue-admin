import listScalar from './scalar';
import deriveParser from './deriveParser';

// columns的render渲染
const columnRender = (h, scalar, data) => {
  if (!scalar || typeof data === 'undefined' || data === '') {
    return h('span', '-');
  } else if (typeof scalar === 'function') {
    return scalar(h, data);
  } else if (typeof scalar === 'string') {
    return h('span', scalar);
  } else {
    const { component, children, ...props } = scalar;
    return h(component || 'span', props, children);
  }
};

// 解析type
const generatorValueType = (ast, option) => {
  if (typeof ast === 'string') {
    const result = listScalar[ast];
    if (result) {
      if (typeof result === 'function') {
        return value => result(value, option);
      } else {
        return result;
      }
    } else {
      debugger;
    }
  } else {
    debugger;
  }
};

// 基础解析器（无type）
const basicParser = option => {
  if (option.key && option.key.includes('.')) {
    const keys = option.key.split('.');
    return {
      ...option,
      render: (h, { row }) => {
        let result = row[keys[0]];
        for (let i = 1; i < keys.length; i++) {
          if (result) {
            result = result[keys[i]];
          } else {
            result = undefined;
            break;
          }
        }
        return h('span', result || '-');
      }
    };
  }
  return option;
};

// scalar解析器（有type）
const scalarParser = option => {
  const { type, ...props } = option;
  const scalar = generatorValueType(deriveParser(type), option);
  if (scalar === true) {
    return props;
  } else if (typeof scalar === 'object') {
    if (scalar.children) {
      const { children, ...columnProps } = scalar;
      return {
        ...columnProps,
        ...props,
        render: (h, { row, column }) => columnRender(h, children(row[column.key], option), row[column.key])
      };
    } else {
      return {
        ...scalar,
        ...props
      };
    }
  } else {
    return {
      ...props,
      render: (h, { row, column }) => columnRender(h, scalar(row[column.key], option), row[column.key])
    };
  }
};

/**
 * 解析器
 * @param {Array} option 列表配置
 * @returns  处理后的列表配置
 */
const parser = option => {
  if (!Array.isArray(option)) {
    throw new Error('option must is a array!');
  }
  return option.map(val => {
    if (!val.title) val.title = val.name;
    if (!val.type) return basicParser(val);
    return scalarParser(val);
  });
};

export default parser;
