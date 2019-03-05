<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px"
             v-loading="formDataLoading">
      <el-form-item label="账号" prop="account" required>
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="微信号" prop="weixinId">
        <el-input v-model="form.weixinId"></el-input>
      </el-form-item>
      <el-form-item label="TOKEN" prop="token" required>
        <el-input v-model="form.token"></el-input>
      </el-form-item>
      <el-form-item label="APPID" prop="appid" required>
        <el-input v-model="form.appid"></el-input>
      </el-form-item>
      <el-form-item label="APPSECRET" prop="appsecret" required>
        <el-input v-model="form.appsecret"></el-input>
      </el-form-item>
      <el-form-item label="WHICH" prop="which" w required>
        <el-input v-model="form.which"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type"  required>
        <self-dict-select v-model="form.type" type="weixin_account_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="状态" prop="status" required>
        <self-dict-select v-model="form.status" type="weixin_account_status"/>
      </el-form-item>
      <el-form-item label="认证" prop="auth" required>
        <self-dict-select v-model="form.auth" type="weixin_account_auth"/>
      </el-form-item>
      <el-form-item label="欢迎语类型" prop="templateType"  v-if="typeLimit.templateType" required>
        <self-dict-select v-model="form.templateType" type="weixin_msg_type"/>
      </el-form-item>
      <el-form-item label="欢迎语" prop="template" v-if="typeLimit.template" required>
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.template"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType"  v-if="typeLimit.msgType" required>
        <self-dict-select v-model="form.msgType" type="mini_msg_type"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    name: 'WeixinAccountEdit',
    components: {SelfDictSelect},
    data () {
      return {
        form: {
          account: null,
          name: null,
          weixinId: null,
          token: null,
          appid: null,
          appsecret: null,
          which: null,
          type: null,
          status: null,
          auth: null,
          remark: null,
          msgType: null,
          template: null,
          templateType: null
        },
        addLoading: false,
        formDataLoading: false,
        typeLimit: {
          msgType: false,
          template: false,
          templateType: false
        },
        formRules: {
          account: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          token: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          appid: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          appsecret: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          which: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          auth: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          template: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          templateType: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/weixinaccount/account/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.type = content.type
            self.form.which = content.which
            self.form.account = content.account
            self.form.token = content.token
            self.form.appid = content.appid
            self.form.appsecret = content.appsecret
            self.form.weixinId = content.weixinId
            self.form.status = content.status
            self.form.auth = content.auth
            self.form.remark = content.remark
            self.form.msgType = content.msgType
            self.form.template = content.template
            self.form.templateType = content.templateType
            self.formDataLoading = false
            return Promise.resolve(content)
          }).catch(function (response) {
            self.formDataLoading = false
          })
      },
      updateBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.form.id = self.id
              self.$http.put('/weixinaccount/account', self.form, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('微信公众账号修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('微信信公众账号修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
        }
      })
    },
    watch: {
      'form.type' (value) {
        let self = this
        let _typeLimit = {
          msgType: false,
          template: false,
          templateType: false
        }
        switch (value) {
          case 'weixin_miniprogram':
            _typeLimit.msgType = true
            break
          case 'weixin_publicplatform':
            _typeLimit.template = true
            _typeLimit.templateType = true
            break
        }

        // 将数据清除
        for (let key in _typeLimit) {
          if (_typeLimit[key] === false) {
            self.form[key] = null
          }
        }
        self.typeLimit = _typeLimit
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    padding: 1.5rem;
    overflow: auto;
    height: 100%;
  }
</style>
