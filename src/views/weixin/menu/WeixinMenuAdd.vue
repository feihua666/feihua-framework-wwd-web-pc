<template>
  <div class="wrapper">

    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="公众平台" prop="which" required>
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
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import WeixinMenuInputSelect from '@/views/weixin/menu/WeixinMenuInputSelect.vue'
  import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect'

  export default {
    components: {WeixinMenuInputSelect, SelfDictSelect, WeixinAccountSelect},
    name: 'WeixinMenuAdd',
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
          parentId: '0'
        },
        // 根据不同的类型显示不同的表单
        typeLimit: {
          key: false,
          mediaId: false,
          url: false,
          appid: false,
          pagepath: false
        },
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/weixinmenu/menu', self.form)
                .then(function (response) {
                  self.$message.info('微信菜单添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('微信菜单添加失败，请稍后再试')
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
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'WeixinMenuAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
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
