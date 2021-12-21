<template>
  <p :class="classes" v-html="content" />
</template>

<script>
import { replaceLink } from '../utils/util'
export default {
  name: 'MessageText',
  props: {
    data: {
      type: String,
      default: ''
    },
    right: Boolean,
    disabled: Boolean
  },
  computed: {
    classes() {
      return [
        'message-text',
        this.right && 'message-text-right',
        this.disabled && 'message-text-disabled'
      ]
    },
    content() {
      return replaceLink(this.data)
    }
  }
}
</script>

<style lang="less">
  .message-text{
    padding: 12px;
    min-height: 40px;
    white-space: pre-line;
    position: relative;
    border-radius: 8px;
    background: #fff;
    line-height: 16px;
    &::before{
      position: absolute;
      top: 23px;
      margin-top: -8px;
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 4px;
      border-right-width: 7px;
      border-style: solid;
      left: -11px;
      border-color: transparent;
      border-right-color: #fff;
    }
    &-right{
      background: #c6e5ff;
      &::before{
        left: auto;
        right: -11px;
        border-right-color: transparent;
        border-left-color: #c6e5ff;
      }
    }
    &-disabled{
      color: #999;
    }
    a {
      color: #409eff;
    }
  }
</style>
