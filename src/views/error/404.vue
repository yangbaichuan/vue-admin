<template>
  <ErrorContent code="404" desc="非常抱歉，您的页面好像飞走了~" :src="src"/>
</template>

<script>
  import error404 from '@/assets/images/404.svg';
  import ErrorContent from './ErrorContent.vue';
  export default {
    name: 'error_404',
    components: {
      ErrorContent
    },
    data () {
      return {
        src: error404
      };
    }
  };
</script>
