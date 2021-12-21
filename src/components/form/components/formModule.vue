<template>
  <Form ref="formModule" :model="param" v-bind="config.props" :style="config.style">
    <slot name="header"></slot>
    <Row v-if="hasCol" :gutter="16">
      <Col v-for="(item, index) in config.fields" :key="index" v-bind="getColProps(item.col)">
        <FormField :option="item" v-model="param[item.key]" :form-data="formData || param" @on-change="handleFieldChange"></FormField>
      </Col>
    </Row>
    <template v-else>
      <FormField
        v-for="(item, index) in config.fields"
        :key="index"
        :option="item"
        v-model="param[item.key]"
        :form-data="formData || param"
        @on-change="handleFieldChange" />
    </template>
    <slot name="footer"></slot>
  </Form>
</template>

<script>
  import { cloneDeep, isEqual } from 'lodash-es';
  export default {
    name: 'FormModule',
    components: {
      FormField: () => import('./formField.vue')
    },
    props: {
      value: undefined,
      formData: Object,
      option: {
        type: [Object, Array],
        required: true
      }
    },
    data () {
      return {
        param: {}
      };
    },
    computed: {
      config () {
        return Array.isArray(this.option) ? { fields: this.option } : this.option;
      },
      hasCol () {
        return this.config.fields.filter(v => v.col).length > 0;
      }
    },
    watch: {
      value: {
        handler: 'handleResetParam',
        immediate: true,
        deep: true
      }
    },
    methods: {
      handleResetParam (value) {
        if (isEqual(value, this.param)) return;
        if (!value) {
          this.param = {};
        } else {
          this.$set(this, 'param', cloneDeep(value));
        }
      },
      getColProps (value) {
        if (typeof value === 'object') return value;
        else return { span: value };
      },
      validate (callback) {
        this.$refs.formModule.validate(callback);
      },
      resetFields () {
        this.$refs.formModule.resetFields();
      },
      handleFieldChange (data, config) {
        this.$refs.formModule.validateField(config.key);
        this.$emit('input', this.param);
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
