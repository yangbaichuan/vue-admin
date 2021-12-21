<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <VIcon :type="parentItem.icon || ''" :size="18"/>
      <span>{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
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
  </Submenu>
</template>
<script>
  import mixin from '../mixins/mixin';
  import itemMixin from '../mixins/item-mixin';
  export default {
    name: 'SideMenuItem',
    mixins: [mixin, itemMixin]
  };
</script>
<style lang="less" scoped>
  /deep/.ivu-menu-submenu-title{
      i {
        margin-right: 10px;
        &:last-child{
          margin-right: 0px;
        }
      }
  }
  /deep/.ivu-menu-vertical{
    .ivu-menu-submenu-title-icon{
      right: 6px;
    }
  }
  .ivu-menu-submenu{
    /deep/.ivu-menu-item{
      padding-left: 38px!important;
      white-space: nowrap;
      span{
        white-space: nowrap;
      }
    }
  }
</style>
