<template>
  <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="120px" v-loading="formDataLoading">
    <el-form-item label="功能数据范围" prop="type">
      <self-dict-select v-model="form.type" type="functionResource_dataScope" :show-none="false"></self-dict-select>
    </el-form-item>
    <el-form-item v-show="form.type === 'self'">
      <fun-resource-tree ref="funresourcetree" :check-strictly="checkStrictly" show-checkbox></fun-resource-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitBtnClick" :loading="addLoading">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import FunResourceTree from './FunResourceTree.vue'
  export default {
    name: 'FunResourceDataScopeDefine',
    components: {
      FunResourceTree,
      SelfDictSelect},
    data () {
      return {
        form: {
          type: null, // 功能资源数据范围的下拉选项值
          id: null,   // 功能资源数据范围定义的id
          updateTime: null,  // 更新时间，乐观锁用
          functionResourceIds: []
        },
        roleId: null,  // 角色id,父级传来的
        formDataLoading: false,
        addLoading: false,
        checkStrictly: true,
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
        let selectedFunctionResourceIds = []
        // 根据scope查询，如果没有数据则提交添加方法
        this.$http.get('/base/role/' + this.roleId + '/functionResource/define')
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.type = content.type
            self.form.updateTime = content.updateAt
            // 自定义设置
            if (content && content.type === 'self') {
              let selfFunctionResources = response.data.data.self
              for (let item in selfFunctionResources) {
                selectedFunctionResourceIds.push(selfFunctionResources[item].functionResourceId)
              }
            }
            self.$refs.funresourcetree.setCheckedKeys(selectedFunctionResourceIds)
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
          self.form.functionResourceIds = self.$refs.funresourcetree.getAllCheckedKeys()
        }
        this.$http.post('/base/role/' + this.roleId + '/functionResource/define', this.form)
          .then(reponse => {
            self.$message.info('功能数据范围定义设置成功')
            self.addLoading = false
          }).catch(function (response) {
            self.$message.error('功能数据范围定义设置失败，请稍后再试')
            self.addLoading = false
          })
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.funresourcetree.setCheckedKeys([])
      },
      submitBtnClick () {
        this.saveData()
      }
    },
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.roleId !== vm.$route.params.roleId) {
          vm.roleId = vm.$route.params.roleId
          vm.loadData()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
