import formScalar from './scalar';

/**
 * 解析scalar
 * @param {*} v
 * @param {*} cfg
 */
const calcScalar = type => {
  if (typeof type !== 'string') return type;
  const scalar = formScalar[type];
  if (typeof scalar === 'string') {
    return { component: scalar };
  } else {
    return scalar;
  }
};

/**
 * 是否为选择类组件
 * @param {*} component
 * @returns
 */
const isSelect = component => {
  return ['Select', 'DatePicker'].includes(component);
};

/**
 * 根据组件获取前端
 * @param {*} component
 * @returns
 */
const createPlaceholder = ({ component, label }) => {
  return (isSelect(component) ? '请选择' : '请输入') + label;
};

/**
 * 创建校验规则
 * @param {*} field
 * @returns []
 */
const serializeField = field => {
  if (!field.prop) field.prop = field.key;
  if (!field.label) field.label = field.name;
  return field;
};

/**
 * 字段解析
 * @param {Object} field
 */
const searchFieldParser = field => {
  const { prop, type, label, labelWidth, rules, required, props, style, component, ...option } = serializeField(field);
  let scalar;
  if (type) {
    scalar = calcScalar(type) || { component: 'Select' };
  }
  return {
    type,
    component: component || scalar.component,
    ...option,
    props: {
      placeholder: createPlaceholder(field),
      ...props
    },
    style: style || {},
    formItemProps: { prop, label, labelWidth, rules }
  };
};

export default searchFieldParser;
