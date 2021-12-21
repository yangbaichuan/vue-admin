<template>
  <div>
    <Tabs :value="$route.name" @on-click="handleClick">
      <TabPane v-for="(item, index) in tabRoutes" :key="index" :label="item.meta.title" :name="item.name"></TabPane>
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
    },
    computed: {
      routes () {
        return this.$router.getRoutes(); ;
      },
      tabRoutes () {
        return this.routes.filter(v => v.parent && v.parent.path === this.$route.matched[1].path);
      }
    },
    methods: {
      handleClick (name) {
        this.$router.push({
          name
        });
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
