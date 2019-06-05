<template>
  <div class="fh-page-wrapper">
        <el-form ref="form" :model="form" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
          <el-form-item label="微信公众平台">
            <WeixinAccountSelect v-model="form.weixinPublicplatformAccoutId" ></WeixinAccountSelect>
          </el-form-item>
          <el-form-item label="微信小程序">
            <WeixinAccountSelect v-model="form.weixinMiniprogramAccoutId" :miniprogram="true"></WeixinAccountSelect>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">绑定</el-button>
              <div>渠道只能绑定一个，渠道的意思是该客户端是通过什么三方访问的，比如是微信公众号里用微信授权登录</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import SelfDictSelect from '@/components/SelfDictSelect.vue'
    import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect.vue'
    export default {
      name: 'LoginClientChannelBind',
      components: {
        SelfDictSelect, WeixinAccountSelect},
      data () {
        return {
          // 编辑的id
          id: null,
          form: {
            // 微信公众平台
            weixinPublicplatformAccoutId: '',
            // 微信小程序
            weixinMiniprogramAccoutId: ''
          },
          formDataLoading: false,
          addLoading: false,
          bindData: []
        }
      },
      mounted () {
        this.id = this.$route.params.id
        this.loadEditData(this.id)
      },
      methods: {
        loadEditData (id) {
          let self = this
          self.formDataLoading = true
          self.$http.get('/base/client/loginclient/' + id + '/channel')
            .then(function (response) {
              let content = response.data.data.content
              self.bindData = content
              self.formDataLoading = false
            })
            .catch(function (response) {
              self.formDataLoading = false
            })
        },
        updateBtnClick () {
          let self = this
          if (this.form.weixinPublicplatformAccoutId && this.form.weixinMiniprogramAccoutId) {
            self.$message.error('只能绑定一个，或不绑定')
            return
          }
          if (self.addLoading === false) {
            self.addLoading = true
            self.$http.post('/base/client/loginclient/' + self.id + '/channel', self.form)
              .then(function (response) {
                self.$message.success('绑定成功')
                self.addLoading = false
              })
              .catch(function (response) {
                self.addLoading = false
              })
          } else {
            self.$message.info('正在请求中，请耐心等待')
          }
        }
      },
      watch: {
        bindData (val) {
          if (val) {
            for (let i = 0; i < val.length; i++) {
              let item = val[i]
              if (item.channelType === 'weixin_publicplatform') {
                this.form.weixinPublicplatformAccoutId = item.channelId
              } else if (item.channelType === 'weixin_miniprogram') {
                this.form.weixinMiniprogramAccoutId = item.channelId
              }
            }
          }
        }
      },
      // tab切换如果参数不一样，重新加载数据
      beforeRouteEnter  (to, from, next) {
        next(vm => {
          // 通过 `vm` 访问组件实例
          if (vm.id !== vm.$route.params.id) {
            vm.id = vm.$route.params.id
            vm.loadEditData(vm.id)
          }
        })
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
