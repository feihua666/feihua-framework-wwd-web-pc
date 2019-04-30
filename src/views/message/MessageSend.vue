<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 700px;" label-width="150px">
      <el-form-item label="发送目标人员" prop="targetType">
        <self-dict-select v-model="form.targetType" type="message_targets"></self-dict-select>
      </el-form-item>
      <el-form-item label="人员" prop="targetValues"  v-if="form.targetType == 'multi_people'">
        <UserTransfer v-model="targetValuesPeople"></UserTransfer>
      </el-form-item>
      <el-form-item label="角色" prop="targetValues" v-if="form.targetType == 'multi_role'">
        <RoleTree ref="roletree" :check-strictly="true" :show-checkbox="true"></RoleTree>
      </el-form-item>
      <el-form-item label="机构" prop="targetValues" v-if="form.targetType == 'multi_office'">
        <OfficeTree ref="officetree" :check-strictly="true" :show-checkbox="true"></OfficeTree>
      </el-form-item>
      <el-form-item ref="areatree" prop="targetValues" label="区域" v-if="form.targetType == 'multi_area'">
        <AreaTree :check-strictly="true" :show-checkbox="true"></AreaTree>
      </el-form-item>
      <el-form-item label="发送客户端" prop="clientIds">
        <LoginClientCheckboxGroup  v-model="form.clientIds"></LoginClientCheckboxGroup>
      </el-form-item>
      <el-form-item label="发送参数" prop="clientIds">
        <el-input autosize type="textarea"  v-model="form.templateParams"></el-input>
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
  import LoginClientCheckboxGroup from '@/views/loginclient/LoginClientCheckboxGroup'
  import UserTransfer from '@/views/user/UserTransfer'
  import RoleTree from '@/views/role/RoleTree'
  import OfficeTree from '@/views/office/OfficeTree'
  import AreaTree from '@/views/area/AreaTree'

  export default {
    components: {
      LoginClientCheckboxGroup,
      SelfDictCheckboxGroup,
      SelfDictSelect,
      RoleTree,
      OfficeTree,
      AreaTree,
      UserTransfer
    },
    name: 'MessageSend',
    data () {
      let targetValuesValidator = (rule, value, callback) => {
        if (this.form.targetType === 'all') {
          callback()
        } else {
          if (value == null || value.length === 0) {
            callback(new Error('必填'))
          } else {
            callback()
          }
        }
      }
      return {
        targetValuesPeople: [],
        // 发送的消息id
        id: null,
        templateId: null,
        form: {
          targetType: 'all',
          targetValues: null,
          clientIds: null,
          templateParams: null
        },
        addLoading: false,
        formRules: {
          targetType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          targetValues: [
            {validator: targetValuesValidator, trigger: 'blur'}
          ],
          clientIds: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.templateId = this.$route.query.templateId
      this.loadSendParams(this.templateId)
    },
    methods: {
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
      sendBtnClick () {
        let self = this
        if (self.addLoading === false) {
          if (this.form.targetType === 'multi_people') {
            this.form.targetValues = this.targetValuesPeople
          } else if (this.form.targetType === 'multi_office') {
            this.form.targetValues = this.$refs.officetree.getCheckedKeys()
          } else if (this.form.targetType === 'multi_role') {
            this.form.targetValues = this.$refs.roletree.getCheckedKeys()
          } else if (this.form.targetType === 'multi_area') {
            this.form.targetValues = this.$refs.areatree.getCheckedKeys()
          } else {
            this.form.targetValues = null
          }
          console.log(this.form.targetValues)
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/message/' + self.id + '/send', self.form)
                .then(function (response) {
                  self.$message.success('消息发送成功')
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
        this.form.targetValues = null
      }
    },
    computed: {
    },
    watch: {
      'form.targetType' () {
        this.form.targetValues = null
      },
      'templateId' (val) {
        this.loadSendParams(val)
      }
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.templateId = vm.$route.query.templateId
          vm.loadSendParams(vm.templateId)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{
  padding:1.5rem;
  height: 100%;
  overflow-y: auto;
}
</style>
