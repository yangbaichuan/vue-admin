<template>
  <div :class="classes" @click="handleClick">
    <span class="message-file-name">{{ fileName }}</span>
    <svg-icon :icon-class="fileExt" class-name="message-file-ext" />
  </div>
</template>

<script>
import axios from 'axios'
const FILE_TYPES = [
  { value: 'file-word', label: 'Word文件', exts: ['doc', 'docx'] },
  { value: 'file-excel', label: 'Excel文件', exts: ['xls', 'xlsx'] },
  { value: 'file-ppt', label: 'PPT文件', exts: ['ppt', 'pptx'] },
  { value: 'file-pdf', label: 'PDF文件', exts: ['pdf'] }
]
export default {
  name: 'MessageFile',
  props: {
    data: {
      type: String,
      default: ''
    },
    right: Boolean
  },
  data() {
    return {
      fileName: '',
      fileExt: undefined
    }
  },
  computed: {
    classes() {
      return [
        'message-file',
        this.right && 'message-file-right'
      ]
    }
  },
  created() {
    const ext = this.data.substring(this.data.lastIndexOf('.') + 1, this.data.length)
    const fileType = FILE_TYPES.find(v => v.exts.includes(ext))
    if (fileType) {
      this.fileExt = fileType.value
    } else {
      this.fileExt = 'file-unkonw'
    }
    this.fileName = decodeURIComponent(this.data.substring(this.data.lastIndexOf('/') + 1, this.data.length))
  },
  methods: {
    handleClick() {
      axios({
        method: 'get',
        url: this.data,
        responseType: 'blob',
        headers: { 'Access-Control-Allow-Origin': '*' }
      }).then((res) => {
        const blobUrl = window.URL.createObjectURL(res.data)
        const link = document.createElement('a')
        document.body.appendChild(link)
        link.style.display = 'none'
        link.href = blobUrl
        link.download = this.fileName
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .message-file{
    display: flex;
    width: 100%;
    padding: 12px;
    align-items: center;
    cursor: pointer;
    position: relative;
    background: #fff;
    border-radius: 8px;
    &::before{
      position: absolute;
      top: 23px;
      margin-top: -8px;
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 4px;
      border-right-width: 7px;
      border-style: solid;
      left: -11px;
      border-color: transparent;
      border-right-color: #fff;
    }
    &-right{
      &::before{
        left: auto;
        right: -11px;
        border-right-color: transparent;
        border-left-color: #fff;
      }
    }
  }
  .message-file-ext{
    margin-left: 8px;
    width: 40px;
    height: 40px;
  }
</style>
