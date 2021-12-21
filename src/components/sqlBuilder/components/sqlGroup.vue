<template>
  <div :class="[prefixCls]">
    <div :class="[prefixCls + '-header']">
      <Checkbox v-model="param.not" @on-change="change">非</Checkbox>
      <RadioGroup v-model="param.relation" type="button" size="small" @on-change="change">
        <Radio label="AND">且</Radio>
        <Radio label="OR">或</Radio>
      </RadioGroup>
      <div :class="[prefixCls + '-actions']" v-if="!readonly">
        <Button type="primary" size="small" ghost @click="add(1)">添加标签</Button>
        <Button type="primary" size="small" ghost @click="add(2)">添加组</Button>
        <slot></slot>
      </div>
    </div>
    <div :class="[prefixCls + '-footer']">
      <template v-if="draggable">
        <draggable tag="div" class="item-container" :group="{name: 'group'}" v-model="param.value" @end="change">
          <div :class="[prefixCls + '-item']" v-for="(item, index) in param.value" :key="item._id">
            <component :is="item.type|fixComponent" v-model="param.value[index]" :tags="tags" draggable @on-change="change">
              <Button v-if="!readonly && param.value.length > 1" type="error" size="small" ghost @click="remove(index)">删除</Button>
            </component>
          </div>
        </draggable>
      </template>
      <template v-else>
        <div :class="[prefixCls + '-item']" v-for="(item, index) in param.value" :key="item._id">
          <component :is="item.type|fixComponent" v-model="param.value[index]" :tags="tags" @on-change="change">
            <Button v-if="!readonly && param.value.length > 1" type="error" size="small" ghost @click="remove(index)">删除</Button>
          </component>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import draggable from 'vuedraggable';
  import sqlForm from './sqlForm.vue';
  import Mixin from '../libs/mixin';
  import { getUuid } from '../libs/utils';
  const prefixCls = 'sql-group';
  export default {
    name: 'sql-group',
    filters: {
      fixComponent (val) {
        if (val === 1) {
          return 'sql-form';
        } else if (val === 2) {
          return 'sql-group';
        }
      }
    },
    components: {
      sqlForm,
      draggable
    },
    mixins: [Mixin],
    data () {
      return {
        prefixCls,
        param: {
          type: 2,
          relation: 'AND',
          value: [{ type: 1 }]
        }
      };
    },
    methods: {
      // 添加
      add (type) {
        if (type === 1) {
          this.param.value.push({ _id: getUuid(), type: parseInt(type) });
        } else {
          this.param.value.push({
            type: 2,
            relation: 'AND',
            _id: getUuid(),
            value: [{ _id: getUuid(), type: 1 }]
          });
        }
      },
      // 删除
      remove (index) {
        this.param.value.splice(index, 1);
        this.change();
      },
      // 当值变化的时候传递给上一层
      change () {
        if (this.param.value && this.param.value.length > 0) {
          this.param.value.forEach((val, i) => {
            if (val.type === 2 && (!val.value || val.value.length === 0)) {
              this.param.value.splice(i, 1);
            }
          });
        }
        this.$emit('input', _.cloneDeep(this.param));
        this.$emit('on-change', _.cloneDeep(this.param));
      },
      // 拖拽的值变化时
      emit (value) {
        this.$set(this.param, 'value', value);
        this.change();
      }
    },
    watch: {
      // 检测外部的值，变化的时候拼装组件内部数据
      value: {
        handler: function (val) {
          if (!val) return;
          this.param = val;
        },
        immediate: true
      }
    }
  };
</script>

<style lang="less" scoped>
  @prefix: ~"sql-group";
  .@{prefix} {
    width: 100%;
    padding: 10px 15px 10px 0;
    border-radius: 5px;
    border: 1px solid #dcc896;
    background: rgba(250, 240, 210, 0.5);
    .@{prefix}{
      margin-top: 10px;
    }
    & & {
      &-header {
        padding-bottom: 10px;
        padding-left: 5px;

        .@{prefix} {
          &-actions {
            float: right;
            .ivu-btn{
              margin-left: 8px;
            }
            .ivu-dropdown {
              margin-right: 10px;
              position: relative;
            }
          }
        }
        &:after {
          content: '';
          display: block;
          clear: both;
        }
      }
      &-footer {
        padding-left: 20px;
        .@{prefix}{
          &-item{
            margin-bottom: 10px;
            .iconfont{
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
</style>
