<template>
  <li class="drag-item">
    <Icon type="md-reorder" class="drag-handle" />
    <div class="drag-content">
      <slot></slot>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'DragItem',
    data () {
      return {

      };
    }
  };
</script>

<style lang="less" scoped>
  .drag-item{
    display: flex;
    width: 100%;
    min-height: 32px;
    border-bottom: 1px dashed #dedede;
    &:last-child{
      border: none;
    }
    &:first-child{
      padding-top: 0;
    }
  }
  .drag-handle{
    font-size: 24px;
    cursor: move;
    margin-right: 10px;
    line-height: 32px;
  }
  .drag-content{
    flex: 1;
  }
</style>
