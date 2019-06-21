<template>
  <div class="fh-page-wrapper">
    <div class="fh-background-white" style="width: 500px;">
      <userGroup-tree ref="userGrouptree" :check-strictly="true" :show-checkbox="true"></userGroup-tree>
      <el-button type="primary" size="small" @click="userBindUserGroupsDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
    </div>
  </div>
</template>

<script>
  import UserGroupTree from '@/views/group/UserGroupTree.vue'

  export default {
    components: {
      UserGroupTree},
    name: 'UserBindUserGroups',
    data () {
      return {
        userId: null,
        submitLoading: false
      }
    },
    mounted () {
      if (this.userId) {
        this.loadBindedUserGroups()
      }
    },
    methods: {
      // 加载已经绑定的用户组
      loadBindedUserGroups () {
        let self = this
        let selectedUserGroupIds = []
        self.$http.get('/base/user/' + self.userId + '/userGroups/rel')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                selectedUserGroupIds.push(content[i].userGroupId)
              }
              self.$refs.userGrouptree.setCheckedKeys(selectedUserGroupIds)
            } else {
              self.$refs.userGrouptree.setCheckedKeys(selectedUserGroupIds)
            }
          }).catch(() => {
            self.$refs.userGrouptree.setCheckedKeys(selectedUserGroupIds)
          })
      },
      // 提交绑定的用户组
      userBindUserGroupsDoBtnClick () {
        let self = this
        self.submitLoading = true
        self.$http.post('/base/user/' + self.userId + '/userGroups/rel', {userGroupIds: self.$refs.userGrouptree.getCheckedKeys()})
          .then(response => {
            self.$message.success('用户绑定用户组成功')
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
        let dataControl = 'UserBindUserGroupsLoadData=true'
        if (vm.userId !== vm.$route.params.userId || vm.$utils.loadDataControl.has(dataControl)) {
          vm.userId = vm.$route.params.userId
          vm.loadBindedUserGroups()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
