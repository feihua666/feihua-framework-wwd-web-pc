<template>
  <div>
    <data-scope-tree ref="datascopetree" :show-checkbox="true"></data-scope-tree>
    <el-button type="primary" size="small" @click="userBindDataScopesDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
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
              for (let i = 0; i < content.length; i++) {
                selectedDataScopeIds.push(content[i].dataScopeId)
              }
              self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
            } else {
              self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
            }
          }).catch(() => {
            self.$refs.datascopetree.setCheckedKeys(selectedDataScopeIds)
          })
      },
      // 提交
      userBindDataScopesDoBtnClick () {
        let self = this
        self.submitLoading = true
        self.$http.post('/base/user/' + self.userId + '/dataScopes/rel', {dataScopeIds: self.$refs.datascopetree.getCheckedKeys()})
          .then(response => {
            self.$message.info('用户绑定数据范围成功')
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
        if (vm.userId !== vm.$route.params.userId) {
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
