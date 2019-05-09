<template>
    <div class="wrapper">
        <el-form ref="form" :model="form" style="width: 660px;" label-width="200px" v-loading="formDataLoading">
          <template v-for="(item, index) in form.weixinPublicPlatforms">
            <el-form-item :label="'微信公众号' + index">
              <WeixinAccountSelect v-model="item.weixinPublicplatformAccoutId" ></WeixinAccountSelect>
              <el-button @click="removeWeixinPublicplatform(item, index)">删除</el-button>
            </el-form-item>
            <el-form-item :label="'微信公众号模板id' + index">
              <el-input v-model="item.weixinPublicplatformMsgTemplateId"></el-input>
            </el-form-item>
            <el-form-item :label="'微信公众号模板内容' + index">
              <el-input autosize type="textarea" v-model="item.weixinPublicplatformMsgTemplateContent"></el-input>
            </el-form-item>
          </template>
          <template v-for="(item, index) in form.weixinMiniPrograms">
            <el-form-item :label="'微信小程序' + index">
              <WeixinAccountSelect v-model="item.weixinMiniprogramAccoutId" :miniprogram="true"></WeixinAccountSelect>
              <el-button @click="removeWeixinMiniprogram(item, index)">删除</el-button>
            </el-form-item>
            <el-form-item :label="'微信小程序模板id' + index">
              <el-input v-model="item.weixinMiniprogramMsgTemplateId"></el-input>
            </el-form-item>
            <el-form-item :label="'微信小程序模板内容' + index">
              <el-input autosize type="textarea" v-model="item.weixinMiniprogramMsgTemplateContent"></el-input>
            </el-form-item>
          </template>

            <el-form-item>
              <el-button type="primary" @click="updateBtnClick" :loading="addLoading">绑定</el-button>
              <el-button @click="addWeixinPublicplatform">新增微信公众号</el-button>
              <el-button @click="addWeixinMiniprogram">新增微信小程序</el-button>
              <div>如果不选择三方模板，视为删除先前绑定的三方模板，只填写模板内容无效，请谨慎操作</div>
              <div>特：同一种类型请不要重复添加，否则可能会消息重复或其它不可预知错误</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import SelfDictSelect from '@/components/SelfDictSelect.vue'
    import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect.vue'
    let weixinPublicPlatformItem = function (accountId, templateId, content) {
      return {
        weixinPublicplatformAccoutId: accountId || '',
        weixinPublicplatformMsgTemplateId: templateId || '',
        weixinPublicplatformMsgTemplateContent: content || ''
      }
    }
    let weixinMiniProgramItem = function (accountId, templateId, content) {
      return {
        weixinMiniprogramAccoutId: accountId || '',
        weixinMiniprogramMsgTemplateId: templateId || '',
        weixinMiniprogramMsgTemplateContent: content || ''
      }
    }
    export default {
      name: 'MessageTemplateThirdBind',
      components: {
        SelfDictSelect,
        WeixinAccountSelect
      },
      data () {
        return {
          // 消息模板id的id
          id: null,
          form: {
            // 微信公众平台
            weixinPublicPlatforms: [],
            // 微信小程序
            weixinMiniPrograms: []
          },
          formDataLoading: false,
          addLoading: false
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
              self.bindData(content)
              self.formDataLoading = false
            })
            .catch(function (response) {
              // 清空
              self.bindData()
              self.formDataLoading = false
            })
        },
        bindData (val) {
          if (val) {
            for (let i = 0; i < val.length; i++) {
              let item = val[i]
              if (item.thirdType === 'weixin_publicplatform') {
                this.form.weixinPublicPlatforms.push(weixinPublicPlatformItem(item.thirdId, item.thirdTemplateId, item.thirdTemplateContent))
              } else if (item.thirdType === 'weixin_miniprogram') {
                this.form.weixinMiniPrograms.push(weixinMiniProgramItem(item.thirdId, item.thirdTemplateId, item.thirdTemplateContent))
              }
            }
          } else {
            this.form.weixinPublicPlatforms = []
            this.form.weixinMiniPrograms = []
          }
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
        },
        addWeixinPublicplatform () {
          this.form.weixinPublicPlatforms.push(weixinPublicPlatformItem())
        },
        removeWeixinPublicplatform (item, index) {
          this.form.weixinPublicPlatforms.splice(index, 1)
        },
        addWeixinMiniprogram () {
          this.form.weixinMiniPrograms.push(weixinMiniProgramItem())
        },
        removeWeixinMiniprogram (item, index) {
          this.form.weixinMiniPrograms.splice(index, 1)
        }
      },
      watch: {
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
