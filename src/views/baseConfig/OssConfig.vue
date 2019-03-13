<template>
  <div class="wrapper">
    <el-form ref="form" :rules="ossRules" :model="form" label-width="150px">
      <el-form-item label="OSS类型" prop="type" label-width="150px">
        <el-radio-group v-model="form.type" size="small">
          <el-radio-button label="ALY">阿里云</el-radio-button>
          <el-radio-button label="QNY">七牛云</el-radio-button>
          <el-radio-button label="TXY">腾讯云</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用配置" prop="open">
        <el-switch v-model="form.open"
                   active-value="Y"
                   inactive-value="N">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否启用压缩" prop="compress">
        <el-switch v-model="form.compress"
                   active-value="Y"
                   inactive-value="N">
        </el-switch>
      </el-form-item>
      <div v-if="form.type==='ALY'">
        <el-form-item label="阿里云域名" prop="aliyunDomain">
          <el-input v-model="form.aliyunDomain" autocomplete="off"
                    placeholder="阿里云绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="阿里云路径前缀" prop="aliyunPrefix">
          <el-input v-model="form.aliyunPrefix" autocomplete="off"
                    placeholder="默认为空"></el-input>
        </el-form-item>
        <el-form-item label="阿里云EndPoint" prop="aliyunEndPoint">
          <el-input v-model="form.aliyunEndPoint" autocomplete="off"
                    placeholder="阿里云EndPoint"></el-input>
        </el-form-item>
        <el-form-item label="阿里云AccessKeyId" prop="aliyunAccessKeyId">
          <el-input v-model="form.aliyunAccessKeyId" autocomplete="off"
                    placeholder="阿里云AccessKeyId"></el-input>
        </el-form-item>
        <el-form-item label="阿里云AccessKeySecret" prop="aliyunAccessKeySecret">
          <el-input v-model="form.aliyunAccessKeySecret" autocomplete="off"
                    placeholder="阿里云AccessKeySecret"></el-input>
        </el-form-item>
        <el-form-item label="阿里云BucketName" prop="aliyunBucketName">
          <el-input v-model="form.aliyunBucketName" autocomplete="off"
                    placeholder="阿里云BucketName"></el-input>
        </el-form-item>
      </div>
      <div v-if="form.type==='QNY'">
        <el-form-item label="七牛域名" prop="qiniuDomain">
          <el-input v-model="form.qiniuDomain" autocomplete="off"
                    placeholder="七牛绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="七牛路径前缀" prop="qiniuPrefix">
          <el-input v-model="form.qiniuPrefix" autocomplete="off" placeholder="默认为空"></el-input>
        </el-form-item>
        <el-form-item label="七牛AccessKey" prop="qiniuAccessKey">
          <el-input v-model="form.qiniuAccessKey" autocomplete="off"
                    placeholder="七牛AccessKey"></el-input>
        </el-form-item>
        <el-form-item label="七牛SecretKey" prop="qiniuSecretKey">
          <el-input v-model="form.qiniuSecretKey" autocomplete="off"
                    placeholder="七牛SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="七牛BucketName" prop="qiniuBucketName">
          <el-input v-model="form.qiniuBucketName" autocomplete="off"
                    placeholder="七牛BucketName"></el-input>
        </el-form-item>
      </div>
      <div v-if="form.type==='TXY'">
        <el-form-item label="腾讯云域名" prop="qcloudDomain">
          <el-input v-model="form.qcloudDomain" autocomplete="off"
                    placeholder="腾讯云绑定的域名"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云路径前缀" prop="qcloudPrefix">
          <el-input v-model="form.qcloudPrefix" autocomplete="off"
                    placeholder="默认为空"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云AppId" prop="qcloudAppId">
          <el-input v-model="form.qcloudAppId" autocomplete="off"
                    placeholder="腾讯云AppId"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云SecretId" prop="qcloudSecretId">
          <el-input v-model="form.qcloudSecretId" autocomplete="off"
                    placeholder="腾讯云SecretId"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云SecretKey" prop="qcloudSecretKey">
          <el-input v-model="form.qcloudSecretKey" autocomplete="off"
                    placeholder="腾讯云SecretKey"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云BucketName" prop="qcloudBucketName">
          <el-input v-model="form.qcloudBucketName" autocomplete="off"
                    placeholder="腾讯云BucketName"></el-input>
        </el-form-item>
        <el-form-item label="腾讯云Bucket所属地区" prop="qcloudRegion">
          <el-input v-model="form.qcloudRegion" autocomplete="off"
                    placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'OssConfig',
    data () {
      return {
        addLoading: false,
        form: {
          type: 'ALY',
          open: 'Y',
          compress: 'N',
          aliyunDomain: null,
          aliyunPrefix: null,
          aliyunEndPoint: null,
          aliyunAccessKeyId: null,
          aliyunAccessKeySecret: null,
          aliyunBucketName: null,

          qiniuDomain: null,
          qiniuPrefix: null,
          qiniuAccessKey: null,
          qiniuSecretKey: null,
          qiniuBucketName: null,

          qcloudDomain: null,
          qcloudPrefix: null,
          qcloudAppId: null,
          qcloudSecretId: null,
          qcloudSecretKey: null,
          qcloudBucketName: null,
          qcloudRegion: null
        },
        ossRules: {
          aliyunDomain: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          aliyunPrefix: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          aliyunEndPoint: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          aliyunAccessKeyId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          aliyunAccessKeySecret: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          aliyunBucketName: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qiniuDomain: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qiniuPrefix: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qiniuAccessKey: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qiniuSecretKey: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qiniuBucketName: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudDomain: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudPrefix: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudAppId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudSecretId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudSecretKey: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudBucketName: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          qcloudRegion: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.loadOssConfig()
    },
    methods: {
      loadOssConfig () {
        var self = this
        self.resetForm()
        self.$http.get('/base/config/ossConfig/OSS_CLOUD_STORAGE_CONFIG_KEY')
          .then(function (response) {
            let content = response.data.data.content
            self.form = content
            return Promise.resolve(content)
          }).catch(function (response) {
          })
      },
      updateBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/base/config/saveOssConfig/' + self.id, self.form, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('配置保存成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('配置保存失败，数据不存在或已被他人修改，请刷新列表后再试')
                  self.addLoading = false
                })
            } else {
              return false
            }
          })
        } else {
          self.$message.info('正在请求中，请耐心等待')
        }
      },
      resetForm () {
        this.$refs['form'].resetFields()
      }
    },
    computed: {
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main {
    overflow: auto;
  }
.wrapper{
  padding:1.5rem;
}
</style>
