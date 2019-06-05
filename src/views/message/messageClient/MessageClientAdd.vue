<template>

  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">

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
        <el-button type="primary" icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
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
    name: 'messageClientAdd',
    data () {
      return {
        form: {
          clientId: '',
          messageType: '',
          isEnable: ''
        },
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/message/client', self.form)
                .then(function (response) {
                  self.$message.info('消息客户端添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('消息客户端添加失败，请稍后再试')
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
        let dataControl = 'messageClientAddLoadData=true'
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
