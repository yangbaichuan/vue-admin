import { dateFormat } from '@/utils/date';

/**
 * 基础类型
 */
const basic = {
  string: true,
  boolean: true,
  number: true
};

/**
 * 文本类型
 */
const text = {
  // 标题
  title: { minWidth: 300 },
  // 标识
  unique: { minWidth: 120 },
  // 中文姓名
  cname: { minWidth: 100, align: 'center' }
};

/**
 * 数值类型
 */
const number = {
  // 列表id
  id: { width: 100, align: 'center' }
};

/**
 * 日期类
 */
const date = {
  // 时间戳
  timestamp: { minWidth: 180, children: v => dateFormat(v) }
};

/**
 * 媒体类型
 */

const media = {
  image: { minWidth: 150, align: 'center', children: v => ({ component: 'img', attrs: { src: v, width: '50px' } }) }
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
  enum: {
    minWidth: 100,
    children: (v, { symbols }) => {
      const m = symbols.find((n, i) => (typeof n === 'string' ? v === i : v === n.value));
      return typeof m === 'object' ? m.label : m;
    }
  },
  state: {
    minWidth: 120,
    align: 'center',
    children: (v, { symbols }) => {
      const { label, color } = symbols.find(n => n.value === v);
      return { component: 'div', class: 'table-state', style: { color, borderColor: color }, children: label };
    }
  }
};

export default Object.assign({}, basic, text, number, date, media, web, other);
