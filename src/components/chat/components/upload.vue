<template>
  <el-upload
    ref="upload"
    action="#"
    :disabled="disabled"
    :show-file-list="false"
    :before-upload="handleBeforeUplaod"
    :http-request="handleUpload"
  >
    <i class="el-icon-folder-opened" />
  </el-upload>
</template>

<script>
import { chatUpload } from '@/api/upload'
const MAX_SIZE = 20 * 1024 * 1024
export default {
  name: 'Upload',
  props: {
    disabled: Boolean
  },
  data() {
    return {

    }
  },
  methods: {
    handleBeforeUplaod(file) {
      if (file.size > MAX_SIZE) {
        this.$message.error('最大支持20M的文件')
        return false
      }
    },
    handleUpload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      chatUpload(formData).then(({ data: { data }}) => {
        this.$emit('on-upload', {
          name: file.name,
          type: file.type,
          path: data.ossUrl
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-icon-folder-opened{
    font-size: 16px;
    color: #333;
  }
</style>
