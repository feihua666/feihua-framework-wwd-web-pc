<template>
  <div class="fh-page-wrapper">
    <div class="fh-background-white" style="width: 500px;">
    <data-scope-tree ref="datascopetree" :show-checkbox="true"></data-scope-tree>
    <el-button type="primary" size="small" @click="userBindDataScopesDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
    </div>
  </div>
</template>

<script>
  import DataScopeTree from '../dataScope/DataScopeTree'

  export default {
    components: {DataScopeTree},
    name: 'UserBindDataScope',
    data () {
      return {
        userId: null, // 路由中的参数
        submitLoading: false
      }
    },
    mounted () {
      if (this.userId) {
        this.loadBindedDataScope()
      }
    },
    methods: {
      // 加载已绑定的数据范围
      loadBindedDataScope () {
        let self = this
        let selectedDataScopeIds = []
        self.$http.get('/base/user/' + self.userId + '/dataScopes/rel')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              selectedDataScopeIds.push(content.dataScopeId)
            }
            self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
          }).catch(() => {
            self.$refs.datascopetree.setCheckedKeys([])
          })
      },
      // 提交
      userBindDataScopesDoBtnClick () {
        let self = this
        // 目前只支持选中最多一个节点
        let selectedKeys = self.$refs.datascopetree.getCheckedKeys()
        if (selectedKeys && selectedKeys.length > 1) {
          self.$message.error('目前只支持最多选中一个节点')
          return
        }
        self.submitLoading = true
        self.$http.post('/base/user/' + self.userId + '/dataScopes/rel', {dataScopeIds: self.$refs.datascopetree.getCheckedKeys()})
          .then(response => {
            self.$message.success('用户绑定数据范围成功')
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
        let dataControl = 'UserBindDataScopeLoadData=true'
        if (vm.userId !== vm.$route.params.userId || vm.$utils.loadDataControl.has(dataControl)) {
          vm.userId = vm.$route.params.userId
          vm.loadBindedDataScope()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
