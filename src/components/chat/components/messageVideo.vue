<template>
  <video :src="data" controls="controls">您的浏览器不支持 video 标签。</video>
</template>

<script>
export default {
  name: 'MessageVideo',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playing: false,
      player: null
    }
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
