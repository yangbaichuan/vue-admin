<template>
  <Draggable tag="ul" :list="param" class="drag" handle=".drag-handle" v-on="$listeners">
    <transition-group>
      <slot></slot>
    </transition-group>
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
        this.$emit('input', cloneDeep(this.param));
      }
    }
  };
</script>

<style lang="less" scoped>
  .drag{

  }
</style>
