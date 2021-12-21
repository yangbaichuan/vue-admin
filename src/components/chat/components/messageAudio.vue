<template>
  <div :class="classes">
    <div class="message-voice-icon">
      <div class="message-voice-item message-voice-first" />
      <div class="message-voice-item message-voice-second" />
      <div class="message-voice-item message-voice-third" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageAudio',
  props: {
    data: {
      type: String,
      default: ''
    },
    right: Boolean
  },
  data() {
    return {
      playing: false,
      player: null
    }
  },
  computed: {
    classes() {
      return [
        'message-voice',
        this.right && 'message-voice-right',
        this.playing && 'message-voice-playing'
      ]
    }
  },
  created() {
    this.player = new Audio()
    this.player.src = this.data
    this.player.addEventListener('ended', this.stop, false)
  },
  beforeDestroy() {
    this.player.removeEventListener('ended', this.stop)
  },
  methods: {
    play() {
      if (this.playing) return
      this.playing = true
      this.player.load()
      this.player.play()
    },
    stop() {
      if (!this.playing) return
      this.playing = false
      this.player.pause()
      this.$emit('on-finished')
    }
  }
}
</script>

<style lang="less" scoped>
  .message-voice {
    width: 120px;
    box-sizing: border-box;
    position: relative;
    padding: 7px 12px;
    border-radius: 8px;
    cursor: pointer;
    background: #fff;
    &::before{
      position: absolute;
      top: 50%;
      margin-top: -8px;
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 8px;
      border-style: solid;
      left: -16px;
      border-color: transparent;
      border-right-color: #fff;
    }
    &-right{
      text-align: right;
      background: #c6e5ff;
      &::before{
        left: auto;
        right: -16px;
        border-right-color: transparent;
        border-left-color: #c6e5ff;
      }
      .message-voice-icon{
        transform: rotate(310deg);
      }
    }
    &-playing{
      .message-voice-second{
        animation: fadeInOut 1s infinite 0.2s;
      }
      .message-voice-third{
        animation: fadeInOut 1s infinite 0.4s;
      }
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .message-voice-icon {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    overflow: hidden;
    display: inline-block;
    transform: rotate(135deg);
  }

  .message-voice-item {
    border: 2px solid #999999;
    border-radius: 50%;
    position: absolute;
  }

  .message-voice-first {
    width: 5px;
    height: 5px;
    background: #cccccc;
    top: 15px;
    left: 15px;
  }

  .message-voice-second {
    width: 20px;
    height: 20px;
    top: 8px;
    left: 8px;
  }

  .message-voice-third {
    width: 30px;
    height: 30px;
    top: 2px;
    left: 2px;
  }
</style>
