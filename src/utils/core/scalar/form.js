export default {
  /**
   * 基础类型
   */
  string: 'Input',
  text: { component: 'Input', type: 'textarea', rows: 3 },
  number: { component: 'InputNumber', value: 0 },
  boolean: 'i-switch',
  /**
   * 文本类型
   */
  // 标题
  title: { component: 'Input', maxlength: 45, showWordLimit: true, rules: [ { type: 'string', pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '请输入中文、英文、数字和下划线', trigger: 'change' } ] },
  // 描述
  desc: { component: 'Input', type: 'textarea', maxlength: 150, showWordLimit: true, autosize: { minRows: 2 } },
  // 英文名称
  ename: { component: 'Input', rules: [ { type: 'string', pattern: /^[a-zA-Z]+$/, message: '请输入英文字符', trigger: 'change' } ] },
  // 中文名称
  cname: { component: 'Input', maxlength: 45, showWordLimit: true, rules: [ { type: 'string', pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文字符', trigger: 'change' } ] },
  // 标识
  unique: { component: 'Input', rules: [ { type: 'string', pattern: /^[a-zA-Z_0-9/-]+$/, message: '仅允许输入A-Z、a-z、0-9、_和-', trigger: 'change' } ] },
  /**
   * 数值类型
   */
  // 自然数  大于等于0的数字
  natural: { component: 'InputNumber', value: 0, min: 0, precision: 0, rules: [ { type: 'number', pattern: /[1-9\d*]|0/, message: '请输入大于等于0的数字', trigger: 'blur' } ] },
  // 整数
  integer: { component: 'InputNumber', value: 1, rules: [ { type: 'number', pattern: /^(0|[1-9]\d*|-[1-9]\d*)$/, message: '请输入整数', trigger: 'blur' } ] },
  // 正整数
  positiveInteger: { component: 'InputNumber', min: 1, precision: 0, value: 1, rules: [ { type: 'number', min: 1, pattern: /^[1-9]\d*$/, message: '请输入大于0的数字', trigger: 'blur' } ] },
  // 百分比
  percent: { component: 'InputNumber', value: 1, formatter: value => `${value}%`, parser: value => value.replace('%', ''), max: 100, rules: [ { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数字', trigger: 'change' } ] },
  // 年龄
  age: { component: 'InputNumber', value: 1, min: 1, max: 120 },
  // 手机号
  phone: { component: 'Input', type: 'number', rules: [ { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' } ] },
  // 金额
  amount: { component: 'InputNumber', value: 1, rules: [{ pattern: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, message: '请输入正确的金额', trigger: 'change' }], formatter: value => `${value}元`, parser: value => value.replace('元', '') },
  /**
   * 日期类型
   */
  year: { component: 'DatePicker', type: 'year' },
  month: { component: 'DatePicker', type: 'month', format: 'yyyy-MM' },
  date: { component: 'DatePicker', type: 'date', format: 'yyyy-MM-dd' },
  tDay: { component: 'Input', type: 'number', slots: { prepend: 'T+', append: '天' } },
  datetime: { component: 'DatePicker', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' },
  dateRange: { component: 'DatePicker', type: 'daterange', format: 'yyyy-MM-dd' },
  dateTimeRange: { component: 'DatePicker', type: 'datetimerange', format: 'yyyy-MM-dd HH:mm:ss', value: [], rules: [ { validator: (rule, value, callback) => { if (compareDate(value[1])) { callback(); } else { return callback(new Error('结束时间不能小于当前时间')); } }, trigger: 'change' } ] },
  time: { component: 'TimePicker', type: 'time' },
  timeRange: { component: 'TimePicker', type: 'timerange' },
  /**
   * 媒体类型
   */
  color: 'ColorPicker',
  image: {
    component: 'tc-upload',
    type: 'image',
    accept: 'image/*',
    action: '',
    headers: {},
    srcSuffix: '?x-oss-process=style/thumb.png'
  },
  /**
   * web类型
   */
  url: { component: 'Input', rules: [ { type: 'string', pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[\w\d.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/, message: '必须以http://或https://开始', trigger: 'change' } ] },
  domain: { component: 'Input', rules: [ { type: 'string', pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, message: '格式无效', trigger: 'blur' } ] },
  email: { component: 'Input', rules: [ { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' } ] },
  /**
   * 其它类型
   */
  // state: states => ({ component: 'tc-enum', symbols: states }),
  // enum: symbols => ({ component: 'tc-enum', symbols: symbols }),
  state: props => ({ component: props && props.multiple ? 'CheckboxGroup' : 'RadioGroup' }),
  enum: props => ({ component: props && props.multiple ? 'CheckboxGroup' : 'RadioGroup' }),
  fullEditor: { component: 'ckeditor', type: 'classic' },
  // 代码编译
  codeEditor: 'code-editor',
  // 库存
  stock: 'stock',
  /**
   * 业务类型
   */
  // sql模型
  sql: 'tc-sql-builder',
  // 用户名单模型
  userList: 'tc-user-list',
  // 事件模型
  event: 'tc-event-edit',
  // 拼装系统
  magic: 'magic'
};
