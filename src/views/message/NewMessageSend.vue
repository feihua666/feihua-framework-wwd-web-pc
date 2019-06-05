<template>

  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 700px;" label-width="150px">
      <el-form-item label="消息模板" prop="messageTemplateId">
        <MessageTemplateSelect v-model="form.messageTemplateId" type="message_level"></MessageTemplateSelect>
      </el-form-item>

      <el-form-item label="发送参数" prop="templateParams">
        <el-input autosize type="textarea"  v-model="form.templateParams"></el-input>
      </el-form-item>
      <el-form-item label="发送客户端" prop="clientIds">
        <LoginClientCheckboxGroup  v-model="form.clientIds" v-on:change="changeClient" ></LoginClientCheckboxGroup>
      </el-form-item>
      <el-form-item label="发送目标人员" prop="targetType">
        <self-dict-select v-model="form.targetType" :disabled="clientTargetDisable" type="message_targets"></self-dict-select>
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
      <!-- 虚拟客户端参数 -->
      <el-form-item v-for="(item, index) in form.vSendFormDtos" :key="index" :label="item.name + '发送目标标识'" :prop="'vSendFormDtos.' + index + '.vTargetValues'" :rules="[
      { required: true, message: '必填', trigger: 'blur' }
    ]">
        <el-input v-model="item.vTargetValues"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"	icon="el-icon-check" @click="sendBtnClick" :loading="addLoading">发送</el-button>
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
  import MessageTemplateSelect from '@/views/message/messageTemplate/MessageTemplateSelect'

  export default {
    components: {
      LoginClientCheckboxGroup,
      SelfDictCheckboxGroup,
      SelfDictSelect,
      RoleTree,
      OfficeTree,
      AreaTree,
      MessageTemplateSelect,
      UserTransfer
    },
    name: 'NewMessageSend',
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
        form: {
          messageTemplateId: null,
          targetType: 'all',
          targetValues: null,
          clientIds: null,
          templateParams: null,
          // 虚拟客户端参数
          vSendFormDtos: []
        },
        // 真正要提交的非虚拟客户端id
        clientIds: [],
        addLoading: false,
        clientSelectedItems: [],
        formRules: {
          messageTemplateId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
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
          let _form = {
            messageTemplateId: this.form.messageTemplateId,
            targetType: this.form.targetType,
            targetValues: this.form.targetValues,
            clientIds: this.clientIds,
            templateParams: this.form.templateParams,
            // 虚拟客户端参数
            vSendFormDtos: this.form.vSendFormDtos
          }
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/message/newsend/' + self.form.messageTemplateId, _form)
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
      },
      'form.messageTemplateId' (val) {
        this.loadSendParams(val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
