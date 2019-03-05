<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 510px;" label-width="150px">
      <el-form-item label="发送目标人员" prop="targets">
        <self-dict-select v-model="form.targets" type="message_targets"></self-dict-select>
      </el-form-item>
      <el-form-item label="发送客户端" prop="targetClients">
        <self-dict-checkbox-group  v-model="form.targetClients" type="login_client"></self-dict-checkbox-group>
      </el-form-item>
      <el-form-item v-if="showPublicPlatform" label="公众平台" prop="publicPlatform">
        <weixin-account-checkbox-group v-model="form.publicPlatform"></weixin-account-checkbox-group>
      </el-form-item>
      <el-form-item v-if="showMiniProgram" label="小程序" prop="miniprogram">
        <weixin-account-checkbox-group  v-model="form.miniprogram" :miniprogram="true"></weixin-account-checkbox-group>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendBtnClick" :loading="addLoading">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import SelfDictCheckboxGroup from '@/components/SelfDictCheckboxGroup'
  import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect'
  import WeixinAccountCheckboxGroup from '@/views/weixin/account/WeixinAccountCheckboxGroup'

  export default {
    components: {
      WeixinAccountCheckboxGroup,
      SelfDictCheckboxGroup,
      SelfDictSelect,
      WeixinAccountSelect
    },
    name: 'MessageSend',
    data () {
      let validatePublicPlatform = (rule, value, callback) => {
        if ((value === '' || value === null || value.length === 0) && this.showPublicPlatform) {
          callback(new Error('请选择公众号'))
        } else {
          callback()
        }
      }
      let validateMiniprogram = (rule, value, callback) => {
        if ((value === '' || value === null || value.length === 0) && this.showMiniProgram) {
          callback(new Error('请选择小程序'))
        } else {
          callback()
        }
      }
      return {
        // 发送的消息id
        id: null,
        form: {
          targets: null,
          targetClients: null,
          publicPlatform: null,
          miniprogram: null
        },
        addLoading: false,
        formRules: {
          targets: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          targetClients: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          publicPlatform: [
            {validator: validatePublicPlatform, trigger: 'blur'}
          ],
          miniprogram: [
            {validator: validateMiniprogram, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.params.id
    },
    methods: {
      sendBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              let _form = {}
              _form.targets = self.form.targets
              _form.targetClients = [
              ]
              for (let i = 0; i < self.form.targetClients.length; i++) {
                let client = self.form.targetClients[i]
                if (client === 'wx_platform') {
                  for (let n = 0; n < self.form.publicPlatform.length; n++) {
                    _form.targetClients.push({targetClient: client, subTargetClient: self.form.publicPlatform[n]})
                  }
                } else if (client === 'wx_miniprogram') {
                  for (let n = 0; n < self.form.miniprogram.length; n++) {
                    _form.targetClients.push({targetClient: client, subTargetClient: self.form.miniprogram[n]})
                  }
                } else {
                  _form.targetClients.push({targetClient: client})
                }
              }
              self.$http.post('/base/message/' + self.id + '/send', _form)
                .then(function (response) {
                  self.$message.info('消息发送成功')
                  self.addLoading = false
                })
                .catch(function (error) {
                  if (error.response.status === 403) {
                    self.$message.error('消息发送失败，消息已发送或正在发送中，请刷新数据再试')
                  } else {
                    self.$message.error('消息发送失败，请稍后再试')
                  }
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
      showPublicPlatform () {
        if (this.form.targetClients && this.form.targetClients.length > 0) {
          for (let i = 0; i < this.form.targetClients.length; i++) {
            if (this.form.targetClients[i] === 'wx_platform') {
              return true
            }
          }
        }
        return false
      },
      showMiniProgram () {
        if (this.form.targetClients && this.form.targetClients.length > 0) {
          for (let i = 0; i < this.form.targetClients.length; i++) {
            if (this.form.targetClients[i] === 'wx_miniprogram') {
              return true
            }
          }
        }
        return false
      }
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
.wrapper{
  padding:1.5rem;
}
</style>
