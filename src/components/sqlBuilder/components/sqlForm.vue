<template>
  <div :class="[prefixCls]">
    <div :class="[prefixCls + '-left']">
      <img v-if="!readonly && draggable" src="../assets/drag.png" alt="拖拽">
    </div>
    <Form :class="[prefixCls + '-form']" :model="param" inline>
      <FormItem prop="key" v-if="tags" :class="[prefixCls + '-key']">
        <Select ref="tag" v-model="param.key" @on-change="tagChange" filterable clearable placeholder="请选择标签">
          <OptionGroup v-for="(item, index) in tags" :key="index" :label="item.group_name">
            <Option v-for="(opt, i) in item.group_data" :key="i" :value="opt.tag_id" :label="opt.tag_name">{{ opt.tag_name }}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem prop="condition" v-if="param.key" :class="[prefixCls + '-condition']">
        <Select v-model="param.condition" @on-change="conditionChange" clearable placeholder="请选择条件">
          <Option v-for="item in conditions" :value="item.value" :key="item.value" :label="item.name">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <div v-if="showValue"  :class="[prefixCls + '-value']">
        <template v-if="Array.isArray(component)">
          <template v-for="(item, index) in component">
            <FormItem prop="value" :key="index">
              <component :is="item.name" v-model="param.value[index]" :type="item.type" @on-change="valueChange" filterable clearable v-bind="item.props">
                <template v-if="item.name === 'Select'">
                  <Option v-for="(opt, i) in (item.options || options)" :value="opt.value" :key="i" :label="opt.remark">{{opt.remark}}</Option>
                </template>
              </component>
            </FormItem>
          </template>
        </template>
        <template v-else>
          <FormItem prop="value">
            <component :is="component.name" v-model="param.value" :type="component.type" @on-change="valueChange" :multiple="options.length > 0" filterable clearable v-bind="component.props">
              <template v-if="component.name === 'Select'">
                <Option v-for="(opt, i) in options" :value="opt.value" :key="i" :label="opt.remark">{{opt.remark}}</Option>
              </template>
            </component>
          </FormItem>
        </template>
      </div>
    </Form>
    <div :class="[prefixCls + '-actions']">
      <slot></slot>
    </div>
  </div>

</template>

<script>
  import _ from 'lodash';
  import { CONDITIONS, DATATYPES } from '../libs/constants';
  import { dateFormat } from '../libs/utils';
  import Mixin from '../libs/mixin';
  const prefixCls = 'sql-form';
  export default {
    name: 'sql-form',
    mixins: [Mixin],
    data () {
      return {
        prefixCls,
        param: {
          type: 1
        },
        noValueKeys: CONDITIONS.filter(v => v.hasValue === false).map(val => val.value)
      };
    },
    computed: {
      // 选项
      options () {
        return this.tag && this.tag.tag_format_extra ? this.tag.tag_format_extra : [];
      },
      // 整合所有标签
      allTags () {
        return this.tags.length > 0 ? _.flattenDeep(this.tags.map(val => val.group_data)) : [];
      },
      // 选中的标签数据
      tag () {
        if (this.param.key && this.allTags.length > 0) {
          return this.allTags.find(val => val.tag_id === this.param.key);
        } else {
          return null;
        }
      },
      // 选中的条件数据
      condition () {
        return this.param.condition ? CONDITIONS.find(val => val.value === this.param.condition) : null;
      },
      // 过滤后的条件数据
      conditions () {
        return this.tag && this.tag.tag_format ? CONDITIONS.filter(val => ~val.data_types.indexOf(this.tag.tag_format)) : [];
      },
      // 值的组件
      component () {
        if (this.condition && this.condition.component) {
          return this.condition.component;
        } else if (this.tag && this.tag.tag_format) {
          const component = DATATYPES.find(val => val.id === this.tag.tag_format).component;
          if (this.param.condition.indexOf('between') !== -1) {
            return [component, component];
          } else {
            return component;
          }
        } else {
          return 'Input';
        }
      },
      // 显示值组件
      showValue () {
        if (!this.param.condition || this.condition.hasValue === false) {
          return false;
        } else {
          return true;
        }
      }
    },
    methods: {
      change () {
        const param = _.cloneDeep(this.param);
        // 转换时间类型
        if (!_.isArray(param.value) && param.value instanceof Date) {
          param.value = dateFormat(this.param.value, this.component.format);
        } else if (_.isArray(param.value)) {
          param.value = param.value.map((val, i) => {
            if (val instanceof Date) return dateFormat(val, this.component[i].format);
            else return val;
          });
        }
        this.$emit('input', param);
        this.$emit('on-change', param);
      },
      // 标签变化
      tagChange (value) {
        this.$delete(this.param, 'condition');
        this.$delete(this.param, 'value');
        if (value) {
          this.$set(this.param, 'table', this.tag.tag_table);
          this.$set(this.param, 'data_type', this.tag.tag_format);
        }
        this.change();
      },
      // 条件变化
      conditionChange (value) {
        // let val = DATATYPES.find(val => val.id === this.tag.tag_format).value;
        // if (value && value.indexOf('between') !== -1) {
        const val = Array.isArray(this.component) ? this.component.map(val => val.value) : this.component.value;
        if (Array.isArray(this.component)) {
          if (typeof val !== 'undefined') {
            this.$set(this.param, 'value', val);
            this.change();
          } else {
            this.$set(this.param, 'value', []);
          }
        } else {
          if (typeof val !== 'undefined' && this.noValueKeys.indexOf(value) === -1) {
            this.$set(this.param, 'value', val);
            this.change();
          } else {
            this.$delete(this.param, 'value');
          }
        }
        this.change();
      },
      // 值变化
      valueChange (value) {
        if (this.param.condition.indexOf('between') !== -1 && this.param.value[1]) {
          this.change();
        } else if (typeof this.param.value !== 'undefined' || (Array.isArray(this.param.value) && this.param.value.length > 0)) {
          this.change();
        }
      },
      // 初始化操作
      init () {
        if (!this.value || this.allTags.length === 0) return;
        if (_.isEqual(this.value, this.param)) return;
        // 分步设置值（由于后端值的类型不一致）
        for (let key in this.value) {
          const val = _.clone(this.value[key]);
          if (key === 'value') {
            if (~['in', 'not_in'].indexOf(this.param.condition)) {
              this.$set(this.param, 'value', this.value.value.map(val => val.toString()));
            } else {
              this.$set(this.param, 'value', _.clone(this.value.value));
            }
          } else {
            this.$set(this.param, key, val);
          }
        }
        // this.change();
      }
    },
    watch: {
      value: {
        handler: 'init',
        immediate: true
      },
      tags: {
        handler: 'init'
      }
    }
  };
</script>

<style lang="less" scoped>
  @prefix: ~'sql-form';
  .@{prefix}{
    background: #ffffff;
    padding: 5px 10px 5px 0;
    border-radius: 5px;
    display: flex;
    .@{prefix}{
      &-left{
        padding: 5px 0px 0px 5px;
        img{
          width: 18px;
          margin-right: 8px;
          margin-top: 3px;
        }
      }
    }
    &~&{
      margin-top: 10px;
    }
    & & {
      &-form{
        flex: 1;
        display: flex;
        /deep/.ivu-form-item{
          margin-bottom: 0px;
        }
        .@{prefix} {
          &-key{
            width: 150px;
          }
          &-condition{
            width: 110px;
          }
          &-value{
            margin-right: 0;
            flex: 1;
          }
        }
      }
      &-actions{
        padding: 4px 0px;
      }
    }
  }
</style>
