<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 700px;" label-width="150px">
      <el-form-item label="发送客户端" prop="clientIds">
        <LoginClientCheckboxGroup v-on:change="changeClient"  v-model="form.clientIds"></LoginClientCheckboxGroup>
      </el-form-item>

      <el-form-item label="发送目标人员" prop="targetType">
        <self-dict-select v-model="form.targetType" :disabled="clientTargetDisable" type="message_targets"></self-dict-select>
        <div>该目标人员只对非虚拟客户端有效</div>
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
      <el-form-item  prop="targetValues" label="区域" v-if="form.targetType == 'multi_area'">
        <AreaTree ref="areatree" :check-strictly="true" :show-checkbox="true"></AreaTree>
      </el-form-item>

      <!-- 虚拟客户端参数 -->
      <el-form-item v-for="(item, index) in form.vSendFormDtos" :key="index" :label="item.name + '发送目标标识'" :prop="'vSendFormDtos.' + index + '.vTargetValues'" :rules="[
      { required: true, message: '必填', trigger: 'blur' }
    ]">
        <el-input v-model="item.vTargetValues"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="sendBtnClick" :loading="addLoading">发送</el-button>
        <div>虚拟客户端发送目标标识解释：如果是邮件客户端请输入邮件地址，如果是短信请输入手机号，如果是第三方模板请输入消息请输入三方用户标识（如微信输入openid）.以上多个以逗号分隔</div>
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
      let targetTypeValidator = (rule, value, callback) => {
        if (this.clientTargetDisable) {
          callback()
        } else {
          if (!this.form.targetType) {
            callback(new Error('必填'))
          } else {
            callback()
          }
        }
      }
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
          // 虚拟客户端参数
          vSendFormDtos: []
        },
        // 真正要提交的非虚拟客户端id
        clientIds: [],
        addLoading: false,
        clientSelectedItems: [],
        formRules: {
          targetType: [
            {validator: targetTypeValidator, trigger: 'blur'}
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
    },
    methods: {
      changeClient (val, items) {
        this.clientSelectedItems = items
        let temp = []
        let clientIds = []
        if (this.clientSelectedItems) {
          for (let i = 0; i < this.clientSelectedItems.length; i++) {
            if (this.clientSelectedItems[i].isVirtual === 'Y') {
              temp.push({
                clientId: this.clientSelectedItems[i].id,
                vTargetType: '',
                name: this.clientSelectedItems[i].name,
                vTargetValues: ''
              })
            }
            if (this.clientSelectedItems[i].isVirtual === 'N') {
              clientIds.push(this.clientSelectedItems[i].id)
            }
          }
        }
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.form.vSendFormDtos.length; j++) {
            if (temp[i].clientId === this.form.vSendFormDtos[j].clientId) {
              temp[i] = this.form.vSendFormDtos[j]
            }
          }
        }
        this.$set(this.form, 'vSendFormDtos', temp)
        this.clientIds = clientIds
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
          let _form = {
            targetType: this.form.targetType,
            targetValues: this.form.targetValues,
            clientIds: this.clientIds,
            // 虚拟客户端参数
            vSendFormDtos: this.form.vSendFormDtos
          }
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/message/' + self.id + '/send', _form)
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
        this.$set(this.form, 'vSendFormDtos', [])
      }
    },
    computed: {
      clientTargetDisable () {
        if (this.clientSelectedItems) {
          for (let i = 0; i < this.clientSelectedItems.length; i++) {
            if (this.clientSelectedItems[i].isVirtual === 'N') {
              return false
            }
          }
        }
        this.form.targetType = null
        this.form.targetValues = null
        return true
      }
    },
    watch: {
      'form.targetType' () {
        this.form.targetValues = null
      }
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.templateId = vm.$route.query.templateId
          vm.resetForm()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
