export default {
  props: {
    // 绑定值
    value: {
      type: Object
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
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    }
  }
};
