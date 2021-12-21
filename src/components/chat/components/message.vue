<template>
  <div class="message-box" :class="[right && 'message-box-right']">
    <div class="message-box-body">
      <el-avatar v-if="avatar.includes('http')" shape="square" :src="avatar" />
      <el-avatar v-else shape="square">{{ avatar }}</el-avatar>
      <div class="message-box-content" :style="{ maxWidth: maxWidth + '%' }">
        <slot />
      </div>
    </div>
    <div class="message-box-extra">
      <span>{{ time }}</span>
      <span v-if="revoke" class="message-revoke">已撤回</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    right: Boolean,
    maxWidth: {
      type: Number,
      default: 75
    },
    avatar: {
      type: String,
      default: '未知'
    },
    time: {
      type: String,
      default: ''
    },
    revoke: Boolean
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
  .message-box{
    width: 100%;
    overflow: hidden;
    .el-avatar{
      margin: 0 15px;
      font-size: 12px;
      background: #f6bb44;
    }
    & + &{
      margin-top: 20px;
    }
  }
  .message-box-body{
    display: flex;
    position: relative;
  }
  .message-box-content{
    position: relative;
    font-size: 13px;
    line-height: 17px;
    color: #000;
    word-wrap: break-word;
    word-break: break-all;
  }
  .message-box-extra{
    margin-top: 5px;
    width: 100%;
    padding-left: 70px;
    padding-right: 0;
    color: #999;
    span{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .message-revoke{
    color: #F56C6C;
    border: 1px solid #ffb6b6;
    border-radius: 3px;
    padding: 0 5px;
  }
  .message-box-right{
    .el-avatar{
      background: #3e91f8;
    }
    .message-box-body{
      flex-direction: row-reverse;
    }
    .message-box-extra{
      text-align: right;
      padding-left: 0;
      padding-right: 70px;
    }
  }
</style>
