<template>

 <div class="fh-page-wrapper fh-el-collapse-item-head-bg">
   <el-collapse v-model="activeNames">
     <el-collapse-item title="头像" name="headpic">
       <img class="personal-head-pic" :src="headPic"/>
     </el-collapse-item>
     <el-collapse-item title="基本信息" name="basicinfo">
       <el-row>
         <el-col :span="5">帐号:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12">{{userinfo.account}}</el-col>
       </el-row>
       <el-row>
         <el-col :span="5">姓名:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12">{{userinfo.nickname}}</el-col>
       </el-row>
       <el-row>
         <el-col :span="5">姓别:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12"><self-dict-text type="gender" :val="userinfo.gender"></self-dict-text></el-col>
       </el-row>
       <el-row>
         <el-col :span="5">是否锁定:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12"><self-dict-text type="yes_no" :val="userinfo.locked"></self-dict-text></el-col>
       </el-row>
       <el-row>
         <el-col :span="5">手机:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12">{{userinfo.mobile}}</el-col>
       </el-row>
       <el-row>
         <el-col :span="5">所在机构:</el-col>
         <el-col :span="2"></el-col>
         <el-col :span="12">{{userinfo.dataOfficeName}}</el-col>
       </el-row>
     </el-collapse-item>
     <el-collapse-item v-if="posts && posts.length > 0" title="岗位信息" name="postinfo">
       <template  v-for="(item, index) in posts">
         <el-row>
           <el-col :span="5">{{index + 1}}</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12"></el-col>
         </el-row>
         <el-row>
           <el-col :span="5">岗位名称:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.name}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">岗位编码:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.code}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">是否禁用:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12"><SelfDictText :val="item.disabled" type="yes_no"></SelfDictText></el-col>
         </el-row>
       </template>
     </el-collapse-item>
     <el-collapse-item v-if="roles && roles.length > 0" title="角色信息" name="roleinfo">
       <template  v-for="(item, index) in roles">
         <el-row>
           <el-col :span="5">{{index + 1}}</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12"></el-col>
         </el-row>
         <el-row>
           <el-col :span="5">角色名称:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.name}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">角色编码:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.code}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">是否禁用:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12"><SelfDictText :val="item.disabled" type="yes_no"></SelfDictText></el-col>
         </el-row>
       </template>
     </el-collapse-item>
     <el-collapse-item v-if="logininfo && logininfo.length > 0" title="登录信息" name="logininfo">
       <template  v-for="(item, index) in logininfo">
         <el-row>
           <el-col :span="5">{{index + 1}}</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12"></el-col>
         </el-row>
         <el-row>
           <el-col :span="5">登录客户端:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.loginClientName}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">登录方式:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.loginType}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">登录IP:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.host}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">登录时间:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.loginTime}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">最后访问时间:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{item.lastAccessTime}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">在线状况:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{onlineDetail(item.kickout)}}</el-col>
         </el-row>
         <el-row>
           <el-col :span="5">操作:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">
             <el-button type="text" size="small" @click="kickoutOffline(item.loginClient)" :disabled="!!item.kickout">踢出下线</el-button>
           </el-col>
         </el-row>
       </template>
     </el-collapse-item>
     <el-collapse-item v-if="personalDataScope" title="个人数据权限" name="personalDataScope">
         <el-row>
           <el-col :span="5">名称:</el-col>
           <el-col :span="2"></el-col>
           <el-col :span="12">{{personalDataScope.name}}</el-col>
         </el-row>

     </el-collapse-item>
   </el-collapse>

 </div>
</template>

<script>
  import SelfDictText from '@/components/SelfDictText.vue'

  export default {
    components: {SelfDictText},
    name: 'UserDetail',
    data () {
      return {
        id: null,
        activeNames: ['basicinfo', 'postinfo', 'roleinfo', 'logininfo', 'personalDataScope'],
        userinfo: {},
        logininfo: [],
        roles: [],
        posts: [],
        personalDataScope: {}
      }
    },
    mounted () {
      this.id = this.$route.params.id
      console.log('UserDetail mounted')
      this.loadData(this.id)
    },
    computed: {
      headPic () {
        if (this.userinfo && this.userinfo.photo) {
          return this.$config.file.getDownloadUrl(this.userinfo.photo)
        } else {
          return require('@/assets/index/headPic.jpg')
        }
      }
    },
    methods: {
      onlineDetail (kickout) {
        if (kickout === 'another') {
          return '用户已在其它设备登录'
        } else if (kickout === 'kickout') {
          return '用户已被踢出下线'
        } else {
          return '正常在线'
        }
      },
      loadData (id) {
        let self = this
        self.$http.get('/base/user/' + id + '/detail')
          .then(function (res) {
            let content = res.data.data.content
            self.userinfo = content
            self.logininfo = res.data.data.loginInfo
            self.roles = res.data.data.roles
            self.posts = res.data.data.posts
            self.personalDataScope = res.data.data.personalDataScope
          })
      },
      kickoutOffline (loginClient) {
        let self = this
        this.$confirm('确定要踢出吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.post('/base/user/' + self.id + '/kickoutClient', {loginClient: loginClient})
            .then(function (response) {
              self.$message.success('踢出成功')
              // 重新加载数据
              self.searchBtnClick()
            })
        })
      }
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'UserDetailLoadData=true'
        if (vm.id !== vm.$route.params.id || vm.$utils.loadDataControl.has(dataControl)) {
          vm.id = vm.$route.params.id
          vm.loadData(vm.id)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
<style>

</style>
