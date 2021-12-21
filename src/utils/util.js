import Cookies from 'js-cookie';
import setting from '@/config/system.config.js';
import { forEach, hasOneOf, objEqual, getObjLen } from './tools';
const { useI18n, accessType } = setting;

const TAGNAVLIST_KET = `${setting.symbol}TagNavList`;

/**
 * 设置token
 * @param {*} token
 */
export const setToken = (token) => {
  const option = { expires: 1 };
  Cookies.set('sso_token', escape(token), option);
};

/**
 * 获取token
 * @returns
 */
export const getToken = () => {
  const token = Cookies.get('sso_token');
  if (token) return unescape(token);
  else return '';
};

/**
 * 设置本地存储
 * @param {String}        key 存储的key
 * @param {String|Object} value 存储的值
 * @param {local|session} type 存储类型 默认localstorage
 */
export const setStorage = (key, value, type = 'local') => {
  const data = typeof value !== 'string' ? JSON.stringify(value) : value;
  if (type.includes('local')) {
    localStorage.setItem(`${setting.id}${key}`, encodeURIComponent(data));
  } else {
    sessionStorage.setItem(`${setting.id}${key}`, encodeURIComponent(data));
  }
};

/**
 * 获取本地存储的数据
 * @param {*} key
 * @param {*} type
 * @returns
 */
export const getStorage = (key, type = 'local') => {
  let data;
  if (type.includes('local')) {
    data = localStorage.getItem(`${setting.id}${key}`);
  } else {
    data = sessionStorage.getItem(`${setting.id}${key}`);
  }
  if (data) {
    const value = decodeURIComponent(data);
    return value.includes('{') ? JSON.parse(value) : value;
  } else return undefined;
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const paramObj = {};
  const keyValueArr = url.includes('?') ? url.split('?')[1].split('&') : [];
  keyValueArr.forEach(item => {
    const keyValue = item.split('=');
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

/**
 * 使用a标签下载文件
 * @param {*} name
 * @param {*} url
 */
export const downloadFileByATag = (name, url) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * 检测权限
 * @param {Array} access      路由权限
 * @param {Array} userAccess  用户权限
 * @returns Booleann
 */
export const hasAccess = (route, access) => {
  if (accessType === 'sso') {
    let result = false;
    for (let i = 0; i < access.length; i++) {
      if ((access[i].symbol || access[i].router_name) === route.name) {
        result = access[i];
        break;
      }
      if (access[i].sub_nodes && access[i].sub_nodes.length) {
        result = hasAccess(route, access[i].sub_nodes);
        if (result) break;
      }
    }
    return result;
  } else {
    if (!route.meta.access) return true;
    return route.meta.access.findIndex(val => access.includes(val)) !== -1;
  }
};

/**
 * 根据权限获取路由配置
 * @param {Array} routes 路由数组
 * @param {Array} access 权限数组
 * @returns
 */
export const getRoutesByAccess = (routes, access) => {
  return routes.filter(route => {
    if (route.meta && route.meta.notAccess) {
      return true;
    } else {
      const acc = hasAccess(route, access);
      if (acc) {
        if (typeof acc !== 'boolean') {
          const permission = acc.sub_nodes.filter(v => v.type === 3);
          route.meta.permission = permission;
          const authority = acc.sub_nodes.filter(v => v.type === 2);
          route.meta.authority = authority;
        }
        if (route.children && route.children.length) {
          route.children = getRoutesByAccess(route.children, access);
        }
        return true;
      } else {
        return false;
      }
    }
  });
};

/**
 * 构建API
 * @param {*} host
 * @param {*} apis
 * @returns
 */
export const createApi = (host, apis) => {
  if (process.env.NODE_ENV === 'development') {
    return apis;
  }
  const api = {};
  Object.keys(apis).forEach(k => {
    api[k] = `${host}${apis[k]}`;
  });
  return api;
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 */
export const setTitle = (data) => {
  window.document.title = data.title ? `${data.title} - ${setting.title}` : setting.title;
};

export const groupServerMenu = datas => {
  return datas.map(v => {
    const menu = {
      title: v.node_name,
      icon: v.icon || '',
      name: v.router_name,
      path: v.router_path,
      actions: v.actions,
      permission: v.permission,
      type: v.type,
      showAlways: true
    };
    if (v.sub_nodes && v.sub_nodes.length) {
      const children = v.sub_nodes.filter(n => n.type === 1);
      if (children.length) menu.children = groupServerMenu(children);
      const tabs = v.sub_nodes.filter(n => n.type === 2);
      if (tabs.length) menu.tabs = groupServerMenu(tabs);
    }
    return menu;
  });
};

export const hasChild = (item) => {
  return item.children && item.children.length !== 0;
};

/**
 * 是否在菜单中显示
 * @param item
 * @param access
 * @returns {boolean}
 */
const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true;
    else return false;
  } else return true;
};
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  const res = [];
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj = {
        name: item.name,
        ...item.meta
      };
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access);
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href;
      if (showThisMenuEle(item, access)) res.push(obj);
    }
  });
  return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  const homeItem = { ...homeRoute, ...homeRoute.meta };
  const routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem];
  const res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread;
  }).map(item => {
    const meta = { ...item.meta };
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      meta.title = meta.title(route);
    }
    const obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      to: item.redirect,
      ...meta
    };
    return obj;
  });
  return [{ ...homeItem, to: homeRoute.path }, ...res];
};

