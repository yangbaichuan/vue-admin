<template>
  <FormItem v-bind="config.formItemProps">
    <component :is="config.component" v-model="param" v-bind="props" @on-change="handleChange" class="form-component">
      <template v-if="options">
        <Option v-for="(opt, i) in options" :key="i" :label="opt[nameKey]" :value="opt[valueKey]" />
      </template>
    </component>
  </FormItem>
</template>

<script>
  import { cloneDeep } from 'lodash-es';
  import searchFieldParser from '../utils/searchParser';
  export default {
    name: 'FormField',
    props: {
      value: undefined,
      option: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        param: undefined
      };
    },
    computed: {
      // 配置
      config () {
        return searchFieldParser(this.option);
      },
      // 模块
      module () {
        if (this.config.type && this.$store.hasModule(this.config.type)) {
          return this.config.type;
        } else {
          return false;
        }
      },
      // 组件
      component () {
        return this.config.component;
      },
      // 组件属性
      props () {
        return { ...this.config.props, clearable: true };
      },
      // 选项
      options () {
        if (this.config.symbols) {
          return this.config.symbols;
        } else if (this.module) {
          return this.$store.state[this.module].datas;
        } else {
          return [];
        }
      },
      nameKey () {
        if (this.config.nameKey) {
          return this.config.nameKey;
        } else if (this.module) {
          return this.$store.getters[`${this.module}/nameKey`] || 'name';
        } else {
          return 'label';
        }
      },
      valueKey () {
        if (this.config.valueKey) {
          return this.config.valueKey;
        } else if (this.module) {
          return this.$store.getters[`${this.module}/valueKey`] || 'id';
        } else {
          return 'value';
        }
      }
    },
    watch: {
      value: {
        handler: 'resetParam',
        immediate: true
      }
    },
    methods: {
      handleInit () {
        if (this.module && !this.option.length) {
          this.$store.dispatch(`${this.module}/query`, { page: 0 });
        }
      },
      resetParam (value) {
        if (typeof value === 'undefined') {
          this.param = undefined;
        } else {
          this.param = cloneDeep(value);
        }
      },
      handleChange (value) {
        if (this.component === 'DatePicker') {
          this.$set(this, 'param', value);
        }
        this.$emit('input', this.param);
        this.$emit('on-change', this.param, this.config);
      }
    },
    created () {
      this.handleInit();
    }
  };
</script>

<style lang="less" scoped>
  .form-component{
    width: 100%;
  }
</style>
