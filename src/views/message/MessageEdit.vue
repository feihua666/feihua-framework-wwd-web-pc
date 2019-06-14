<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="消息模板" prop="messageTemplateId">
        <MessageTemplateSelect v-model="form.messageTemplateId"  v-on:change="templateChange"></MessageTemplateSelect>
        <div>可以使用模板来快速添加消息，如果要发送三方消息，如：微信公众号模板消息则必须使用绑定三方模板的消息模板</div>

      </el-form-item>
      <el-form-item v-if="form.templateParams" label="发送参数" prop="clientIds">
        <el-input autosize type="textarea"  v-model="form.templateParams"></el-input>
        <div>如果模板中配置了参数，请填写相关参数,发送参数只会在保存时替换，不会保存副本</div>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="profile">
        <el-input  v-model="form.profile"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input autosize type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="消息分类" prop="msgType">
        <self-dict-select v-model="form.msgType" type="message_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="消息紧急性" prop="msgLevel">
        <self-dict-select v-model="form.msgLevel" type="message_level"></self-dict-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
        <div>请注意,消息相关字段不支持额外参数(只支持模板中定义过的参数)</div>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import MessageTemplateSelect from '@/views/message/messageTemplate/MessageTemplateSelect'

  export default {
    name: 'MessageEdit',
    components: {
      SelfDictSelect,
      MessageTemplateSelect
    },
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          title: null,
          profile: null,
          content: null,
          msgType: null,
          msgLevel: null,
          messageTemplateId: null,
          templateParams: null,
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          profile: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgLevel: [
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
      templateChange (templateId, templateObj) {
        let title = ''
        let profile = ''
        let content = ''
        let msgLevel = ''
        let msgType = ''
        if (templateObj) {
          title = templateObj.title
          profile = templateObj.profile
          content = templateObj.content
          msgLevel = templateObj.msgLevel
          msgType = templateObj.msgType
        }
        this.form.title = title
        this.form.profile = profile
        this.form.content = content
        this.form.msgLevel = msgLevel
        this.form.msgType = msgType
        // 加载模板参数
        this.loadSendParams(templateId)
      },
      loadSendParams (templateId) {
        let self = this
        if (!templateId) {
          self.form.templateParams = null
          return
        }

        this.$http.get('/base/message/template/' + templateId + '/params')
          .then(function (res) {
            let content = res.data.data.content
            let json = {}
            for (let i = 0; i < content.length; i++) {
              json[content[i]] = ''
            }
            self.form.templateParams = JSON.stringify(json, null, 2)
          })
      },
      loadEditData (id) {
        if (this.formDataLoading === true) {
          return
        }
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/base/message/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.title = content.title
            self.form.profile = content.profile
            self.form.content = content.content
            self.form.msgType = content.msgType
            self.form.msgLevel = content.msgLevel
            self.form.messageTemplateId = content.messageTemplateId
            self.form.updateTime = content.updateAt
            self.loadSendParams(content.messageTemplateId)
            self.formDataLoading = false
          })
          .catch(function (response) {
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
              self.$http.put('/base/message/' + self.id, self.form)
                .then(function (response) {
                  self.$message.success('消息修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('消息修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  } else if (response.response.status === 403) {
                    if (response.response.data.code === 'E403_100004') {
                      self.$message.error('消息修改失败，消息已发送不能修改')
                    }
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
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'MessageEditLoadData=true'
        if (vm.id !== vm.$route.params.id || vm.$utils.loadDataControl.has(dataControl)) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
