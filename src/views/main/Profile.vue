<template>
  <el-row>
    <el-col :class="isCollapse ? 'hidden': ''" :span="8">
      <img class="head-pic" @click="showFileUpload" :src="headPic"/>
    </el-col>
    <el-col :span="16" :class="isCollapse ? 'widthfull': ''">
      <el-row>
        <el-col :span="18" :class="isCollapse ? 'hidden': ''" style="font-size: 0.75rem;color:azure;overflow: hidden; padding: 6px;">
          <i class="glyphicon glyphicon-user"></i>&nbsp;<span class="login-username" v-if="loginUser" @click="personalDetailDialogVisible = true"> {{loginUser.nickname}}</span>
          <br>
          <i class="glyphicon glyphicon-lock"></i>&nbsp;<span v-if="loginUser"> {{loginUser.additionalAttr.role.name}}</span>
        </el-col>
        <el-col :span="6" :class="isCollapse ? 'widthfull': ''" style="padding: 2px;text-align: center;">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="color: rgb(255, 255, 255);"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
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
            <el-col :span="12">{{getDictLabel('gender',loginUser.gender)}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">手机</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.mobile}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">所在机构</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.additionalAttr.office ? loginUser.additionalAttr.office.name : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前角色</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.additionalAttr.role ? loginUser.additionalAttr.role.name : ''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="10">当前角色编码</el-col>
            <el-col :span="2"></el-col>
            <el-col :span="12">{{loginUser.additionalAttr.role ? loginUser.additionalAttr.role.code : ''}}</el-col>
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
  import { mapGetters } from 'vuex'
  import FileUpload from '@/components/FileUpload.vue'
  import UserUpdatePasswordCurrent from '@/views/user/UserUpdatePasswordCurrent.vue'
  import { getDictByValueSync } from '@/utils/dictUtils.js'
  export default {
    components: {FileUpload, UserUpdatePasswordCurrent},
    name: 'Profile',
    props: {
      isCollapse: {
        default: false
      }
    },
    data () {
      return {
        messageNum: null,
        personalDetailDialogVisible: false
      }
    },
    mounted () {
      this.getMessageNum()
      this.getMessageNumInterval()
    },
    methods: {
      handleCommand (cmmand) {
        let self = this
        self[cmmand].call(this)
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
            self.$store.commit('setLoginUserPhoto', content.path)
            self.$message.success('头像上传成功')
            this.$refs.fileupload.hide()
          }).catch(() => {
            self.$message.error('头像上传失败，请重新尝试')
          })
        // 修改头像信息
      },
      getDictLabel (type, value) {
        let dict = getDictByValueSync(this, type, value)
        return dict ? dict.name : null
      },
      myMessageClick () {
        this.$router.push('/Main/MyMessage')
      },
      getMessageNumInterval () {
        let self = this
        setInterval(() => {
          self.getMessageNum()
        }, 60000)
      },
      getMessageNum () {
        let self = this
        self.$http.get('/base/message/currentuser/messages', {isRead: 'N', pageable: true, pageNo: 1, pageSize: 1})
          .then(function (response) {
            self.messageNum = response.data.data.page.dataNum
          }).catch(() => {
            self.messageNum = null
          })
      }
    },
    computed: {
      ...mapGetters([
        'loginUser'
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
      // 防止刷新的时候没有数据
      loginUser () {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head-pic{
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 10%;
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
