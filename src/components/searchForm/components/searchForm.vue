<template>
  <Form ref="searchForm" :model="param" class="search-form" v-bind="serchConfig.props" @submit.native.prevent>
    <Row :gutter="20">
      <Col v-for="(item, index) in option" :key="index" :xs="24" :md="12" :lg="8" :xl="6" :xxl="5">
        <SearchField :option="item" v-model="param[item.key]"></SearchField>
      </Col>
      <div class="search-form-actions">
        <Button type="primary" shape="circle" @click="handleClick(1)">查询</Button>
        <Button type="default" shape="circle" @click="handleClick(2)">重置</Button>
        <slot />
      </div>
    </Row>
  </Form>
</template>

<script>
  import SearchField from './searchField.vue';
  export default {
    name: 'SearchForm',
    components: {
      SearchField
    },
    props: {
      // 表单项配置
      option: {
        type: [Object, Array],
        default: () => []
      },
      // 绑定值
      value: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      serchConfig () {
        if (Array.isArray(this.option)) {
          return {
            props: {
              labelWidth: 80
            },
            fields: this.option
          };
        } else {
          return this.option;
        }
      },
      param: {
        get () {
          return this.value;
        },
        set (value) {
          this.$emit('input', value);
        }
      }
    },
    methods: {
      handleClick (type) {
        if (this.param.current) this.param.current = 1;
        if (type === 1) {
          this.$emit('on-query');
        } else {
          this.$refs.searchForm.resetFields();
          this.$emit('on-reset');
        }
        this.$emit('on-search');
      },
      handleFieldChange (config) {
        if (config.on && config.on.change) {
          config.on.change(this.param[config.key]);
        }
        this.$emit('on-field-change', this.param[config.key], config);
      }
    }
  };
</script>

<style lang="less" scoped>
  .search-form {
    background: #fff;
    border-radius: 5px;
    padding: 20px 20px 0;
    .search-form-actions{
      margin-bottom: 22px;
      padding-left: 20px;
      .ivu-btn{
        padding-left: 24px;
        padding-right: 24px;
        margin-right: 10px;
      }
    }
  }
</style>
