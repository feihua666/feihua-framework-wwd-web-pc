<template>
    <div class="wrapper">
        <el-form ref="form" :model="form" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
          <el-form-item label="微信公众平台">
            <WeixinAccountSelect v-model="form.weixinPublicplatformAccoutId" ></WeixinAccountSelect>
          </el-form-item>
          <el-form-item label="模板id">
            <el-input v-model="form.weixinPublicplatformMsgTemplateId"></el-input>
          </el-form-item>
          <el-form-item label="模板内容">
              <el-input autosize type="textarea" v-model="form.weixinPublicplatformMsgTemplateContent"></el-input>
          </el-form-item>
          <el-form-item label="微信小程序">
            <WeixinAccountSelect v-model="form.weixinMiniprogramAccoutId" :miniprogram="true"></WeixinAccountSelect>
          </el-form-item>
          <el-form-item label="模板id">
            <el-input v-model="form.weixinMiniprogramMsgTemplateId"></el-input>
          </el-form-item>
          <el-form-item label="模板内容">
            <el-input autosize type="textarea" v-model="form.weixinMiniprogramMsgTemplateContent"></el-input>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateBtnClick" :loading="addLoading">绑定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import SelfDictSelect from '@/components/SelfDictSelect.vue'
    import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect.vue'
    export default {
      name: 'MessageTemplateThirdBind',
      components: {
        SelfDictSelect, WeixinAccountSelect},
      data () {
        return {
          // 消息模板id的id
          id: null,
          form: {
            // 微信公众平台
            weixinPublicplatformAccoutId: '',
            weixinPublicplatformMsgTemplateId: '',
            weixinPublicplatformMsgTemplateContent: '',
            // 微信小程序
            weixinMiniprogramAccoutId: '',
            weixinMiniprogramMsgTemplateId: '',
            weixinMiniprogramMsgTemplateContent: ''
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
          self.$http.get('/base/message/template/' + id + '/third')
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
          if (self.addLoading === false) {
            self.addLoading = true
            self.$http.post('/base/message/template/' + self.id + '/third', self.form)
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
              if (item.thirdType === 'weixin_publicplatform') {
                this.form.weixinPublicplatformAccoutId = item.thirdId
                this.form.weixinPublicplatformMsgTemplateId = item.thirdTemplateId
                this.form.weixinPublicplatformMsgTemplateContent = item.thirdTemplateContent
              } else if (item.thirdType === 'weixin_miniprogram') {
                this.form.weixinMiniprogramAccoutId = item.thirdId
                this.form.weixinMiniprogramMsgTemplateId = item.thirdTemplateId
                this.form.weixinMiniprogramMsgTemplateContent = item.thirdTemplateContent
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
    .wrapper{
        padding:1.5rem;
    }
</style>
