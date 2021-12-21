<template>
  <div class="chat-editor">
    <div class="chart-editor-tools">
      <Upload :disabled="disabled" @on-upload="handleUpload" />
    </div>
    <el-input v-model="param.content" class="chart-editor-input" type="textarea" placeholder="请输入内容" resize="none" :disabled="disabled" />
    <div class="chart-editor-footer">
      <el-button class="chart-editor-enter" type="primary" size="mini" :disabled="disabled" @click="handleSend">发送消息</el-button>
    </div>
  </div>
</template>

<script>
import Upload from './components/upload.vue'
export default {
  name: 'ChatEditor',
  components: {
    Upload
  },
  props: {
    disabled: Boolean
  },
  data() {
    return {
      param: {
        msgType: '1',
        content: ''
      }
    }
  },
  methods: {
    // 文件类型
    handleUpload(data) {
      this.param.content = data.path
      if (data.type.includes('image')) {
        this.param.msgType = '7'
      } else {
        this.param.msgType = '5'
        this.param.filename = data.name
      }
      this.$emit('on-send', this.param)
    },
    // 文本类型
    handleSend() {
      if (!this.param.content) return
      const { msgType, content } = this.param
      this.$emit('on-send', { msgType, content })
    },
    // 重置数据
    resetParam() {
      this.$set(this, 'param', {
        msgType: '1',
        content: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .chat-editor{
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #dedede;
    border-top: none;
    /deep/.el-textarea__inner{
      background: transparent;
      border: none;
      height: 100%;
      overflow: auto;
      padding: 0 15px;
    }
  }
  .chart-editor-tools{
    padding: 5px 15px;
    i{
      font-size: 16px;
      color: #333;
    }
  }
  .chart-editor-input{
    flex: 1;
  }
  .chart-editor-footer{
    height: 35px;
    .chart-editor-enter{
      float: right;
      margin-right: 15px;
    }
  }
</style>
