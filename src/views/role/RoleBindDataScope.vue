<template>
  <div class="fh-page-wrapper">
    <div class="fh-background-white fh-padding-30" style="width: 500px;">
    <data-scope-tree ref="datascopetree" :show-checkbox="true"></data-scope-tree>
    <el-button type="primary" size="small" @click="roleBindDataScopesDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
    </div>
  </div>
</template>

<script>
  import DataScopeTree from '../dataScope/DataScopeTree'

  export default {
    components: {DataScopeTree},
    name: 'RoleBindDataScope',
    data () {
      return {
        roleId: null, // 路由中的参数
        submitLoading: false
      }
    },
    mounted () {
      if (this.roleId) {
        this.loadBindedDataScope()
      }
    },
    methods: {
      // 加载已绑定的数据范围
      loadBindedDataScope () {
        let self = this
        let selectedDataScopeIds = []
        self.$http.get('/base/role/' + self.roleId + '/dataScopes/rel')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              selectedDataScopeIds.push(content.dataScopeId)
            }
            self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
          }).catch(() => {
            self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
          })
      },
      // 提交
      roleBindDataScopesDoBtnClick () {
        let self = this
// 目前只支持选中最多一个节点
        let selectedKeys = self.$refs.datascopetree.getCheckedKeys()
        if (selectedKeys && selectedKeys.length > 1) {
          self.$message.error('目前只支持最多选中一个节点')
          return
        }
        self.submitLoading = true
        self.$http.post('/base/role/' + self.roleId + '/dataScopes/rel', {dataScopeIds: self.$refs.datascopetree.getCheckedKeys()})
          .then(response => {
            self.$message.success('角色绑定数据范围成功')
            self.submitLoading = false
          }).catch(() => {
            self.submitLoading = false
          })
      }
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'RoleBindDataScopeLoadData=true'
        if (vm.roleId !== vm.$route.params.roleId || vm.$utils.loadDataControl.has(dataControl)) {
          vm.roleId = vm.$route.params.roleId
          vm.loadBindedDataScope()
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
