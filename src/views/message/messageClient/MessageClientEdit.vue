<template>

  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="客户端" prop="clientId">
        <LoginClientSelect  v-model="form.clientId"></LoginClientSelect>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <SelfDictSelect  v-model="form.messageType" type="message_client_type"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <SelfDictSelect  v-model="form.isEnable" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import LoginClientSelect from '@/views/loginclient/LoginClientSelect.vue'

  export default {
    components: {
      SelfDictSelect,
      LoginClientSelect
    },
    name: 'messageClientEdit',
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          clientId: '',
          messageType: '',
          isEnable: '',
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          clientId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          messageType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          isEnable: [
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
        self.$http.get('/base/message/client/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.clientId = content.clientId
            self.form.messageType = content.messageType
            self.form.isEnable = content.isEnable
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content)
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
              self.$http.put('/base/message/client/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('消息客户端修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('消息客户端改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
