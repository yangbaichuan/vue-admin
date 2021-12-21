import BasicLayout from '@/layouts/BasicLayout.vue';

/**
 * 基础路由
 */
const basicRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '用户登录',
      hideInMenu: true
    },
    component: () => import('@/views/account/Login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: BasicLayout,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/views/dashboard/Home.vue')
      }
    ]
  }
];

/**
 * 异常路由
 */
const errorRoutes = [
  {
    path: '/error',
    name: 'error',
    meta: {
      title: '异常页面',
      alias: '异常',
      icon: 'md-alert',
      hideInMenu: true
    },
    component: BasicLayout,
    children: [
      {
        path: '403',
        name: 'error_403',
        meta: {
          title: '403'
        },
        component: () => import('@/views/error/403.vue')
      },
      {
        path: '404',
        name: 'error_404',
        meta: {
          title: '404'
        },
        component: () => import('@/views/error/404.vue')
      }
    ]
  },
  {
    path: '*',
    meta: {
      title: '服务器发生错误',
      hideInMenu: true
    },
    redirect: '/error/404'
  }
];

export default [...basicRoutes, ...errorRoutes];
