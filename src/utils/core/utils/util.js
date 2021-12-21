/**
 * 设置本地存储
 * @param {*} key
 * @param {*} value
 * @param {*} type
 */
export const setStorage = (key, value, type = 'local') => {
  const data = !_.isString(value) ? JSON.stringify(value) : value;
  if (type.includes('local')) {
    localStorage.setItem(`${VUE_ADMIN.id}_${key}`, encodeURIComponent(data));
  } else {
    sessionStorage.setItem(`${VUE_ADMIN.id}_${key}`, encodeURIComponent(data));
  }
};

/**
 * 获取本地存储
 * @param {*} key
 * @param {*} type
 */
export const getStorage = (key, type = 'local') => {
  let data;
  if (type.includes('local')) {
    data = localStorage.getItem(`${VUE_ADMIN.id}_${key}`);
  } else {
    data = sessionStorage.getItem(`${VUE_ADMIN.id}_${key}`);
  }
  if (data) {
    const value = decodeURIComponent(data);
    return value.includes('{') ? JSON.parse(value) : value;
  } else return undefined;
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
