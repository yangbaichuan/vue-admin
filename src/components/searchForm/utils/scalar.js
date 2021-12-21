export default {
  /**
   * 基础类
   */
  string: 'Input',
  number: 'InputNumber',
  boolean: 'i-switch',
  /**
   * 文本类
   **/
  // 标题
  title: { component: 'Input', rules: [{ type: 'string', max: 15, message: '最多仅允许输入15字符', trigger: 'blur' }] },
  // 描述
  desc: 'Input',
  // 名称
  name: 'Input',
  // 文本
  text: { component: 'Input', rules: [{ type: 'string', max: 100, message: '最多输入100个字符', trigger: 'change' }] },
  // 中文姓名
  cname: 'Input',
  // 标识
  unique: 'Input',
  /**
   * 数值类
   */
  // 自然数
  natural: { component: 'InputNumber', min: 0, rules: [{ type: 'number', pattern: /[1-9\d*]|0/, message: '请输入大于等于0的数字', trigger: 'blur' }] },
  // 整数
  integer: { component: 'InputNumber', rules: [{ type: 'number', pattern: /^(0|[1-9]\d*|-[1-9]\d*)$/, message: '请输入整数', trigger: 'blur' }] },
  // 正整数
  positiveInteger: { component: 'InputNumber', min: 1, rules: [{ type: 'number', min: 1, pattern: /^[1-9]\d*$/, message: '请输入大于0的数字', trigger: 'blur' }] },
  // 百分比
  percent: { component: 'Input', type: 'number', suffix: '%', rules: [{ type: 'number', min: 0, max: 100, message: '请输入0-100之间的数字', trigger: 'change' }] },
  // 年龄
  age: { component: 'Input', type: 'number' },
  /**
   * 日期类型
   */
  year: { component: 'DatePicker', type: 'year' },
  month: { component: 'DatePicker', type: 'month', format: 'yyyy-MM' },
  date: { component: 'DatePicker', type: 'date', format: 'yyyy-MM-dd' },
  tDay: { component: 'Input', type: 'number', style: { width: '140px' }, slots: { prepend: 'T+', append: '天' } },
  datetime: { component: 'DatePicker', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
  dateRange: { component: 'DatePicker', type: 'daterange', format: 'yyyy-MM-dd' },
  dateTimeRange: { component: 'DatePicker', type: 'datetimerange', format: 'yyyy-MM-dd HH:mm:ss', value: [], rules: [{ validator: (rule, value, callback) => { if (compareDate(value[1])) { callback(); } else { return callback(new Error('结束时间不能小于当前时间')); } }, trigger: 'change' }] },
  time: { component: 'TimePicker', type: 'time' },
  timeRange: { component: 'TimePicker', type: 'timerange' },
  /**
   * 媒体类
   */
  color: { component: 'ColorPicker' },
  image: { component: 'tc-upload', props: { type: 'image', accept: 'image/*' } },
  /**
   * web类
   */
  url: { component: 'Input', rules: [{ type: 'string', pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[\w\d.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/, message: '必须以http://或https://开始', trigger: 'change' }] },
  domain: { component: 'Input', rules: [{ type: 'string', pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, message: '格式无效', trigger: 'blur' }] },
  email: { component: 'Input', rules: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }] },
  /**
   * 其它
   */
  // state: states => ({ component: 'tc-enum', symbols: _.values(states), type: 1 }),
  // enum: symbols => ({ component: 'tc-enum', symbols: symbols, type: 1 }),
  state: props => ({ component: props && props.multiple ? 'CheckboxGroup' : 'RadioGroup', type: 'button' }),
  enum: 'Select',
  // 数据时间（常用于列表的创建和修改时间）
  createdTime: { component: 'DatePicker', type: 'datetimerange', format: 'yyyy-MM-dd HH:mm:ss' }
};
