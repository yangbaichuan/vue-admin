<template>
  <div>
    <Tabs value="name1">
      <TabPane label="标签一" name="name1">标签一的内容</TabPane>
      <TabPane label="标签二" name="name2">标签二的内容</TabPane>
      <TabPane label="标签三" name="name3">标签三的内容</TabPane>
    </Tabs>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'PageLayout',
    data () {
      return {

      };
    }
  };
</script>

<style lang="less" scoped>

</style>
