<template>
  <el-image class="message-image" v-bind="props" v-on="$listeners">
    <div slot="error">
      <p class="message-image-fail">图片加载失败...</p>
    </div>
  </el-image>
</template>

<script>
export default {
  name: 'MessageImage',
  props: {
    data: {
      type: String,
      default: ''
    },
    preview: Boolean
  },
  computed: {
    props() {
      return {
        src: this.data,
        previewSrcList: this.preview ? [this.data] : []
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .message-image{
    border-radius: 8px;
    max-width: 200px;
    min-height: 40px;
    .message-image-fail{
      background: #e5e5e5;
      line-height: 100px;
      padding: 0 15px;
      color: #9f9f9f;
    }
  }
</style>
