export default {
  /**
   * 基础类型
   */
  // 字符串
  string: true,
  // 文本
  text: { tooltip: true },
  // 波尔值
  boolean: true,
  // 数字
  number: true,
  /**
   * 文本类型
   */
  // 标题
  title: true,
  // 描述
  desc: true,
  // 英文名称
  ename: true,
  // 中文名称
  cname: true,
  // 标识
  unique: true,
  /**
   * 数值类型
   */
  // 标识
  id: { minWidth: 80 },
  // 自然数
  natural: true,
  // 整数
  integer: true,
  // 正整数
  positiveInteger: true,
  // 百分比
  percent: true,
  // 小数
  float: true,
  // 年龄
  age: true,
  // 手机号
  phone: true,
  /**
   * 日期类
   */
  year: true,
  month: true,
  date: true,
  time: true,
  datetime: true,
  dateRange: true,
  timeRange: true,
  datetimeRange: true,
  tDay: true,
  /**
   * 媒体类型
   */
  color: v => ({ component: 'div', class: 'qsc-color', style: { background: v } }),
  image: v => ({ component: 'img', attrs: { src: v + '?x-oss-process=style/thumb.png' }, width: '35px' }),
  audio: v => ({ component: 'PlayBtn', type: 'audio', url: v }),
  video: v => ({ component: 'PlayBtn', type: 'video', url: v }),
  /**
   * web
   */
  url: v => ({ component: 'a', attrs: { href: v }, style: { display: 'inline-block', marginRight: '8px' }, children: v }),
  domain: true,
  email: true,
  /**
   * 其它类型
   */
  enum: (v, addons) => {
    // 取出匹配的symbol
    const m = _.find(addons, (n, i) => (
      v === (n.id === undefined ? i : n.id)
    ));
    return typeof m === 'object' ? m.name : m;
  },
  // 库存
  stock: true,
  // 创建时间
  createdTime: true
};
