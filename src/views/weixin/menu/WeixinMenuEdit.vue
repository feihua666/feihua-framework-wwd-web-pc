<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="标识" prop="which" required>
        <weixin-account-select v-model="form.which"></weixin-account-select>
      </el-form-item>
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="weixin_menu_type"></self-dict-select>
      </el-form-item>
      <el-form-item v-if="typeLimit.key" label="key" prop="key">
        <el-input  v-model="form.key"></el-input>
      </el-form-item>
      <el-form-item v-if="typeLimit.url" label="url" prop="url">
        <el-input  v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item v-if="typeLimit.mediaId" label="media_id" prop="mediaId">
        <el-input  v-model="form.mediaId"></el-input>
      </el-form-item>
      <el-form-item v-if="typeLimit.appid" label="appid" prop="appid">
        <el-input  v-model="form.appid"></el-input>
      </el-form-item>
      <el-form-item v-if="typeLimit.pagepath" label="pagepath" prop="pagepath">
        <el-input  v-model="form.pagepath"></el-input>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <WeixinMenuInputSelect ref="weixinmenuinput" :which="form.which"  v-model="form.parentId">
        </WeixinMenuInputSelect>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sequence">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import WeixinMenuInputSelect from '@/views/weixin/menu/WeixinMenuInputSelect.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect'

  export default {
    name: 'WeixinMenuEdit',
    components: {WeixinMenuInputSelect, SelfDictSelect, WeixinAccountSelect},
    data () {
      let validateKey = (rule, value, callback) => {
        if ((value === '' || value == null) && this.typeLimit.key) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      let validateUrl = (rule, value, callback) => {
        if ((value === '' || value == null) && this.typeLimit.url) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      let validateMediaId = (rule, value, callback) => {
        if ((value === '' || value == null) && this.typeLimit.mediaId) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      let validateAppid = (rule, value, callback) => {
        if ((value === '' || value == null) && this.typeLimit.appid) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      let validatePagepath = (rule, value, callback) => {
        if ((value === '' || value == null) && this.typeLimit.pagepath) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      return {
        // 编辑的id
        id: null,
        form: {
          name: null,
          type: null,
          sequence: null,
          key: null,
          url: null,
          mediaId: null,
          appid: null,
          pagepath: null,
          which: null,
          parentId: '0',
          updateTime: null
        },
        // 根据不同的类型显示不同的表单
        typeLimit: {
          key: false,
          mediaId: false,
          url: false,
          appid: false,
          pagepath: false
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          which: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          key: [
            {validator: validateKey, trigger: 'blur'}
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
          ],
          mediaId: [
            {validator: validateMediaId, trigger: 'blur'}
          ],
          appid: [
            {validator: validateAppid, trigger: 'blur'}
          ],
          pagepath: [
            {validator: validatePagepath, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/weixinmenu/menu/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.type = content.type
            self.form.which = content.which
            self.form.sequence = content.sequence || 1
            self.form.parentId = content.parentId
            self.form.key = content.key
            self.form.url = content.url
            self.form.mediaId = content.mediaId
            self.form.appid = content.appid
            self.form.pagepath = content.pagepath
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content.parentId)
          }).then(parentId => {
            // 回显父级
            self.$refs.weixinmenuinput.initLabelName(parentId)
          }).catch(function (response) {
            self.formDataLoading = false
          })
      },
      updateBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/weixinmenu/menu/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('微信菜单修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('微信菜单修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  }
                  self.addLoading = false
                })
            } else {
              return false
            }
          })
        } else {
          self.$message.info('正在请求中，请耐心等待')
        }
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.weixinmenuinput.setLabelName(null)
      }
    },
    watch: {
      'form.type' (value) {
        let self = this
        let _typeLimit = {
          key: false,
          mediaId: false,
          url: false,
          appid: false,
          pagepath: false
        }
        switch (value) {
          case 'click':
          case 'scancode_waitmsg':
          case 'scancode_push':
          case 'pic_sysphoto':
          case 'pic_photo_or_album':
          case 'pic_weixin':
          case 'location_select':
            _typeLimit.key = true
            break
          case 'view':
            _typeLimit.url = true
            break
          case 'miniprogram':
            _typeLimit.appid = true
            _typeLimit.pagepath = true
            _typeLimit.url = true
            break
          case 'media_id':
          case 'view_limited':
            _typeLimit.mediaId = true
            break
        }

        // 将数据清除
        for (let key in _typeLimit) {
          if (_typeLimit[key] === false) {
            self.form[key] = null
          }
        }
        self.typeLimit = _typeLimit
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
        let which = vm.$route.query.which
        if (which && vm.form.which !== which) {
          vm.form.which = which
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper{
    padding:1.5rem;
    overflow: auto;
    height: 100%;
  }
</style>
