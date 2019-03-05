<template>
  <div>
  <role-tree ref="roletree" :show-checkbox="true"></role-tree>
    <el-button type="primary" size="small" @click="userBindRolesDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
  </div>
</template>

<script>
  import RoleTree from '@/views/role/RoleTree.vue'

  export default {
    components: {
      RoleTree},
    name: 'UserBindRoles',
    data () {
      return {
        userId: null,
        submitLoading: false
      }
    },
    mounted () {
      if (this.userId) {
        this.loadBindedRoles()
      }
    },
    methods: {
      // 加载已经绑定的角色
      loadBindedRoles () {
        let self = this
        let selectedRoleIds = []
        self.$http.get('/base/user/' + self.userId + '/roles/rel')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                selectedRoleIds.push(content[i].roleId)
              }
              self.$refs.roletree.setCheckedKeys(selectedRoleIds)
            } else {
              self.$refs.roletree.setCheckedKeys(selectedRoleIds)
            }
          }).catch(() => {
            self.$refs.roletree.setCheckedKeys(selectedRoleIds)
          })
      },
      // 提交绑定的角色
      userBindRolesDoBtnClick () {
        let self = this
        // 目前只支持选中最多一个节点
        let selectedKeys = self.$refs.roletree.getCheckedKeys()
        if (selectedKeys && selectedKeys.length > 1) {
          self.$message.error('目前只支持最多选中一个节点')
          return
        }
        self.submitLoading = true
        self.$http.post('/base/user/' + self.userId + '/roles/rel', {roleIds: self.$refs.roletree.getCheckedKeys()})
          .then(response => {
            self.$message.info('用户绑定角色成功')
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
          vm.loadBindedRoles()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
