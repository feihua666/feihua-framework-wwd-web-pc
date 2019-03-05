<template>
  <div class="wrapper">

    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
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
      <el-form-item label="WHICH" prop="which" required>
        <el-input v-model="form.which"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type" required>
        <self-dict-select v-model="form.type" type="weixin_account_type"/>
      </el-form-item>
      <el-form-item label="状态" prop="status" required>
        <self-dict-select v-model="form.status" type="weixin_account_status"/>
      </el-form-item>
      <el-form-item label="认证" prop="auth" required>
        <self-dict-select v-model="form.auth" type="weixin_account_auth"/>
      </el-form-item>
      <el-form-item label="欢迎语类型" prop="templateType" v-if="typeLimit.templateType" required>
        <self-dict-select v-model="form.templateType" type="weixin_msg_type"/>
      </el-form-item>
      <el-form-item label="欢迎语" prop="template" v-if="typeLimit.template" required>
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.template"></el-input>
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType" v-if="typeLimit.msgType" required>
        <self-dict-select v-model="form.msgType" type="mini_msg_type"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    components: {SelfDictSelect},
    name: 'WeixinAccountAdd',
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/weixinaccount/account', self.form, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('微信公众账号添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('微信公众账号添加失败，请稍后再试')
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
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'WeixinAccountAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
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
