<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width="25%">

    <el-form :model="form" status-icon :rules="formRules" ref="form"  size="mini" v-loading="formDataLoading">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="form.checkPassword" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'UserUpdatePasswordCurrent',
    data () {
      let validateCheckPassword = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error())
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        formDataLoading: false,
        form: {
          oldPassword: null,
          password: null,
          checkPassword: null
        },
        formRules: {
          oldPassword: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          checkPassword: [
            {required: true, message: '必填', trigger: 'blur'},
            {validator: validateCheckPassword, message: '两次输入密码不一致!', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      show () {
        this.dialogVisible = true
        this.resetForm()
      },
      hide () {
        this.dialogVisible = false
      },
      resetForm () {
        this.$refs['form'].resetFields()
      },
      submit () {
        let self = this
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 请求添加
            self.formDataLoading = true
            self.$http.put('/base/user/password/current', self.form)
              .then(function (response) {
                self.$message.info('密码修改成功')
                self.formDataLoading = false
                self.hide()
              })
              .catch(function (response) {
                if (response && response.response.status === 400) {
                  self.$message.error('原密码不正确')
                } else {
                  self.$message.error('密码修改失败，请稍后再试')
                }
                self.formDataLoading = false
              })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
