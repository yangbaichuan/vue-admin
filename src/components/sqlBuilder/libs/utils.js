import _ from 'lodash';
import { CONDITIONS } from './constants';

/**
 * 将sql字符串转换为一维数组
 * @param sql   String    sql语句
 * @param tags  Array     标签数组，用于读取sql中的标签数据
 */
const transToParam = (sql, tags) => {
  if (!sql) return;
  let tokens = [];
  let current = 0;
  while (current < sql.length) {
    let char = sql[current];
    let value;
    if (/[\\(\\)]/.test(char)) { // 括号
      tokens.push({ type: 'paren', value: char });
      current++;
      continue;
    } else if (/[A-Z\\>\\<\\=\\!\\%]/.test(char)) { // 条件
      value = '';
      while (char && /[A-Z\\>\\<\\=\\!\\%]/.test(char)) {
        value += char;
        char = sql[++current];
      }
      tokens.push({ type: 'condition', value });
      continue;
    } else if (/[a-z]/.test(char)) { // key：无引号包裹，切以字母开头
      value = '';
      while (char && !/[\s\\,\\(]/.test(char)) {
        value += char;
        char = sql[++current];
      }
      tokens.push({ type: 'value', value });
      continue;
    } else if (/[\\']/.test(char)) { // 引号包裹的值
      value = '';
      char = sql[++current];
      while (char && !/[\\']/.test(char)) {
        if (char === '%') {
          if (sql[current - 1] === '\'') tokens.push({ type: 'condition', value: char });
        } else {
          value += char;
        }
        char = sql[++current];
      }
      tokens.push({ type: 'value', value: value });
      if (sql[current - 1] === '%') tokens.push({ type: 'condition', value: '%' });
      ++current;
      continue;
    } else if (/[0-9\\-]/.test(char)) { // 数字的值
      value = '';
      while (char && /[0-9\\.\\-]/.test(char)) {
        value += char;
        char = sql[++current];
      }
      tokens.push({ type: 'value', value: Number(value) });
      continue;
    } else { // 空格、逗号等需要跳过的部分
      // if (/[\s\\,]/.test(char))
      current++;
      continue;
    }
  }
  return parse(tokens, tags);
};

/**
 * 将一维数组拆解成表单对象
 * @param arr     Array   sql语句转换后的数组
 * @param tags    Array   标签数组
 * @returns {{_id: string, type: number, value: []}}
 */
const parse = (arr, tags) => {
  let current = 0;
  const walk = () => {
    let obj = { _id: getUuid(), type: 1, key: '', condition: '' };
    for (let i = current; i < arr.length - 1; i++) {
      const node = arr[i];
      if (['AND', 'OR', '('].indexOf(node.value) !== -1) {
        if (obj.key) {
          // 正常不会走到这里，数据错误时会走到这里
          return obj;
        } else {
          // 解析and、or、和分组情况
          obj = { _id: getUuid(), type: 2, relation: 'AND', value: [] };
          if (['AND', 'OR', '('].indexOf(arr[i].value) !== -1) {
            if (arr[i].value === '(') {
              // 分组情况
              if (arr[i + 1].value === 'NOT' && arr[i + 2].value === '(') { // 检测not并跳过
                obj.not = true;
                current = i + 3;
              } else {
                current = i + 1;
              }
            } else {
              // AND和OR情况
              if (arr[i + 2].value === 'NOT' && arr[i + 1].value === '(') { // 检测not并跳过
                obj.not = true;
                current = i + 4;
              } else {
                current = i + 2;
              }
            }
            while (current < arr.length - 1) {
              obj.value.push(walk());
              if (arr[current] && ['AND', 'OR'].indexOf(arr[current].value) !== -1) obj.relation = arr[current].value;
              if (!arr[current] || arr[current].value === ')') {
                current = current + (obj.not ? 2 : 1);
                break;
              }
              if (!arr[current + 1] || arr[current + 1].value !== '(' || arr[current + 1].value === ')') current++;
            }
            return obj;
          } else {
            // 正常不会走到这里，数据错误时会走到这里
            current = i + 1;
          }
        }
      } else if (!obj.key && node.type === 'value' && ['datediff'].indexOf(node.value) === -1) { // 首先找key
        obj = _.assign(obj, getKey(node.value, tags));
        current = i + 1;
      } else if (['AND', 'OR'].indexOf(node.value) === -1 && node.type !== 'paren') { // 其次查找条件和值
        if (node.type === 'condition') obj.condition = node.value;
        // 集合条件(将i指针指向下一个值)
        while (arr[++i] && arr[i].type === 'condition' && ['AND', 'OR'].indexOf(arr[i].value) === -1) {
          obj.condition += ` ${arr[i].value}`;
        }
        // 以下为拼装条件和值
        if (obj.condition.indexOf('BETWEEN') !== -1) { // 处理BETWEEN
          obj.condition += ' {{value.0}} AND {{value.1}}';
          obj.value = [arr[i].value, arr[i += 2].value];
        } else if (obj.condition.indexOf('IN') !== -1) { // 处理IN
          obj.condition += ' ({{value}})';
          obj.value = [];
          while (arr[++i].value !== ')') {
            if (arr[i].type === 'value') obj.value.push(arr[i].value);
          }
        } else if (obj.condition.indexOf('LIKE') !== -1) { // 处理LIKE
          while (arr[i] && arr[i].value) {
            if (arr[i].type === 'paren') {
              obj.condition += arr[i].value === '(' ? ` ${arr[i].value}'` : `'${arr[i].value}`;
            } else if (arr[i].type === 'condition') {
              obj.condition += `${arr[i].value}`;
            } else {
              obj.condition += '{{value}}';
              obj.value = arr[i].value;
            }
            if (arr[i].value === ')') {
              break;
            }
            i++;
          }
        } else if (node.value === 'datediff') { // datediff
          obj.condition = _.cloneDeep(CONDITIONS.find(val => val.value === 'date_diff').syntax);
          obj = _.assign(obj, getKey(arr[i += 1].value, tags));
          obj.value = [arr[i += 7].value, arr[i - 3].value];
        } else if (typeof arr[i] !== 'undefined' && arr[i].type === 'value') {
          if (arr[i].value === '' && ~['=', '!='].indexOf(obj.condition)) {
            obj.condition += ' \'\'';
          } else {
            obj.value = arr[i].value;
          }
        }
        const cond = CONDITIONS.find(val => val.syntax === obj.condition);
        if (cond) obj.condition = CONDITIONS.find(val => val.syntax === obj.condition).value;
        current = i + 1;
        break;
      } else {
        // 正常不会走到这里，数据错误时会走到这里
        current = i + 1;
        break;
      }
    }
    return obj;
  };
  let param = { _id: getUuid(), type: 2, relation: 'AND', value: [] };
  if (arr[current] && arr[current].value === 'NOT' && arr[current + 1].value === '(') {
    param.not = true;
    current += 2;
  }
  while (current < arr.length - 1) {
    param.value.push(walk());
    if (arr[current] && ['AND', 'OR'].indexOf(arr[current].value) !== -1) {
      param.relation = arr[current].value;
      current++;
    }
  }
  return param;
};

/**
 * 获取key
 * @param value   String    需要分离key的值
 * @param tags    Array     标签数组，根据key获取相应属性
 * @returns {{table: string, data_type: number, key: string}}
 */
const getKey = (value, tags) => {
  let obj = {
    table: null,
    data_type: null
  };
  if (value.indexOf('.') !== -1) {
    const arr = value.split('.');
    obj.table = arr[0];
    obj.key = arr[1];
  } else {
    obj.key = value;
  }
  if (tags && tags.length > 0) {
    const allTags = _.flattenDeep(tags.map(val => val.group_data));
    const tag = allTags.find(val => val.tag_id === obj.key);
    if (tag) {
      obj.table = tag.tag_table;
      obj.data_type = tag.tag_format;
    }
  }
  return obj;
};

/**
 * json转sql
 * @param param 需要转换sql的数据
 * @param table 插入表名
 * @returns {string}
 */
const transToSql = (param, table) => {
  let str = '';
  if (_.isArray(param)) {
    param.forEach((val, i) => {
      if (i === 0) {
        str += transGroup(val, table);
      } else {
        str += ` AND ( ${transGroup(val, table)} )`;
      }
    });
  } else {
    str = transGroup(param, table);
  }
  return str;
};

/**
 * 处理组
 * @param param
 * @returns {string}
 */
const transGroup = (param, table) => {
  let str = '';
  if (!param) return str;
  if (param.value && param.value.length > 0) {
    const relation = param.relation;
    const arr = transCondition(param.value, table);
    str = arr.join(` ${relation} `);
  }
  if (param.not) {
    str = `NOT ( ${str} )`;
  }
  return str;
};

/**
 * 处理条件
 * @param param
 * @returns {Array}
 */
const transCondition = (param, table) => {
  let arr = [];
  param.forEach(val => {
    if (val.type === 1) {
      let str = '';
      // key的操作
      if (!val.key) return;
      else str = (table ? `${val.table}.` : '') + `${val.key} `;
      // condition的操作
      if (val.condition) {
        // 获取条件对象
        const condition = CONDITIONS.find(v => v.value === val.condition);
        // 获取模板字符串
        let syntax = condition.syntax;
        if (syntax.indexOf('{{key}}') !== -1) {
          // 模板中包含key字段的时候，重置str字符串
          str = '';
        }
        if (condition.syntax.indexOf('{') === -1) {
          str += `${condition.syntax} `;
          if (typeof val.value !== 'undefined') {
            str += typeof val.value === 'string' ? `'${val.value}'` : val.value;
          }
        } else if (val.value) {
          str += condition.syntax.replace(/\{\{(.+?)\}\}/g, function (match, key) {
            if (key === 'key') {
              return table ? `${val.table}.${val.key}` : val.key;
            } else if (key.indexOf('.') === -1) {
              // 无.的情况下直接为key
              if (_.isArray(val[key])) {
                let value = [];
                val[key].forEach(v => {
                  value.push([1, 2, 6].indexOf(val.data_type) === -1 ? `'${v}'` : Number(v));
                });
                return value.join(',');
              } else {
                return (typeof val[key] === 'string' && !condition.noQuotes) ? `'${val[key]}'` : val[key];
              }
            } else {
              // 有.的情况下需要在数组中取值
              let item = val;
              key.split('.').forEach(k => {
                item = item[k];
              });
              return typeof item === 'string' ? `'${item}'` : item;
            }
          });
        }
      }
      arr.push(str);
    } else {
      arr.push('( ' + transToSql(val, table) + ' )');
    }
  });
  return arr;
};

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
const dateFormat = (value, fmt) => {
  // author: meizz
  let o = {
    'M+': value.getMonth() + 1, // 月份
    'd+': value.getDate(), // 日
    'h+': value.getHours(), // 小时
    'm+': value.getMinutes(), // 分
    's+': value.getSeconds(), // 秒
    'q+': Math.floor((value.getMonth() + 3) / 3), // 季度
    'S': value.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length)); }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  }
  return fmt;
};

/**
 * 获取uuid
 * @param len   长度  1 - n
 * @param radix 基数  2、10、16
 * @returns {string}
 */
const getUuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

export { transToSql, transToParam, dateFormat, getUuid };
