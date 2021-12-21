<template>
  <div class="chat-content">
    <div v-if="!headerHidden" class="chat-content-header">
      <slot />
    </div>
    <div ref="content" class="chat-content-main" @scroll="handleScroll">
      <p v-if="!loading && noMore" class="chat-content-empty">- 没有更多了 -</p>
      <div class="chat-content-loading" :style="{ top: loading ? '20px' : '-40px' }">
        <i class="el-icon-loading" />
        <span>加载中...</span>
      </div>
      <Message
        v-for="item in data"
        :key="item.msgId"
        :right="item.sendType === 1"
        :avatar="item.avatar || item.fromName"
        :time="item.msgTime"
        :revoke="Boolean(item.isRevoke)"
        :max-width="maxWidth"
      >
        <component :is="item.msgType|getComponent" :key="item.msgId" ref="messageItem" v-bind="getProps(item)" @click.native="handleClick(item)" @on-finished="handleFinished" @load="handleLoaded" @error="handleLoaded" />
      </Message>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Message from './components/message.vue'
const MESSAGE_TYPES = [
  { value: 1, label: '文本消息', component: 'MessageText' },
  { value: 2, label: '表情消息', component: 'MessageImage' },
  { value: 3, label: '语音消息', component: 'MessageAudio' },
  { value: 4, label: '视频消息', component: 'MessageVideo' },
  { value: 5, label: '文件消息', component: 'MessageFile' },
  { value: 6, label: '位置消息' },
  { value: 7, label: '图片消息', component: 'MessageImage', props: { preview: true }},
  { value: 8, label: '会话记录' },
  { value: 9, label: '小程序' },
  { value: 10, label: '链接' },
  { value: 11, label: '名片' }
]
export default {
  name: 'ChatContent',
  components: {
    Message,
    MessageText: () => import('./components/messageText.vue'),
    MessageImage: () => import('./components/messageImage.vue'),
    MessageAudio: () => import('./components/messageAudio.vue'),
    MessageVideo: () => import('./components/messageVideo.vue'),
    MessageFile: () => import('./components/messageFile.vue')
  },
  filters: {
    getComponent: (value) => {
      const type = MESSAGE_TYPES.find(val => val.value === value)
      return (type && type.component) ? type.component : 'MessageText'
    }
  },
  props: {
    headerHidden: Boolean,
    loading: Boolean,
    data: {
      type: Array,
      default: () => []
    },
    maxWidth: {
      type: Number,
      default: 75
    },
    noMore: Boolean
  },
  data() {
    return {
      playId: null,
      currentId: null,
      oldData: [],
      scrollHeight: 0,
      isEnd: false
    }
  },
  watch: {
    data: {
      handler: 'handleDataChange',
      deep: true
    }
  },
  methods: {
    handleDataChange() {
      const len = this.data.length - this.oldData.length
      if (this.oldData.length && len > 1) {
        this.isEnd = false
        this.scrollHeight = this.$refs.content.scrollHeight
        this.$nextTick(() => {
          const currentHeight = this.$refs.content.scrollHeight
          this.$refs.content.scrollTop = currentHeight - this.scrollHeight
        })
      } else {
        this.isEnd = true
        this.$nextTick(() => {
          this.$refs.content.scrollTo(0, 1000000)
        })
      }
      this.oldData = JSON.parse(JSON.stringify(this.data))
    },
    handleLoaded() {
      if (this.isEnd) {
        this.$refs.content.scrollTo(0, 1000000)
      }
      // this.$refs.content.scrollTop = this.$refs.content.scrollTop + (e.type === 'error' ? 0 : (e.target.clientHeight - 100))
    },
    getProps: ({ sendType, msgType, msg }) => {
      const type = MESSAGE_TYPES.find(val => val.value === msgType)
      return {
        ...(type && type.props) ? type.props : {},
        data: (!type || !type.component) ? '暂不支持此消息类型' : msg,
        right: sendType === 1,
        disabled: !type || !type.component
      }
    },
    handleClick(data) {
      if (data.msgType === 3) {
        if (this.playId && this.playId === data.msgId) return
        if (this.playId) {
          const index = this.data.findIndex(v => v.msgId === this.playId)
          if (index) this.$refs.messageItem[index].stop()
        }
        const index = this.data.findIndex(v => v.msgId === data.msgId)
        this.$refs.messageItem[index].play()
        this.playId = data.msgId
      }
    },
    // 完成回调（语音）
    handleFinished() {
      this.playId = null
    },
    // 滚动事件
    handleScroll() {
      if (this.noMore || this.loading) return
      _.throttle(() => {
        if (this.$refs.content.scrollTop < 50) {
          this.$emit('load-data')
          console.log(this.$refs.content.scrollHeight)
        }
      }, 100)()
    }
  }
}
</script>

<style lang="less" scoped>
  .chat-content{
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }
  .chat-content-header{
    line-height: 53px;
    padding: 0 15px ;
    font-size: 16px;
    color: #333;
  }
  .chat-content-main{
    flex: 1;
    border: 1px solid #dedede;
    overflow: auto;
    padding: 20px 0 30px;
    position: relative;
  }
  .chat-content-loading{
    text-align: center;
    color: #666;
    height: 20px;
    position: absolute;
    width: 100%;
    i{
      font-size: 16px;
      vertical-align: middle;
    }
    span{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .chat-content-empty{
    text-align: center;
    color: #999;
    height: 20px;
    margin-bottom: 20px;
  }
</style>
