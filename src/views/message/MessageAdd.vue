<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
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
        <el-button type="primary"	icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
        <div>请注意,消息相关字段不支持额外参数(只支持模板中定义过的参数)</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import MessageTemplateSelect from '@/views/message/messageTemplate/MessageTemplateSelect'
  export default {
    components: {
      SelfDictSelect,
      MessageTemplateSelect
    },
    name: 'MessageAdd',
    data () {
      return {
        form: {
          title: null,
          profile: null,
          content: null,
          msgType: null,
          msgLevel: null,
          messageTemplateId: null,
          templateParams: null
        },
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
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/message', self.form)
                .then(function (response) {
                  self.$message.success('消息添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('消息添加失败，请稍后再试')
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
        let dataControl = 'MessageAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
