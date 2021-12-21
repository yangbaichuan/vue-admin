import { regFenToYuan } from '@/libs/util';
export default {
  /**
   * 基础类型
   */
  string: true,
  text: { tooltip: true },
  boolean: true,
  number: true,
  /**
   * 文本类型
   */
  // 标题
  title: true,
  // 描述
  desc: { tooltip: true },
  // 英文名称
  ename: true,
  // 中文名称
  cname: true,
  // 标识
  unique: true,
  /**
   * 数值类型
   */
  // 自然数
  natural: true,
  // 整数
  integer: true,
  // 正整数
  positiveInteger: true,
  // 百分比
  percent: v => ({ component: 'span', children: `${v}%` }),
  // 年龄
  age: true,
  // 手机号
  phone: { minWidth: 100 },
  // 金额（单位分，需转换元显示）
  amount: v => regFenToYuan(v),
  /**
   * 日期类
   */
  // 日期
  date: true,
  // 时间
  time: true,
  // 日期时间
  datetime: { minWidth: 160 },
  // 日期范围
  dateRange: true,
  // 时间范围
  timeRange: true,
  // 日期时间范围
  datetimeRange: true,
  /**
   * 媒体类型
   */
  color: v => ({ component: 'div', class: 'qsc-color', style: { background: v } }),
  image: v => ({ component: 'img', src: v, width: '35px' }),
  /**
   * web
   */
  url: v => ({ component: 'a', attrs: { href: v }, style: { 'white-space': 'nowrap' }, children: v }),
  domain: true,
  email: true,
  /**
   * 其它类型
   */
  enum: (v, addons) => {
    // 取出匹配的symbol
    const m = _.find(addons, (n, i) => (typeof n === 'string' ? v === i : v === n.id));
    return typeof m === 'object' ? m.name : m;
  },
  // 库存
  stock: true,
  // 创建时间
  createdTime: { minWidth: 180 }
};
