<template>
  <div class="chat-contacts">
    <div class="chat-contacts-search">
      <el-input v-model="param" placeholder="搜索" size="small" prefix-icon="el-icon-search" @input="handleSearch" />
    </div>
    <ul v-infinite-scroll="handleLoadData" infinite-scroll-disabled="noMore" class="chat-contacts-list">
      <li v-for="(item, index) in data" :key="index" :class="[selected.qscId === item.qscId && 'active']" @click="handleSelectUser(item)">
        <el-avatar shape="square" :src="item.avatar">{{ item.nickname && item.nickname.substr(0, 1) }}</el-avatar>
        <div class="chat-contacts-info">
          <p class="chat-contacts-top">
            <el-badge :value="item.unread_count" :hidden="selected.qscId === item.qscId || !item.unread_count" :max="999">
              <span>{{ item.nickname }}</span>
            </el-badge>
            <!-- <span>{{ item.time }}</span> -->
          </p>
          <p class="chat-contacts-bottom">{{ item.preview }}</p>
        </div>
      </li>
      <li v-if="loading" class="chat-contacts-tip">
        <i class="el-icon-loading" />
        <span>加载中...</span>
      </li>
      <li v-if="noMore && !loading" class="chat-contacts-tip">- 没有更多了 -</li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'ChatContacts',
  props: {
    value: {
      type: Object,
      default: undefined
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: Boolean,
    noMore: Boolean
  },
  data() {
    return {
      param: '',
      selected: {},
      loadFlag: true
    }
  },
  watch: {
    value: {
      handler: 'handleResetSelected',
      immediate: true
    },
    data: {
      handler: 'handleDataChange'
    }
  },
  methods: {
    handleResetSelected(data) {
      if (!data || _.isEqual(data, this.selected)) return
      this.$set(this, 'selected', { ...data })
    },
    // 选项数据变化
    handleDataChange(data) {
      this.loadFlag = !data.length
    },
    // 加载数据
    handleLoadData() {
      if (this.loadFlag) return
      this.$emit('load-data', this.param)
      this.loadFlag = false
    },
    // 搜索
    handleSearch(data) {
      _.debounce(() => {
        this.handleLoadData()
      }, 500)()
    },
    // 选择用户
    handleSelectUser(data) {
      if (data.qscId === this.selected.qscId) return
      this.selected = data
      this.$emit('input', { ...data })
      this.$emit('on-change', { ...data })
    }
  }
}
</script>

<style lang="less" scoped>
  .chat-contacts {
    height: 100%;
    overflow: auto;
    background: #fff;
  }
  .chat-contacts-search {
    padding: 10px 15px;
    border-bottom: 1px solid #e4e4e4;
    height: 53px;
  }
  .chat-contacts-list {
    overflow: auto;
    height: calc(100% - 53px);
    li {
      padding: 15px 10px;
      overflow: hidden;
      cursor: pointer;
      &.active {
        background: linear-gradient(90deg, #237bf7, #50a9f7);
        color: #fff;
      }
      &:not(.active, .chat-contacts-tip):hover {
        background: #f1f1f1;
      }
      .el-avatar {
        float: left;
        background: #31b6f5;
      }
      .chat-contacts-info {
        float: left;
        width: calc(100% - 40px);
        padding-left: 10px;
      }
      &.chat-contacts-tip {
        text-align: center;
        color: #999;
        height: 30px;
        line-height: 30px;
        padding: 0;
      }
    }
  }
  .chat-contacts-top {
    line-height: 18px;
    .el-badge{
      width: calc(~'100% - 25px');
      /deep/.el-badge__content{
        transform: translateY(-50%);
        right: -15px;
      }
    }
  }
  .chat-contacts-bottom {
    margin-top: 5px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
