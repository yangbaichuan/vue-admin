<template>
  <div class="error-page">
    <div class="content-con">
      <img :src="src" :alt="code">
      <div class="text-con">
        <p>
          <span>{{ desc }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'error_content',
    props: {
      code: String,
      desc: String,
      src: String
    }
  };
</script>
<style lang="less">
  .error-page{
    width: 100%;
    height: calc(100vh - 246px);
    position: relative;
    .content-con{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img{
        display: block;
        margin: 0 auto;
      }
      .text-con{
        text-align: center;
        p{
          font-size: 18px;
        }
      }
    }
  }
</style>
