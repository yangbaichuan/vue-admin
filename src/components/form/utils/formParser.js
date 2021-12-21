import formScalar from './scalar';

const FORM_ITEM_KEYS = ['prop', 'label', 'label-width', 'labelWidth', 'showMessage', 'show-message', 'rules'];
const FORM_ITEM_CONFIG_KEYS = ['key', 'type', 'name', 'required', 'nameKey', 'valueKey', 'col', 'disabled', 'style', 'component', 'valueType'];

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
    return scalar || type;
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
 * 序列化配置
 * @param {*} field
 * @returns []
 */
const serializeField = field => {
  let scalar = {};
  if (field.type) {
    scalar = calcScalar(field.type);
  }
  if (!field.prop) field.prop = field.key;
  if (!field.label) field.label = field.name;
  if (!field.component) field.component = scalar.component || 'Select';
  if (!field.rules) field.rules = [...(scalar.rules || [])];
  if (!field.placeholder) field.placeholder = createPlaceholder(field);
  if (field.required) {
    const rule = {
      required: true,
      message: field.label + '为必填项', // createPlaceholder(field),
      trigger: 'change'
    };
    if (field.multiple) {
      rule.type = 'array';
      rule.min = field.min || 1;
    } else if (field.valueType) {
      rule.type = field.valueType;
    }
    field.rules.unshift(rule);
  }
  return field;
};

/**
 * 字段解析
 * @param {Object} field
 */
const formFieldParser = field => {
  field = serializeField(field);
  const config = {
    formItemProps: {},
    props: {}
  };
  Object.keys(field).forEach(key => {
    if (FORM_ITEM_KEYS.includes(key)) {
      config.formItemProps[key] = field[key];
    } else if (FORM_ITEM_CONFIG_KEYS.includes(key)) {
      config[key] = field[key];
    } else {
      config.props[key] = field[key];
    }
  });
  return config;
  // const { prop, label, labelWidth, rules, required, props, style, ...option } = serializeField(field);
  // return {
  //   ...option,
  //   props: {
  //     placeholder: createPlaceholder(field),
  //     ...props
  //   },
  //   style: style || {},
  //   formItemProps: { prop, label, labelWidth, rules }
  // };
};

/**
 * 表单配置解析
 * @param {Array} fields
 * @returns
 */
const formParser = fields => {
  if (!Array.isArray(fields)) {
    throw new Error('fields must is a array!');
  }
  return fields.map(v => formFieldParser(v));
};

const asyncComponent = component => {
  // 非全局组件异步导入
  return () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    component: import(`@/components/${component}`),
    // 异步组件加载时使用的组件
    loading: {
      functional: true,
      render: (h) => h('p', '组件加载中...')
    },
    // 加载失败时使用的组件
    error: {
      functional: true,
      render: (h) => h('p', '组件加载失败!')
    },
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000
  });
};

export { formParser, formFieldParser, asyncComponent };