export const getRouteTitleHandled = (route) => {
  const router = { ...route };
  const meta = { ...route.meta };
  let title = '';
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item;
  if (!title) return;
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())));
    } else if (__titleIsFunction__) title = item.title;
    else title = vm.$t(item.name);
  } else title = item.title || item.name;
  return title;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage[TAGNAVLIST_KET] = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = (access) => {
  const list = localStorage[TAGNAVLIST_KET];
  return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1;
  const len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    const item = routers[i];
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute;
  const newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else newList.push({ name, path, meta });
  return newList;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  const nameSplit = file.name.split('.');
  const format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function (evt) {
      const data = evt.target.result; // 读到的数据
      const pasteData = data.trim();
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t');
      }).map(item => {
        return item[0].split(',');
      });
      if (format === 'csv') resolve(arr);
      else reject(new Error('[Format Error]:你上传的不是Csv文件'));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    const titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      const res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode;
  if (parentNode) {
    const classList = parentNode.classList;
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    const len = ele.childNodes.length;
    while (++i < len) {
      const child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length;
  let res = false;
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };
  scroll(from, to, step);
};

/**
 * 标记对象
 */
export const signObject = (obj) => {
  const _obj = JSON.parse(JSON.stringify(obj));
  for (const key in _obj) {
    if (Array.isArray(_obj[key])) {
      _obj[key].forEach(val => {
        if (typeof val === 'object') val._old = true;
      });
    }
  }
  return _obj;
};

/**
 * 处理数据，返回修改过的数据
 * @param oldObj
 * @param newObj
 */
export const handleObject = (newObj, oldObj) => {
  const obj = {};
  for (const key in newObj) {
    if (oldObj && oldObj[key]) {
      if (Array.isArray(newObj[key])) {
        const arr = [];
        for (let i = 0; i < newObj[key].length; i++) {
          if (typeof newObj[key][i] === 'object') {
            const o = handleObject(newObj[key][i], oldObj[key][i]);
            if (getObjLen(o)) {
              arr.push(o);
            }
          } else {
            arr.push(newObj[key][i]);
          }
        }
        if (arr.length > 0) {
          obj[key] = arr;
        }
      } else if (newObj[key] !== oldObj[key]) {
        obj[key] = newObj[key];
      }
    } else if (key !== '_old' && key !== 'id') {
      obj[key] = newObj[key];
    }
  }
  return obj;
};

/**
 * 获取制定参数
 * @param name
 * @returns {string|null}
 */
