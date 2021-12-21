<template>
  <Poptip trigger="hover">
    <div :class="['env-tag', isError && 'env-tag-error']">
      <Icon type="md-ionic" size="18" />
      <span v-if="isError">环境异常</span>
      <span v-else>{{ webEnv | envLabel }}</span>
    </div>
    <div slot="content" class="env-tag-content">
      <p>
        <span class="env-label">WEB：</span>
        <span>{{webEnv|envLabel}}</span>
      </p>
      <p>
        <span class="env-label">API：</span>
        <span>{{apiEnv|envLabel}}</span>
      </p>
    </div>
  </Poptip>
</template>

<script>
  export default {
    name: 'EnvTag',
    filters: {
      envLabel (value) {
        const envs = [
          { label: '开发环境', value: ['dev'] },
          { label: '测试环境', value: ['test'] },
          { label: '预生产环境', value: ['pre'] },
          { label: '生产环境', value: ['prod', 'master'] }
        ];
        const env = envs.find(v => v.value.includes(value));
        if (env) {
          return env.label;
        } else {
          return '未知环境';
        }
      }
    },
    computed: {
      apiEnv () {
        return this.$store.state.app.apiEnv;
      },
      webEnv () {
        return process.env.VUE_APP_CURRENTMODE;
      },
      isError () {
        const envs = [
          { web: 'dev', api: 'dev' },
          { web: 'test', api: 'test' },
          { web: 'pre', api: 'pre' },
          { web: 'prod', api: 'master' }
        ];
        return envs.find(v => v.web === this.webEnv).api !== this.apiEnv;
      }
    }
  };
</script>

<style lang="less" scoped>
  .env-tag{
    line-height: 54px;
    .ivu-icon{
      margin-right: 5px;
      vertical-align: middle;
    }
    span{
      display: inline-block;
      vertical-align: middle;
    }
    &.env-tag-error{
      color: #ed4014;
    }
  }
  .env-tag-content{
    p{
      line-height: 30px;
      color: #32363a;
    }
    .env-label{
      display: inline-block;
      width: 45px;
      text-align: right;
      font-weight: 500;
    }
  }
</style>
