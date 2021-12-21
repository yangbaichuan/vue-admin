<template>
  <Header :class="[prefixCls]">
    <span v-if="setting.showFoldButton" :class="[prefixCls + '-trigger']" @click="handleSliderClick">
      <VIcon :type="sliderIcon" :size="18"></vIcon>
    </span>
    <span v-if="setting.showRefreshButton" :class="[prefixCls + '-trigger']" @click="handleRefreshClick">
      <VIcon type="_refresh-outline" :size="18"></vIcon>
    </span>
    <!-- <Breadcrumb v-if="setting.showBreadCrumb" :class="[prefixCls + '-breadcrumb']">
      <BreadcrumbItem v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`">
        {{ showTitle(item) }}
      </BreadcrumbItem>
    </Breadcrumb> -->
    <div :class="[prefixCls + '-right']">
      <slot></slot>
    </div>
  </Header>
</template>

<script>
  import VIcon from '_c/vIcon';
  import { showTitle } from '@/utils/util';
  const prefixCls = 'basic-layout-header';
  export default {
    name: 'LayoutHeader',
    components: {
      VIcon
    },
    props: {
      collapsed: Boolean
    },
    inject: ['reload'],
    data () {
      return {
        prefixCls
      };
    },
    computed: {
      setting () {
        return this.$store.state.app.setting;
      },
      sliderIcon () {
        return this.collapsed ? '_menu-fold' : '_menu-unfold';
      },
      breadCrumbList () {
        return this.$store.state.app.breadCrumbList;
      }
    },
    methods: {
      showTitle (item) {
        return showTitle(item, this);
      },
      isCustomIcon (iconName) {
        return iconName.indexOf('_') === 0;
      },
      getCustomIconName (iconName) {
        return iconName.slice(1);
      },
      // 收起/展开菜单
      handleSliderClick () {
        this.$emit('on-coll-change', !this.collapsed);
      },
      // 刷新
      handleRefreshClick () {
        this.reload();
      }
    }
  };
</script>
