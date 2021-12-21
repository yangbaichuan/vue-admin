<template>
  <div class="full-scrreen" @click="toggleFullScreen()">
    <template v-if="tooltip">
      <Tooltip :content="status ? '退出全屏' : '进入全屏'">
        <VIcon :type="status ? '_exit-full-screen' : '_full-screen'" :size="18"/>
      </Tooltip>
    </template>
    <VIcon v-else :type="status ? '_exit-full-screen' : '_full-screen'" :size="18" />
  </div>
</template>

<script>
  export default {
    name: 'FullScreen',
    props: {
      // 元素
      el: {
        type: undefined,
        default: () => document.body
      },
      // 是否显示tooltip
      tooltip: {
        type: [Boolean],
        default: false
      }
    },
    components: {
      VIcon: () => import('../vIcon')
    },
    data () {
      return {
        // 浏览器前缀
        prefixName: '',
        // 是否支持
        support: true,
        // 当前状态
        status: false
      };
    },
    computed: {
      enterKey () {
        return !this.prefixName ? 'requestFullscreen' : `${this.prefixName}RequestFullScreen`;
      },
      exitKey () {
        return !this.prefixName ? 'exitFullscreen' : `${this.prefixName}ExitFullscreen`;
      }
    },
    methods: {
      // 检查支持情况
      inspect () {
        let fullscreenEnabled;
        // 判断浏览器前缀
        if (document.fullscreenEnabled) {
          fullscreenEnabled = document.fullscreenEnabled;
        } else if (document.webkitFullscreenEnabled) {
          fullscreenEnabled = document.webkitFullscreenEnabled;
          this.prefixName = 'webkit';
        } else if (document.mozFullScreenEnabled) {
          fullscreenEnabled = document.mozFullScreenEnabled;
          this.prefixName = 'moz';
        } else if (document.msFullscreenEnabled) {
          fullscreenEnabled = document.msFullscreenEnabled;
          this.prefixName = 'ms';
        }
        if (!fullscreenEnabled) {
          this.support = false;
        }
      },
      // 切换全屏状态
      toggleFullScreen () {
        // this.status = this.getScreenStatus();
        if (!this.support) {
          this.$Message.error('暂不支持全屏操作！');
          return;
        }
        // this.status = !this.status;
        if (!this.status) {
          (this.el.$el || this.el)[this.enterKey]();
        } else {
          document[this.exitKey]();
        }
      }
    },
    created () {
      this.inspect();
    },
    mounted () {
      document.addEventListener('fullscreenchange', (event) => {
        if (event.srcElement === (this.el.$el || this.el)) {
          this.status = !this.status;
        }
      });
    }
  };
</script>

<style lang="less" scoped>
  .full-scrreen{
    display: inline-block;
    cursor: pointer;
  }
</style>
