import axios from 'axios';
import { Message } from 'view-design';
import { getToken } from '@/utils/util';
import store from '../store';

// 异常拦截处理器
const errorHandler = error => {
  if (error.data && (error.data.message || error.data.msg)) {
    Message.error(error.data.message || error.data.msg);
  } else {
    Message.error('服务器发生错误！');
  }
  return Promise.reject(error);
};

// 添加拦截器
const addInterceptors = (instance) => {
  // 响应拦截
  instance.interceptors.response.use(res => {
    const { data } = res;
    // 此处可以添加统一拦截代码
    return data;
  }, errorHandler);
};

// 创建实例
const createAxios = () => {
  const instance = axios.create({
    // API 请求的默认前缀
    baseURL: '',
    // 请求超时时间
    timeout: 10000,
    headers: {
      'Qsc-Token': getToken(),
      Authorization: 'Bearer ' + getToken()
    }
  });
  // 请求拦截
  instance.interceptors.request.use(config => {
    return config;
  }, errorHandler);

  return instance;
};

export const get = option => {
  const instance = createAxios();
  instance.get(option.url, { params: option.data }).then(res => {
    option.success(res.data);
  });
};

export const post = option => {
  const instance = createAxios();
  instance.post(option.url, option.data).then(res => {
    option.success(res.data);
  });
};

export default {
  request (conf, data) {
    const instance = createAxios();
    addInterceptors(instance);
    if (!conf || (typeof conf !== 'string' && !conf.url)) {
      throw new Error('URL is required!');
    }
    const [url, method] = typeof conf === 'string' ? conf.split('|').map(val => val.trim()) : [conf.url, conf.method];
    if (!method || method.toUpperCase === 'POST') {
      return instance.post(url, data);
    } else {
      return instance.get(url, { params: data });
    }
  },
  get (url, params, option = {}) {
    const instance = createAxios();
    addInterceptors(instance);
    return instance.get(url, { ...option, params });
  },
  post (url, data, option = {}) {
    const instance = createAxios();
    addInterceptors(instance);
    return instance.post(url, data, option);
  },
  upload (url, data, option = {}) {
    const instance = createAxios();
    instance.interceptors.response.use(({ data }) => data);
    return instance({
      ...option,
      url,
      data,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
};
