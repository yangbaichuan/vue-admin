<template>
  <div class="home">
    <div class="home-left">
      <div class="home-box">
        <h3 class="home-title">欢迎{{userName}}~</h3>
        <div class="home-desc" v-html="setting.description || '暂无系统介绍信息'"></div>
        <!-- <p class="home-system">{{$config.name}}</p> -->
      </div>
    </div>
    <div class="home-right">
      <img src="@/assets/images/home.svg" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    computed: {
      // 配置
      setting () {
        return this.$store.state.app.setting;
      },
      // 用户名
      userName () {
        return this.$store.state.account.userName;
      }
    }
  };
</script>

<style lang="less">
  .home{
    width: 100%;
    height: 100%;
    min-height: 468px;
    display: flex;
    background: #ffffff;
    & &{
      &-left{
        width: 420px;
        padding: 0 28px;
        position: relative;
        .home-title{
          font-size: 28px;
          color: #111111;
        }
        .home-desc{
          white-space: pre-wrap;
          font-size: 16px;
          color: #767676;
          margin-top: 32px;
          line-height: 25px;
        }
      }
      &-box{
        width: calc(~'100% - 56px');
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &-right{
        flex: 1;
        position: relative;
        img{
          max-width: 100%;
          max-height: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0
        }
      }
    }
  }
</style>
