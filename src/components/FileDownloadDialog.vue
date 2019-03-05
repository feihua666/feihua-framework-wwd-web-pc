<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">

    <a :href="downloadUrl" target="_blank">请点击这里下载</a>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'FileDownloadDialog',
    props: {
      // 弹窗标题
      title: {
        default: '文件下载'
      }
    },
    data () {
      return {
        dialogVisible: false,
        path: ''
      }
    },
    computed: {
      downloadUrl () {
        if (this.path) {
          return this.$config.file.getDownloadUrl(this.path)
        }
        return '#'
      }
    },
    mounted () {
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      setPath (path) {
        this.path = path
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
