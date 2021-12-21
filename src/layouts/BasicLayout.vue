<template>
  <Layout :class="classes">
    <Sider :class="siderClasses" hide-trigger collapsible :width="200" :collapsed-width="80" v-model="collapsed">
      <SideMenu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <RouterLink to="/" class="logo">
          <img src="../assets/images/logo.svg" alt="">
          <h3 v-show="!collapsed">{{ setting.title }}</h3>
        </RouterLink>
      </SideMenu>
    </Sider>
    <Layout :class="mianClasses">
      <HeaderBar :class="headerClasses" :style="headerStyle" :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <EnvTag v-if="webEnv !== 'pro'"></EnvTag>
        <FullScreen :class="[prefixCls + '-header-trigger']" tooltip />
        <user :class="[prefixCls + '-header-trigger']" :message-unread-count="unreadCount" :user-avatar="userAvatar" :user-name="userName" />
      </HeaderBar>
      <Content :class="contentClasses">
        <keep-alive :include="cacheList">
          <router-view v-if="isShow" />
        </keep-alive>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
  import SideMenu from './components/SideMenu';
  import HeaderBar from './components/HeaderBar';
  import User from './components/User';
  import FullScreen from '@/components/fullScreen';
  import EnvTag from './components/EnvTag';
  import { mapMutations, mapActions, mapGetters } from 'vuex';
  import { getNewTagList, routeEqual } from '@/utils/util';
  import routers from '@/router/routes';
  import './BasicLayout.less';
  const prefixCls = 'basic-layout';
  export default {
    name: 'BasicLayout',
    components: {
      SideMenu,
      HeaderBar,
      FullScreen,
      EnvTag,
      User
    },
    provide () { // 注册一个方法
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        prefixCls,
        collapsed: false,
        isShow: true
      };
    },
    computed: {
      setting () {
        return this.$store.state.app.setting;
      },
      classes () {
        return [prefixCls, `${prefixCls}-has-sider`];
      },
      siderClasses () {
        return [
          `${prefixCls}-sider`,
          this.setting.fixedSider && `${prefixCls}-sider-fix`
        ];
      },
      mianClasses () {
        return [
          `${prefixCls}-main`,
          this.setting.fixedSider && (this.collapsed ? `${prefixCls}-main-with-sider-collapse` : `${prefixCls}-main-with-sider`)
        ];
      },
      headerClasses () {
        return [this.setting.fixedHeader && `${prefixCls}-header-fix`];
      },
      headerStyle () {
        return this.setting.fixedHeader ? { width: `calc(100% - ${this.collapsed ? 80 : 200}px)` } : {};
      },
      contentClasses () {
        return [
          `${prefixCls}-content`,
          this.setting.fixedHeader && `${prefixCls}-content-fix-header`
        ];
      },
      ...mapGetters([
        'errorCount'
      ]),
      showBreadCrumb () {
        return !['error', 'home'].includes(this.$route.fullPath.split('/')[1]);
      },
      tagNavList () {
        return this.$store.state.app.tagNavList;
      },
      tagRouter () {
        return this.$store.state.app.tagRouter;
      },
      userAvatar () {
        return this.$store.state.account.avatar;
      },
      userName () {
        return this.$store.state.account.userName;
      },
      cacheList () {
        const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []];
        return list;
      },
      menuList () {
        return this.$store.state.app.menus;
      },
      local () {
        return this.$store.state.app.local;
      },
      hasReadErrorPage () {
        return this.$store.state.app.hasReadErrorPage;
      },
      unreadCount () {
        return this.$store.state.account.unreadCount;
      },
      breadCrumbList () {
        return this.$store.state.app.breadCrumbList;
      },
      webEnv () {
        return process.env.VUE_APP_CURRENTMODE;
      }
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setTagNavList',
        'addTag',
        'setLocal',
        'setHomeRoute',
        'closeTag'
      ]),
      ...mapActions([
        'handleLogin',
        'getUnreadMessageCount'
      ]),
      turnToPage (route) {
        let { name, params, query } = {};
        if (typeof route === 'string') name = route;
        else {
          name = route.name;
          params = route.params;
          query = route.query;
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1]);
          return;
        }
        if (name !== this.$route.name) {
          this.$router.push({
            name,
            params,
            query
          });
        };
      },
      handleCollapsedChange (state) {
        this.collapsed = state;
      },
      handleCloseTag (res, type, route) {
        if (type !== 'others') {
          if (type === 'all') {
            this.turnToPage(this.setting.homeName);
          } else {
            if (routeEqual(this.$route, route)) {
              this.closeTag(route);
            }
          }
        }
        this.setTagNavList(res);
      },
      handleClick (item) {
        this.turnToPage(item);
      },
      reload () {
        this.isShow = false;
        this.$nextTick(() => {
          this.isShow = true;
        });
      }
    },
    watch: {
      '$route' (newRoute) {
        const { name, query, params, meta } = newRoute;
        this.addTag({
          route: { name, query, params, meta },
          type: 'push'
        });
        this.setBreadCrumb(newRoute);
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
        this.$refs.sideMenu.updateOpenName(newRoute.name);
      }
    },
    mounted () {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      this.setTagNavList();
      this.setHomeRoute(routers);
      const { name, params, query, meta } = this.$route;
      this.addTag({
        route: { name, params, query, meta }
      });
      this.setBreadCrumb(this.$route);
      // 设置初始语言
      // this.setLocal(this.$i18n.locale);
      // 如果当前打开页面不在标签栏中，跳到homeName页
      if (!this.tagNavList.find(item => item.name === this.$route.name)) {
        this.$router.push({
          name: this.setting.homeName
        });
      }
      // 获取未读消息条数
      // this.getUnreadMessageCount();
    }
  };
</script>
