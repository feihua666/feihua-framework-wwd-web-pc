<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="标题" prop="title" required>
        <el-input  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="profile" required>
        <el-input  v-model="form.profile"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content" required>
        <el-input autosize type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="消息分类" prop="msgType">
        <self-dict-select v-model="form.msgType" type="message_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="消息紧急性" prop="msgLevel">
        <self-dict-select v-model="form.msgLevel" type="message_level"></self-dict-select>
      </el-form-item>
      <el-form-item label="消息模板" prop="messageTemplateId">
        <MessageTemplateSelect v-model="form.messageTemplateId" type="message_level"></MessageTemplateSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
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
          messageTemplateId: null
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
.wrapper{
  padding:1.5rem;
}
</style>