export const getParamInUrl = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则
  let search = location.search;
  if (location.hash.indexOf('?') !== -1) {
    search = '?' + location.hash.split('?')[1];
  }
  const r = search.substr(1).match(reg);// 匹配目标参数
  if (r != null) return decodeURIComponent(r[2]);
  return null; // 返回参数值
};

/**
 * 模板字符串替换
 * @param tmp
 * @param data
 * @param emptyTxt
 * @returns {*}
 */
export const tempReplace = (tmp, data, emptyTxt) => {
  const computed = tmp.replace(/\{\{(\w+)\}\}/g, function (match, key) {
    if (data && data[key]) {
      return data[key];
    } else {
      return emptyTxt || '无';
    }
  });
  return computed;
};

/**
 * 获取未来/过去的时间
 * @param type
 * @param num
 * @returns {Date}
 */
export const getDate = (type, num, format) => {
  const day = new Date();
  if (type === 'year') {
    day.setFullYear(day.getFullYear() + num);
  } else if (type === 'month') {
    day.setMonth(day.getMonth() + num);
  } else {
    day.setDate(day.getDate() + num);
  }
  return format ? dateFormat(day, format) : day;
};

/**
 * 拷贝到剪切板
 * @param text
 * @returns {boolean}
 */
export const copyToClipBoard = text => {
  const textarea = document.createElement('input');// 创建input对象
  const currentFocus = document.activeElement;// 当前获得焦点的元素
  document.body.appendChild(textarea);// 添加元素
  textarea.value = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
    // 获取光标起始位置到结束位置
    textarea.setSelectionRange(0, textarea.value.length);
  } else {
    textarea.select();
  }
  let flag = false;
  try {
    flag = document.execCommand('copy');// 执行复制
  } catch (eo) {
    flag = false;
  }
  document.body.removeChild(textarea);// 删除元素
  currentFocus.focus();
  return flag;
};

/**
 * 检索对象中的字段是否全部有值
 * @param keys
 * @param data
 * @return {boolean}
 */
export const hasAllValue = (keys, data) => {
  let flag = true;
  keys.forEach(key => {
    if (!data[key]) flag = false;
  });
  return flag;
};

/**
 * 获取guid
 */
export const getGuid = () => {
  const S4 = () => {
    // eslint-disable-next-line no-irregular-whitespace
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  // eslint-disable-next-line no-irregular-whitespace
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
};

/**
 * 获取uuid
 */
export const getUuid = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  const uuid = s.join('');
  return uuid;
};

/**
 * 分转元
 */
export const regFenToYuan = (fen) => {
  let num = fen;
  num = fen * 0.01;
  num += '';
  const reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
  num = num.replace(reg, '$1');
  num = toDecimal2(num);
  return num;
};

/**
 * 元转分
 */
export const regYuanToFen = (yuan, digit = 100) => {
  let m = 0;
  const s1 = yuan.toString();
  const s2 = digit.toString();
  try { m += s1.split('.')[1].length; } catch (e) {}
  try { m += s2.split('.')[1].length; } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};

/**
 * 强制保留2位小数，如：2，会在2后面补上00.即2.00
 * @param {*} x
 */
export const toDecimal2 = (x) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

/**
 * 查找树节点
 * @param {*} tree
 * @param {*} func
 */
export const findTreeNode = (tree, func) => {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.children) {
      const res = findTreeNode(data.children, func);
      if (res) return res;
    }
  }
  return null;
};

/**
 * 构建URL
 * @param {*} url     url地址
 * @param {*} param   参数对象
 */
export const createUrl = (url, param) => {
  const newParam = [];
  for (const i in param) {
    if (param[i] !== '' && param[i] !== null && typeof param[i] !== 'undefined') {
      newParam.push(i + '=' + param[i]);
    }
  }
  if (newParam.length) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + newParam.join('&');
  } else {
    return url;
  }
};

/**
 * 根据文件路径获取文件名
 * @param {*} filePath
 */
