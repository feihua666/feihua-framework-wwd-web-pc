<template>
  <div class="fh-page-wrapper">
    <div class="fh-background-white" style="width: 500px;">
      <PostTree ref="posttree" :check-strictly="true" :show-checkbox="true"></PostTree>
      <el-button type="primary" size="small" @click="userBindPostsDoBtnClick" :loading="submitLoading" style="margin: 2rem 5rem;">提交</el-button>
    </div>
  </div>
</template>

<script>
  import PostTree from '@/views/postjob/PostTree.vue'

  export default {
    components: {
      PostTree
    },
    name: 'UserBindPosts',
    data () {
      return {
        userId: null,
        submitLoading: false
      }
    },
    mounted () {
      if (this.userId) {
        this.loadBindedPosts()
      }
    },
    methods: {
      // 加载已经绑定的岗位
      loadBindedPosts () {
        let self = this
        let selectedPostIds = []
        self.$http.get('/base/user/' + self.userId + '/posts/rel')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                selectedPostIds.push(content[i].postId)
              }
              self.$refs.posttree.setCheckedKeys(selectedPostIds)
            } else {
              self.$refs.posttree.setCheckedKeys(selectedPostIds)
            }
          }).catch(() => {
            self.$refs.posttree.setCheckedKeys(selectedPostIds)
          })
      },
      // 提交绑定的岗位
      userBindPostsDoBtnClick () {
        let self = this
        self.submitLoading = true
        self.$http.post('/base/user/' + self.userId + '/posts/rel', {postIds: self.$refs.posttree.getCheckedKeys()})
          .then(response => {
            self.$message.success('用户绑定岗位成功')
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
        let dataControl = 'UserBindPostsLoadData=true'
        if (vm.userId !== vm.$route.params.userId || vm.$utils.loadDataControl.has(dataControl)) {
          vm.userId = vm.$route.params.userId
          vm.loadBindedPosts()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
