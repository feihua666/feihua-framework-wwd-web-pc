<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form  ref="deployform" :model="form" :rules="formRules" size="small">
      <el-form-item prop="category" label="分类">
        <self-dict-select  v-model="form.category" type="activity_process_category"></self-dict-select>
      </el-form-item>
      <el-form-item prop="fileList" label="上传文件">
        <el-checkbox-group v-model="form.fileList"></el-checkbox-group>

        <el-upload
          ref="upload"
          class="avatar-uploader"
          :action="$config.httpBaseURL + '/activity/processDefinition/deploy'"
          :data="data"
          accept="application/zip,image/png,text/xml"
          :limit="1"
          name="file"
          :show-file-list="true"
          :file-list="form.fileList"
          list-type="text"
          :auto-upload="false"
          :on-success="handleSuccess"
          :on-change="handleChange"
          :on-error="handleError"
          :on-exceed="onExceed"
          :before-upload="beforeUpload">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect'

  export default {
    components: {SelfDictSelect},
    name: 'DeployDialog',
    props: {
      // 弹窗标题
      title: {
        default: '部署文件'
      }
    },
    data () {
      return {
        dialogVisible: false,
        disabled: false,
        submitLoading: false,
        form: {
          category: '',
          fileList: []
        },
        formRules: {
          category: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          fileList: [
            {required: true, message: '必填', trigger: 'change'}
          ]
        }
      }
    },
    mounted () {
      console.log('DeployDialog mounted')
    },
    computed: {
      data () {
        return {category: this.form.category}
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      submit () {
        let self = this
        this.$refs['deployform'].validate((valid) => {
          if (valid) {
            self.$refs.upload.submit()
          } else {
            return false
          }
        })
      },
      handleSuccess (res, file, fileList) {
        this.$message.success('部署成功')
        this.hide()
        this.clearFiles()
      },
      handleError (error, file, fileList) {
        if (error) {
          this.$message.error('部署失败，请确认文件是否正确')
        }
      },
      beforeUpload (file) {
      },
      handleChange (file, fileList) {
        this.form.fileList = fileList
      },
      onExceed () {
        this.$message.error('文件超出限制个数')
      },
      clearFiles () {
        this.$refs.upload.clearFiles()
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
