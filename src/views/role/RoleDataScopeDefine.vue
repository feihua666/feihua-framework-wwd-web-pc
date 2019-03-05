<template>
  <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="120px" v-loading="formDataLoading">
    <el-form-item label="角色数据范围" prop="type">
      <self-dict-select v-model="form.type" type="role_dataScope" :show-none="false"></self-dict-select>
    </el-form-item>
    <el-form-item v-show="form.type === 'self'">
      <RoleTree ref="roletree" show-checkbox></RoleTree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitBtnClick" :loading="addLoading">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import RoleTree from './RoleTree.vue'
  export default {
    name: 'RoleDataScopeDefine',
    components: {
      RoleTree,
      SelfDictSelect},
    props: {
      // 数据范围id,父级传来的
      dataScopeId: {
        default: null
      }
    },
    data () {
      return {
        form: {
          type: null, // 角色数据范围的下拉选项值
          id: null,   // 角色数据范围定义的id
          updateTime: null,  // 更新时间，乐观锁用
          roleIds: []
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      // this.loadData()
    },
    methods: {
      loadData () {
        let self = this
        this.resetForm()
        let selectedRoleIds = []
        // 根据scope查询，如果没有数据则提交添加方法
        this.$http.get('/base/dataScope/' + this.dataScopeId + '/role/define')
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.type = content.type
            self.form.updateTime = content.updateAt
            // 自定义设置
            if (content && content.type === 'self') {
              let selfRoles = response.data.data.self
              for (let item in selfRoles) {
                selectedRoleIds.push(selfRoles[item].roleId)
              }
            }
            self.$refs.roletree.setCheckedKeys(selectedRoleIds)
            self.tableLoading = false
          }).catch(function (error) {
            if (error.response.status === 404) {
              self.form.id = null
              self.form.type = null
            }
          })
      },
      saveData () {
        let self = this
        this.$refs['form'].validate((valid) => {
          if (valid) {
            self.addData()
          } else {
            return false
          }
        })
      },
      addData () {
        let self = this
        self.addLoading = true
        // 设置自定义勾选
        if (self.form.type === 'self') {
          self.form.roleIds = self.$refs.roletree.getCheckedKeys()
        }
        this.$http.post('/base/dataScope/' + this.dataScopeId + '/role/define', this.form)
          .then(reponse => {
            self.$message.info('角色数据范围定义设置成功')
            self.addLoading = false
          }).catch(function (response) {
            self.$message.error('角色数据范围定义设置失败，请稍后再试')
            self.addLoading = false
          })
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.roletree.setCheckedKeys([])
      },
      submitBtnClick () {
        this.saveData()
      }
    },
    watch: {
      dataScopeId () {
        this.loadData()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
