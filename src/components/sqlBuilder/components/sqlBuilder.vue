<template>
  <div :class="[prefixCls]">
    <transition name="fade" mode="out-in">
      <div v-show="tags.length === 0" :class="[prefixCls + '-empty']">
        <p>暂无标签数据！</p>
      </div>
    </transition>
    <sql-group v-model="param" :tags="tags" :draggable="draggable" :insertTable="insertTable" @on-change="change" :readonly="readonly"></sql-group>
    <div v-if="preview" :class="[prefixCls + '-preview']">
      <p>{{sql}}</p>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { transToParam, transToSql, getUuid } from '../libs/utils';
  import sqlGroup from './components/sqlGroup.vue';
  const prefixCls = 'sql-builder';
  export default {
    name: 'sql-builder',
    components: {
      sqlGroup
    },
    props: {
      // 绑定值
      value: {
        type: String
      },
      // 标签
      tags: {
        type: Array,
        default () {
          return [];
        }
      },
      // 是否可拖拽
      draggable: {
        type: Boolean,
        default: false
      },
      // 是否插入表名
      insertTable: {
        type: Boolean,
        default: false
      },
      // 显示sql预览
      preview: {
        type: Boolean,
        default: false
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 关闭的条件
      offCondition: {
        type: Array,
        default () {
          return [];
        }
      },
      // 深度
      deep: {
        type: Number
      }
    },
    data () {
      return {
        prefixCls,
        param: {},
        sql: ''
      };
    },
    methods: {
      // 当值变化的时候转换sql并传递给上一层
      change () {
        // 比较sql的值是否一致，若sql不一致则发生变化，否则未发生变化
        this.sql = transToSql(_.cloneDeep(this.param), this.insertTable);
        if (this.sql === this.value) return;
        this.$emit('input', _.cloneDeep(this.sql));
        this.$emit('on-change', this.param);
      },
      // 设置param
      setParam () {
        if (this.tags.length > 0 && this.value) this.param = transToParam(this.value, this.tags);
        else this.param = { type: 2, relation: 'AND', value: [{ type: 1 }] };
      }
    },
    watch: {
      // 检测外部的值，变化的时候拼装组件内部数据
      value: {
        handler: function (val) {
          if (this.sql === val) return;
          if (!val) {
            this.param = {
              type: 2,
              relation: 'AND',
              _id: getUuid(),
              value: [{ _id: getUuid(), type: 1 }]
            };
          } else {
            this.sql = _.clone(val);
            this.setParam();
          }
        },
        immediate: true
      },
      // 检测插入表名
      insertTable () {
        this.change();
      },
      // 标签
      tags (val) {
        if (val && val.length > 0) this.setParam();
      }
    }
  };
</script>

<style lang="less" scoped>
  @prefix: ~"sql-builder";
  .@{prefix} {
    width: 100%;
    position: relative;
    & &{
      &-empty{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(130, 130, 130, 0.8);
        z-index: 10;
        text-align: center;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
      }
      &-preview{
        width: 100%;
        background: #555555;
        color: #ffffff;
        line-height: 30px;
        padding: 0 15px;
        margin-top: 10px;
        border-radius: 3px;
      }
    }
  }
</style>