export const getFileNameFromPath = filePath => {
  const arr = filePath.split('/');
  const fileName = arr[arr.length - 1];
  const pattern = /\.{1}[a-z]{1,}$/;
  if (pattern.exec(fileName) !== null) {
    return (fileName.slice(0, pattern.exec(fileName).index));
  } else {
    return text;
  }
};

// 获取指定配置
export const getConfig = file => {
  const files = require.context('@/config', true, /\.js$/);
  const filePath = files.keys();
  if (filePath.findIndex(val => val.includes(`/${file}/index.js`)) !== -1) {
    // index.js优先解析
    const path = filePath.find(val => val.includes(`/${file}/index.js`));
    const config = files(path).default || files(path);
    if (!Array.isArray(config)) {
      return Object.keys(config).map(id => {
        return Object.assign({ id }, Array.isArray(config[id]) ? { datas: config[id] } : config[id]);
      });
    }
    return config;
  } else {
    // 无index.js解析所有文件
    return filePath.filter(val => val.includes(`/${file}/`) && !val.includes('index.js')).map(val => {
      const content = files(val).default || files(val);
      if (Array.isArray(content)) { // 数组转对象
        return { id: getFileNameFromPath(val), datas: content };
      }
      return Object.assign({ id: getFileNameFromPath(val) }, content);
    });
  }
};

/**
 * 返回请求结构体
 */
export const responseBody = (data) => {
  const isString = typeof data === 'string';
  return {
    code: isString ? 1 : 0, // code不为0时为异常
    data: !isString && data,
    message: isString && data
  };
};

/**
 * 获取随机数
 * @param {*} under 开始
 * @param {*} over  结束
 * @returns
 */
export const getRandom = (under, over) => {
  if (under && over) return parseInt(Math.random() * (over - under + 1) + under);
  else if (under) return parseInt(Math.random() * under + 1);
  else return 0;
};

/**
 * 获取文件夹中所有配置
 */
export const getConfigInFolder = folder => {
  const files = require.context('@/config', true, /\.js$/);
  const filePath = files.keys();
  if (filePath.findIndex(val => val.includes(`/${folder}/index.js`)) !== -1) {
    // index.js优先解析
    const path = filePath.find(val => val.includes(`/${folder}/index.js`));
    const config = files(path).default || files(path);
    if (!Array.isArray(config)) {
      return Object.keys(config).map(id => {
        return Object.assign({ id }, Array.isArray(config[id]) ? { datas: config[id] } : config[id]);
      });
    }
    return config;
  } else {
    // 无index.js解析所有文件
    return filePath.filter(val => val.includes(`/${folder}/`) && !val.includes('index.js')).map(val => {
      const content = files(val).default || files(val);
      if (Array.isArray(content)) { // 数组转对象
        return { id: getFileNameFromPath(val), datas: content };
      }
      return Object.assign({ id: getFileNameFromPath(val) }, content);
    });
  }
};

/**
 * 截取文件名
 * @param path 文件路径
 * @returns {String} 文件名
 */
export const splitFileName = path => {
  const start = path.lastIndexOf('/') + 1;
  const end = path.lastIndexOf('.');
  return path.substring(start, end);
};

/**
 * 加载所有配置
 * @param context 加载的资源
 * @returns {Object} 配置数据
 */
export const requireAll = context => {
  const datas = [];
  context.keys().forEach(path => {
    if (path.includes('index')) return;
    let content = context(path).default || context(path);
    if (!content.id) {
      const id = splitFileName(path);
      if (Array.isArray(content)) {
        content = {
          id,
          datas: content
        };
      } else {
        content.id = id;
      }
    }
    if (datas.findIndex(v => v.id === content.id) !== -1) {
      throw new Error(`The "${content.id}" is already exists！`);
    }
    datas.push(content);
  });
  return datas;
};

/**
 * 序列化数据（清理空值）
 * @param {*} data
 * @returns
 */
export const serializeData = data => {
  const param = {};
  Object.keys(data).forEach(k => {
    if (typeof data[k] !== 'undefined' && data[k] !== '' && data[k] !== []) {
      param[k] = data[k];
    }
  });
  return param;
};
