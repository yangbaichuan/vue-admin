<template>
  <div class="chat">
    <ChatContent class="chat-content" :data="datas" :loading="loading" :no-more="isEnd" @load-data="handleQueryRecords">
      <slot name="header" />
    </ChatContent>
    <div class="chat-footer">
      <ChatEditor ref="chatEditor" :disabled="readonly || disabled" @on-send="handleSend" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import ChatContent from './chatContent.vue'
import ChatEditor from './chatEditor.vue'
import { v4 as uuidv4 } from 'uuid'
import { queryWechatList, socketUrl } from '@/api/wechat'
export default {
  name: 'Chat',
  components: { ChatContent, ChatEditor },
  props: {
    // 是否禁止发送消息
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 用户信息
     * @param friendWxid 用户聊天微信id
     * @param qscId       轻松筹ID
     * @param nickname    昵称
     * @param avatar      头像
     */
    userData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 机器人信息
     * @param robotId   机器人id
     * @param nickname  昵称
     * @param avatar    头像
     */
    robotData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      readonly: false, // 禁止编辑
      socket: null, // 实例
      timer: null, // 心跳计时器
      reconnectLocked: false, // socket重连锁
      reconnectTimer: null, // 重试计时器
      reconnectNumber: 5, // 重试次数
      commonData: {},
      socketParam: {
        action: '1',
        data: {}
      },
      // 聊天记录相关参数
      loading: false,
      isEnd: false,
      param: {
        page: 1,
        limit: 20
      },
      datas: []
    }
  },
  watch: {
    userData: {
      handler: 'init',
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.socket) this.socket.close()
    if (this.timer) clearTimeout(this.timer)
  },
  methods: {
    init() {
      this.$set(this, 'commonData', {
        robot_wxid: this.robotData.robotId,
        user_wxid: this.userData.friend_wxid,
        staff_id: this.$store.state.user.staffId
      })
      this.datas = []
      this.param.page = 1
      if (!this.userData.friend_wxid) return
      this.handleQueryRecords()
      this.initSocket()
    },
    // 查询聊天记录
    handleQueryRecords() {
      this.loading = true
      queryWechatList({
        ...this.param,
        robotId: this.robotData.robotId,
        qscId: this.userData.qscId,
        startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }).then(({ data: { data }}) => {
        if (this.param.page === 1) {
          this.datas = data.list || []
        } else {
          this.$set(this, 'datas', (data.list || []).concat(this.datas))
        }
        this.loading = false
        this.isEnd = data.total <= this.datas.length
        this.param.page++
      }).catch(() => {
        this.loading = false
        this.isEnd = true
      })
    },
    // 初始化socket
    initSocket() {
      if (typeof (WebSocket) === 'undefined') {
        this.$message.error('您的浏览器不支持WebSocket')
        return
      }
      // 如果存在，销毁历史实例
      if (this.socket) {
        this.socket.close()
      }
      // 实例化socket
      this.socket = new WebSocket(socketUrl)
      // 监听socket连接
      this.socket.onopen = () => {
        this.reconnectNumber = 5
        this.$set(this.socketParam, 'action', '1')
        this.sendData()
        this.startHeartbeat()
      }
      // 监听socket错误信息
      this.socket.onerror = () => {
        this.reconnectLocked = false
        this.reconnect()
      }
      // 监听socket消息
      this.socket.onmessage = this.onMessage
    },
    // 重新连接
    reconnect() {
      if (this.reconnectLocked || !this.reconnectNumber) return
      this.reconnectLocked = true
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
      this.reconnectTimer = setTimeout(() => {
        this.initSocket()
        this.reconnectNumber--
        this.reconnectLocked = false
      }, 5000)
    },
    // 发送数据
    sendData(data) {
      if (this.socket.readyState === 1) {
        // 记录时间和标识
        this.$set(this.socketParam, 'request_id', uuidv4())
        this.$set(this.socketParam, 'time', new Date().getTime())
        const { msgType, content, filename } = this.socketParam.data
        this.socket.send(JSON.stringify({
          action: this.socketParam.action,
          request_id: this.socketParam.request_id,
          time: this.socketParam.time,
          data: data || { msg_type: msgType, content, filename, ...this.commonData }
        }))
      } else {
        this.socket.close()
        this.initSocket()
      }
    },
    // 开启心跳
    startHeartbeat() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.socket.readyState === 1) {
          this.$set(this.socketParam, 'action', '1')
          this.sendData(this.commonData)
          this.startHeartbeat()
        } else {
          this.reconnect()
        }
      }, 5000)
    },
    handleSend(data) {
      this.readonly = true
      this.$set(this.socketParam, 'action', '2')
      this.$set(this.socketParam, 'data', data)
      this.sendData()
    },
    // 获取到消息
    onMessage({ data }) {
      // 返回结构异常
      if (!data || !data.includes('{')) {
        this.errorHandler(data)
        return
      }
      const result = JSON.parse(data)
      // 返回数据错误
      if (result.code !== 0) {
        this.errorHandler(result.msg)
        return
      }
      if (!result.event) { // 请求结果
        this.responseHandler(result.data)
      } else { // 服务端主动推送
        this.serverPushHandler(result)
      }
    },
    // 成功回调
    responseHandler(data) {
      if (data.msg_id) {
        // 发送消息回执
        const res = {
          msgId: data.msg_id,
          msg: this.socketParam.data.content,
          avatar: this.robotData.avatar,
          isRevoke: 0,
          msgTime: dayjs(this.socketParam.time).format('YYYY-MM-DD HH:mm:ss'),
          msgType: Number(this.socketParam.data.msgType),
          sendType: 1,
          fromName: this.robotData.nickname
        }
        this.datas.push(res)
        this.$emit('on-send', res)
        // 重置编辑起数据
        this.$set(this.socketParam, 'data', {})
        this.$refs.chatEditor.resetParam()
        // 恢复编辑权限
        this.readonly = false
      } else {
        // 心跳检测
        this.readonly = Boolean(data.state === 2)
      }
    },
    // 服务器推送回调
    serverPushHandler({ event, time, data }) {
      if (Number(event) === 1) {
        // 回复消息
        this.datas.push({
          msgId: uuidv4(),
          msg: data.content,
          avatar: this.userData.avatar,
          isRevoke: 0,
          msgTime: dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          msgType: Number(data.msg_type),
          sendType: 2,
          fromName: this.userData.nickname
        })
      } else if (Number(event) === 4) {
        this.$emit('on-message', data)
      }
    },
    // 异常回调
    errorHandler(message) {
      this.$message.error(message || '未知错误')
    }
  }
}
</script>

<style lang="less" scoped>
  .chat{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f3f3f3;
  }
  .chat-content{
    flex: 1;
    overflow: auto;
  }
  .chat-footer{
    height: 150px;
  }
</style>
