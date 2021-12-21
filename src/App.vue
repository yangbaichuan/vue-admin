<template>
  <div class="root-container" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script scoped type="text/ecmascript-6">
  export default {
    data () {
      return {};
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  .root-container {
    width: 100%;
    height: 100%;

    &[v-cloak] {
      display: none;
    }
  }

  .header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
