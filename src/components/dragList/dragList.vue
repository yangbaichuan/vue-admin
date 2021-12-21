<template>
  <Draggable tag="ul" :list="param" class="drag-list" handle=".drag-list-handle">
    <li class="drag-list-item" v-for="(item, index) in param" :key="index">
      <Icon type="md-reorder" class="drag-list-handle" />
      <div class="drag-list-content">
        <slot :data="item" :index="index" :parent="param"></slot>
      </div>
    </li>
  </Draggable>
</template>

<script>
  import { cloneDeep, isEqual } from 'lodash-es';
  import Draggable from 'vuedraggable';
  export default {
    name: 'DragList',
    components: { Draggable },
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        param: []
      };
    },
    watch: {
      value: {
        handler: 'handleResetParam',
        immediate: true,
        deep: true
      },
      param: {
        handler: 'handleChange',
        deep: true
      }
    },
    methods: {
      handleResetParam (value) {
        if (value && !isEqual(value, this.param)) {
          this.$set(this, 'param', cloneDeep(value));
        }
      },
      handleChange () {
        debugger;
        this.$emit('input', cloneDeep(this.param));
      }
    }
  };
</script>

<style lang="less" scoped>
  .drag-list{
    .drag-list-item{
      display: flex;
      width: 100%;
      min-height: 32px;
      border-bottom: 1px dashed #dedede;
      padding: 10px 0;
      &:last-child{
        border: none;
      }
      &:first-child{
        padding-top: 0;
      }
    }
    .drag-list-handle{
      font-size: 24px;
      cursor: move;
      margin-right: 10px;
      line-height: 32px;
    }
    .drag-list-content{
      flex: 1;
    }
  }
</style>
