<template>
  <el-dialog
    :title="options.title"
    :visible.sync="dialogVisible"
    width="30%">
    <file-upload
      ref="upload"
      :data="options.data"
      :accept="options.accept"
      :limit="options.limit"
      :upload-btn-show="false"
      :show-file-list="true"
      :auto-upload="false"
      list-type="picture-card"
      :on-success="options.onSuccess">

    </file-upload>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import FileUpload from '@/components/FileUpload'
  export default {
    name: 'FileUploadDialog',
    components: {FileUpload},
    props: {
      // 上传时附带的额外参数,可以传path和fileType两个参数，其中fileType参看字典项
      data: null,
      // 接受上传的文件类型
      accept: null,
      // 最大允许上传个数
      limit: {
        default: 1
      },
      // 上传成功回调
      onSuccess: null,
      // 弹窗标题
      title: {
        default: '文件上传'
      }
    },
    data () {
      return {
        dialogVisible: false,
        disabled: false,
        loading: false,
        fileSelectSize: 0,
        options: {
          data: null,
          accept: null,
          limit: 1,
          onSuccess: null,
          title: '文件上传'
        }
      }
    },
    mounted () {
      this.propToOptions()
    },
    computed: {
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      showWithOptions (options) {
        if (options) {
          if (options.data) {
            this.options.data = options.data
          }
          if (options.accept) {
            this.options.accept = options.accept
          }
          if (options.limit) {
            this.options.limit = options.limit
          }
          if (options.onSuccess) {
            this.options.onSuccess = options.onSuccess
          }
          if (options.title) {
            this.options.title = options.title
          }
        }
        this.show()
      },
      propToOptions () {
        if (this.data) {
          this.options.data = this.data
        }
        if (this.accept) {
          this.options.accept = this.accept
        }
        if (this.limit) {
          this.options.limit = this.limit
        }
        if (this.onSuccess) {
          this.options.onSuccess = this.onSuccess
        }
        if (this.title) {
          this.options.title = this.title
        }
      },
      hide () {
        this.dialogVisible = false
      },
      submit () {
        this.$refs.upload.submit()
      },
      clearFiles () {
        this.$refs.upload.clearFiles()
      }
    },
    watch: {
      data (d) {
        this.options.data = d
      },
      accept (d) {
        this.options.accept = d
      },
      limit (d) {
        this.options.limit = d
      },
      onSuccess (d) {
        this.options.onSuccess = d
      },
      title (d) {
        this.options.title = d
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    text-align: center;
  }

</style>
<style>
  .avatar-uploader .el-upload__input{
    display: none;
  }
</style>
