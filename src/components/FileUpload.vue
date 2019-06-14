<template>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :action="$config.file.uploadUrl + '?t=' + (new Date().getTime() + Math.random())"
      :data="dataParam"
      :accept="accept"
      :limit="limit"
      :disabled="disabled"
      name="file"
      :file-list="fileList"
      :show-file-list="showFileList"
      :list-type="listType"
      :auto-upload="autoUpload"
      :multiple="multiple"
      :on-success="handleSuccess"
      :on-change="handleChange"
      :on-error="handleError"
      :on-exceed="onExceed"
      :on-remove="handleRemove"
      :before-upload="beforeUpload">
      <template v-if="listType == 'picture-card'">
        <i slot="trigger" ref="cardTrigger" class="el-icon-plus avatar-uploader-icon"></i>
      </template>
      <template v-else>
        <el-button slot="trigger" size="small" :icon="triggerBtnIcon" :disabled="fileSelectSize >= limit" :loading="loading && !uploadBtnShow" type="primary">{{triggerBtnText}}</el-button>
        <el-button style="margin-left: 10px;" size="small" v-if="uploadBtnShow" type="success" :loading="loading" @click="submit">{{uploadBtnText}}</el-button>
      </template>
    </el-upload>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'FileUpload',
    props: {
      // 上传时附带的额外参数,可以传path和fileType两个参数，其中fileType参看字典项
      data: null,
      // 接受上传的文件类型
      accept: null,
      // 最大允许上传个数
      limit: {
        default: 1
      },
      // 是否显示已上传的文件列表
      showFileList: {
        default: true
      },
      uploadBtnShow: {
        default: true
      },
      triggerBtnText: {
        default: '选取文件'
      },
      triggerBtnIcon: {
        default: ''
      },
      uploadBtnText: {
        default: '上传到服务器'
      },
      // 已上传的文件列表{name:'',url:''}
      fileList: {
        default: function () {
          return []
        }
      },
      listType: {
        default: 'picture-card'
      },
      multiple: {
        default: false
      },
      autoUpload: {
        default: false
      },
      disabled: {
        default: false
      },
      // 上传成功回调
      onSuccess: null,
      onDelete: null,
      // 弹窗标题
      title: {
        default: '文件上传'
      }
    },
    data () {
      return {
        loading: false,
        fileSelectSize: 0
      }
    },
    mounted () {
      this.fileSelectSize = this.fileList.length
    },
    computed: {
      dataParam () {
        let p = {}
        if (this.data) {
          p = this.data
        }
        if (!p.path) {
          p.path = 'upload'
        }
        return p
      }
    },
    methods: {
      submit () {
        this.loading = true
        if (this.fileSelectSize === 0) {
          this.$message.error('请选择上传文件')
          this.loading = false
          return
        }
        this.$refs.upload.submit()
      },
      handleSuccess (res, file, fileList) {
        this.clearFiles()
        this.loading = false
        if (this.onSuccess && typeof this.onSuccess === 'function') {
          this.onSuccess(res, file, fileList)
        }
      },
      handleError (error, file, fileList) {
        if (error) {
          this.$message.error('文件上传失败，请稍候再试')
          this.clearFiles()
        }
        this.loading = false
      },
      beforeUpload (file) {
        this.loading = true
        if (this.fileSelectSize === 0) {
          this.$message.error('请选择上传文件')
          this.loading = false
          return false
        }
      },
      handleChange (file, fileList) {
        this.fileSelectSize = fileList.length
      },
      handleRemove (file, fileList) {
        this.fileSelectSize = fileList.length
        if (this.onDelete && typeof this.onDelete === 'function') {
          this.onDelete(file, fileList)
        }
      },
      onExceed () {
        this.loading = false
        this.$message.error('文件超出限制个数')
      },
      clearFiles () {
        this.$refs.upload.clearFiles()
      },
      hideOrShowTriggerParent (size, limit) {
        if (this.listType === 'picture-card') {
          let $trigger = $(this.$refs.cardTrigger)
          // 不显示
          if (this.fileSelectSize >= this.limit) {
            $trigger.parent().css('display', 'none')
          } else {
            // 不显示
            $trigger.parent().css('display', 'inline-block')
          }
        }
      }
    },
    watch: {
      fileList (list) {
        this.fileSelectSize = list.length
      },
      fileSelectSize () {
        this.hideOrShowTriggerParent()
      },
      limit () {
        this.hideOrShowTriggerParent()
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
