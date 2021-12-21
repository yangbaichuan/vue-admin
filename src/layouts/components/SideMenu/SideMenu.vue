<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <div class="basic-layout-side-menu scrollbar-hide side-menu-main">
      <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
        <template v-for="item in menuList">
          <template v-if="item.children">
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
              <VIcon :type="item.children[0].icon || ''"/>
              <span>{{ showTitle(item.children[0]) }}</span>
            </menu-item>
          </template>
          <template v-else>
            <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
            <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
              <VIcon :type="item.icon || ''"/>
              <span>{{ showTitle(item) }}</span>
            </menu-item>
          </template>
        </template>
      </Menu>
      <div class="menu-collapsed" v-show="collapsed" :list="menuList">
        <template v-for="item in menuList">
          <collapsed-menu v-if="showChildren(item)" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
          <a v-else :key="`drop-menu-${item.name}`" @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}">
            <VIcon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/>
            <span>{{ item.alias || item.title }}</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import SideMenuItem from './components/SideMenuItem.vue';
  import CollapsedMenu from './components/CollapsedMenu.vue';
  import { getUnion } from '@/utils/tools';
  import mixin from './mixins/mixin';

  export default {
    name: 'SideMenu',
    mixins: [mixin],
    components: {
      SideMenuItem,
      CollapsedMenu
    },
    props: {
      menuList: {
        type: Array,
        default () {
          return [];
        }
      },
      collapsed: {
        type: Boolean
      },
      theme: {
        type: String,
        default: 'dark'
      },
      rootIconSize: {
        type: Number,
        default: 20
      },
      iconSize: {
        type: Number,
        default: 16
      },
      accordion: Boolean,
      activeName: {
        type: String,
        default: ''
      },
      openNames: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        openedNames: []
      };
    },
    computed: {
      setting () {
        return this.$store.state.app.setting;
      },
      textColor () {
        return this.theme === 'dark' ? '#fff' : '#495060';
      }
    },
    methods: {
      handleSelect (name) {
        this.$emit('on-select', name);
      },
      getOpenedNamesByActiveName (name) {
        return this.$route.matched.map(item => item.name).filter(item => item !== name);
      },
      updateOpenName (name) {
        if (name === this.setting.homeName) this.openedNames = [];
        else this.openedNames = this.getOpenedNamesByActiveName(name);
      }
    },
    watch: {
      activeName (name) {
        if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name);
        else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
      },
      openNames (newNames) {
        this.openedNames = newNames;
      },
      openedNames () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened();
        });
      }
    },
    mounted () {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
    }
  };
</script>
<style lang="less">
@import './less/SideMenu.less';
</style>
