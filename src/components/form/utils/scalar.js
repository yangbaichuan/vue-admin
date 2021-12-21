/**
 * 基础类型
 */

const basic = {
  string: 'Input',
  number: { component: 'InputNumber', value: 0 },
  boolean: 'i-switch'
};

/**
 * 文本类型
 */
const text = {
  // 文本
  text: { component: 'Input', type: 'textarea', rows: 3 },
  // 标题
  title: { component: 'Input', maxlength: 50, showWordLimit: true },
  // 标识
  unique: { component: 'Input', rules: [{ type: 'string', pattern: /^[a-zA-Z_0-9/-]+$/, message: '仅允许输入A-Z、a-z、0-9、_和-', trigger: 'change' }] }
};

/**
 * 数值类型
 */
const number = {

};

/**
 * 日期类
 */
const date = {
};

/**
 * 媒体类型
 */

const media = {
};

/**
 * web
 */
const web = {
};

/**
 * 其它类型
 */
const other = {
  state: props => ({ component: props && props.multiple ? 'CheckboxGroup' : 'RadioGroup' }),
  enum: props => ({ component: props && props.multiple ? 'CheckboxGroup' : 'RadioGroup' }),
  orionRule: { component: 'orionRule' }
};

export default Object.assign({}, basic, text, number, date, media, web, other);
