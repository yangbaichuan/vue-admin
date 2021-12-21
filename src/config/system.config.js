/**
 * 系统配置
 */
module.exports = {
  /**
   * 系统标识
   * @description 用于数据缓存前缀，在同域多系统时便于区分
  */
  symbol: 'vue2_components',
  /**
   * 系统名称
   * @description 用于标题栏、登录页等等需要展示系统名称
   */
  title: 'Vue2基础模板',
  /**
   * 系统描述
   * @description 当前系统用途，在使用默认首页组件时展示此文案
   */
  description: `Vue2基础模板提供基础的后台框架，可在此基础上进行开发。它具备以下特点：\n
  1. 内置动态渲染组件，支持基于配置渲染功能。\n
  2. 封装业务通用组件，提升开发效率。\n
  3. axios二次封装，API维护更便捷。\n
  4. 内置操作权限指令。`,
  /**
   * 请求基础路径
   * @description
   *    dev   本地开发请求基础地址
   *    test  测试环境请求基础地址
   *    pre   预生产环境请求基础地址
   *    prod  生产环境请求基础地址
   */
  baseUrl: {
    dev: '',
    test: '',
    pre: '',
    prod: ''
  },
  /**
   * 默认首页路由
   * @description 默认开发的首页路由的name，默认为home
   */
  homePath: '/home',
  /**
   * 默认登录页路由
   * @description 默认开发的首页路由的name，默认为login
   */
  loginPath: '/login',
  /**
   * 权限类型
   * @description
   *   role: 角色
   *   sso : sso权限，需要根据sso的菜单数进行匹配
   */
  accessType: 'sso',
  // 固定侧边栏
  fixedSider: true,
  // 固定顶栏
  fixedHeader: true,
  // 显示面包屑
  showBreadCrumb: true,
  // 显示折叠侧边栏按钮
  showFoldButton: true,
  // 显示重载页面按钮
  showRefreshButton: true
};
