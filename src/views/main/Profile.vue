<template>
  <el-row style="white-space:nowrap">
    <el-col :class="isCollapse ? 'hidden': ''" :span="6">
      <img class="head-pic" @click="showFileUpload" :src="headPic"/>
    </el-col>
    <el-col :span="18" :class="isCollapse ? 'widthfull': ''">
      <el-row>
        <el-col :span="18" :class="isCollapse ? 'hidden': ''" style="font-size: 0.75rem;color:azure;overflow: hidden; padding: 6px;">
          <i class="glyphicon glyphicon-user"></i>&nbsp;<span class="login-username" v-if="loginUser" @click="personalDetailDialogVisible = true"> {{loginUser.nickname}}</span>
          <br>
          <el-dropdown @command="rolePostSwitch" style="width:100%">
            <div style="font-size: 0.75rem;color:azure;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"><i class="glyphicon glyphicon-lock"  v-if="loginUser && loginUser.role"></i><i class="glyphicon glyphicon-flag"  v-else-if="loginUser && loginUser.post"></i>&nbsp;<span v-if="loginUser && loginUser.role"> {{loginUser.role.name}}</span><span v-else-if="loginUser && loginUser.post"> {{loginUser.post.name}}</span></div>

            <el-dropdown-menu slot="dropdown" style="font-size: 0.75rem;">
              <template  v-if="loginUser && loginUser.role">
                <el-dropdown-item style="font-size: 0.75rem;line-height: 25px;" v-for="(role, index) in loginUser.roles" :key="index" :command="role.id">{{role.name}}</el-dropdown-item>
              </template>
              <template  v-else-if="loginUser && loginUser.post">
                <el-dropdown-item style="font-size: 0.75rem;line-height: 25px;" v-for="(post, index) in loginUser.posts" :key="index" :command="post.id">{{post.name}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="6" :class="isCollapse ? 'widthfull': ''" style="padding: 2px;text-align: center;">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="color: rgb(255, 255, 255);"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="showFileUpload">修改头像</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <br/>
          <div @click="myMessageClick" >
            <el-badge :value="messageNum" :max="99" class="item message">
              <i class="el-icon-bell" ></i>
            </el-badge>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <file-upload ref="fileupload" :on-success="uploadSuccess" :data="{path: 'userHeader'}" accept="image/gif, image/jpeg, image/png" :limit="1" title="头像上传"></file-upload>
    <UserUpdatePasswordCurrent ref="updatepasswordDialog"></UserUpdatePasswordCurrent>
    <el-dialog class="personalDetailDialog"
      title="个人信息"
      :visible.sync="personalDetailDialogVisible"
      width="30%">
      <el-container>
        <el-aside width="150px">
          <img class="personal-head-pic" :src="headPic"/>
        </el-aside>
        <el-main v-if="loginUser">
          <el-row>
            <el-col :span="10">帐号</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.account}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">姓名</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.nickname}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">姓别</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12"><self-dict-text type="gender" :val="loginUser.gender"></self-dict-text></el-col>
          </el-row>
          <el-row>
            <el-col :span="10">手机</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.mobile}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">所在机构</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.office ? loginUser.office.name : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前角色</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.role ? loginUser.role.name : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前角色编码</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.role ? loginUser.role.code : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前岗位</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.post ? loginUser.post.name : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前岗位编码</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.post ? loginUser.post.code : ''}}</el-col>
          </el-row>
          <el-row></el-row>
          <el-row></el-row>
          <el-row></el-row>

        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="personalDetailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import FileUpload from '@/components/FileUploadDialog.vue'
  import SelfDictText from '@/components/SelfDictText.vue'
  import UserUpdatePasswordCurrent from '@/views/user/UserUpdatePasswordCurrent.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {FileUpload, UserUpdatePasswordCurrent, SelfDictText},
    name: 'Profile',
    props: {
      isCollapse: {
        default: false
      },
      loadMsgNum: {
        default: false
      }
    },
    data () {
      return {
        personalDetailDialogVisible: false,
        loginUser: null
      }
    },
    mounted () {
      if (this.loadMsgNum) {
        this.getMessageNum()
        this.getMessageNumInterval()
      }
      let self = this
      this.$http.getCurrentUserinfo().then(function (content) {
        self.loginUser = content
      })
      // 切换岗位角色事件
      this.$bus.$on('rolePostSwitch', function (data) {
        self.$http.getCurrentUserinfo().then(function (content) {
          self.loginUser = content
        })
      })
    },
    methods: {
      handleCommand (cmmand) {
        let self = this
        self[cmmand].call(this)
      },
      rolePostSwitch (id) {
        let self = this
        if (this.loginUser) {
          if (this.loginUser.role) {
            if (this.loginUser.role.id === id) {
              return
            }
            self.$http.post('/base/user/role/switch', {roleId: id})
              .then(function (res) {
                self.$message.success('角色切换成功')
                self.refresh()
              }).catch(function (res) {
                self.$message.error('角色切换失败')
              })
          } else if (this.loginUser.post) {
            if (this.loginUser.post.id === id) {
              return
            }
            self.$http.post('/base/user/post/switch', {post: id})
              .then(function (res) {
                self.$message.success('岗位切换成功')
                self.refresh()
              }).catch(function (res) {
                self.$message.error('岗位切换失败')
              })
          }
        }
      },
      refresh () {
        // 切换成功发送事件以刷新相关组件
        this.$bus.$emit('rolePostSwitch')
      },
      logout () {
        let self = this
        this.$http.post('/logout').then(response => {
          this.$store.commit('delVisitedViewsAll')
          self.$router.push('/Login')
        }).catch(() => {
          this.$store.commit('delVisitedViewsAll')
          self.$router.push('/Login')
        })
      },
      updatePassword () {
        this.$refs.updatepasswordDialog.show()
      },
      showFileUpload () {
        this.$refs.fileupload.show()
      },
      uploadSuccess (res, file, fileList) {
        let content = res.data.content
        let self = this
        self.$http.put('/base/user/photo/current', {photoUrl: content.path})
          .then(response => {
            self.$set(self.loginUser, 'photo', content.path)
            self.$message.success('头像上传成功')
            this.$refs.fileupload.hide()
          }).catch(() => {
            self.$message.error('头像上传失败，请重新尝试')
          })
        // 修改头像信息
      },
      myMessageClick () {
        this.$router.push('/Main/MyMessage')
      },
      // 5分钟拉取一次消息 300000 = 1000 * 60 * 5
      getMessageNumInterval () {
        let self = this
        setInterval(() => {
          self.getMessageNum()
        }, 300000)
      },
      getMessageNum () {
        let self = this
        self.$http.get('/base/message/currentuser/messages', {isRead: 'N', pageable: true, pageNo: 1, pageSize: 1})
          .then(function (response) {
            self.$store.commit('setMessageNum', response.data.data.page.dataNum)
          }).catch(() => {
            self.$store.commit('setMessageNum', null)
          })
      }
    },
    computed: {
      ...mapGetters([
        'messageNum'
      ]),
      headPic () {
        if (this.loginUser && this.loginUser.photo) {
          return this.$config.file.getDownloadUrl(this.loginUser.photo)
        } else {
          return require('@/assets/index/headPic.jpg')
        }
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head-pic{
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    margin-top: 3px;
  }
  .head-pic:hover{
    cursor: pointer;
  }
  .message:hover{
    cursor: pointer;
  }
  .hidden{
    display: none;
  }
  .widthfull{
    width: 100%;
    text-align: center;
  }
  .login-username:hover{
    cursor: pointer;
    color: #DAE9FF;
  }
  .personalDetailDialog .el-row{
    padding: .6em 0;
  }
  .personalDetailDialog .personal-head-pic{
    width: 100%;
  }
  .personalDetailDialog .el-row .el-col:first-child {
    font-weight: bold;
  }
</style>
