<template>
  <div class="login-bg">
    <div class="login-form-wrapper">
      <form class="form-horizontal login-form">
        <input type="hidden" v-model="form.loginType"/>
        <div class="form-group">
          <span class="login-label">登录：</span><span class="login-tip">{{msg}}</span>
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
            <input type="text" name="principal" class="form-control form-inline" v-model="form.principal" placeholder="帐号">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
            <input type="password" name="password" class="form-control form-inline" v-model="form.password" placeholder="密码">
          </div>
        </div>
        <div class="form-group" v-if="showCaptcha && captchaUrl">
          <div class="input-group">
            <input type="text" name="captcha" class="form-control form-inline" v-model="form.captcha" placeholder="验证码">
            <span class="input-group-addon" style="padding:0;">
            <img :src="captchaUrl" width="100" @click="changeCaptcha" height="30"/>
            </span>
          </div>
        </div>
        <div class="form-group" v-if="false">
          <div class="checkbox">
            <label>
              <input type="checkbox" name="rememberMe" v-model="form.rememberMe">记住我
            </label>
          </div>
        </div>
        <div class="form-group">
          <el-button @click.prevent="doLogin" type="primary" class="btn-block" :loading="loading">登录</el-button>
        </div>
        <div class="form-group">
          <a href="/admin/module/login/forgetPassword.html">忘记密码了？</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Schema from 'async-validator'
  export default {
    name: 'Login',
    data () {
      return {
        msg: null,
        loading: false,
        form: {
          loginType: 'ACCOUNT',
          loginClient: 'pc',
          principal: null,
          password: null,
          captcha: null,
          rememberMe: false
        },
        validateRules: {
          principal: [{required: true, message: '帐号不能为空'}],
          password: [{required: true, message: '密码不能为空'}]
        },
        showCaptcha: false,
        captchaUrl: null,
        tryLoginNum: 0
      }
    },
    mounted () {
      this.changeCaptcha()
    },
    methods: {
      doLogin () {
        let self = this
        if (self.loading === true) {
          return
        }

        self.loading = true
        let validator = new Schema(this.validateRules)
        validator.validate(this.form, {first: true}, (errors, fields) => {
          if (errors) {
            self.msg = errors[0].message
            self.loading = false
            return null
          } else {
            if (self.showCaptcha && (self.form.captcha === null || self.form.captcha === '')) {
              self.msg = '验证码不能为空'
              self.loading = false
              return
            }
            self.msg = null
            // 进行登录
            self.$http.post('/login', self.form)
              .then(function (response) {
                // 设置token
                self.$store.commit('setToken', response.data.token)
                // 跳转到主页面
                self.$router.push({name: 'Main'})
                self.loading = false
              })
              .catch(function (response) {
                if (response.response.status === 401) {
                  self.msg = '用户名或密码错误'
                  self.tryLoginNum ++
                  if (self.tryLoginNum >= 2) {
                    self.showCaptcha = true
                  }
                } else if (response.response.status === 400) {
                  self.msg = '验证码不正确'
                  self.showCaptcha = true
                } else {
                  self.msg = '抱歉系统好像出问题了'
                }
                self.changeCaptcha()
                self.loading = false
              })
          }
        })
      },
      // 加载新的验证码
      changeCaptcha () {
        // baseurl 也可以这么取 this.$config.httpBaseURL
        this.captchaUrl = this.$http.getBaseUrl() + '/captcha?t=' + new Date().getTime()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-bg {
    background: url("../../assets/login/bg.jpg") no-repeat;
    background-size: cover;
    height:100%;
    position: relative;
  }
  .login-form-wrapper {
    width: 20rem;
    padding: 2rem 2rem 0 2rem;
    background: rgba(255, 255, 255, 0.2) none repeat scroll 0 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    box-shadow: 0 3px 0 rgba(12, 12, 12, 0.03);
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .login-label {
    color: rgba(255, 255, 255, 0.95);
  }
  .login-tip{
    color: #a94442;
  }
</style>
