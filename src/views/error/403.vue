<template>
  <ErrorContent code="401" desc="非常抱歉，您没有浏览这个页面的权限哦~" :src="src"/>
</template>

<script>
  import error401 from '@/assets/images/403.svg';
  import ErrorContent from './ErrorContent.vue';
  export default {
    name: 'error_403',
    components: {
      ErrorContent
    },
    data () {
      return {
        src: error401
      };
    }
  };
</script>
