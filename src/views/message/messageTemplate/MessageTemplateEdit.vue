<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="模板名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
        <el-input  v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input :placeholder="'可指定参数,如：您好，{{userName}}先生，您此次摇号已中签'" autosize type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="消息标题" prop="title">
        <el-input :placeholder="'可指定参数,如：尊敬的{{userName}}'"  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="消息简介" prop="profile">
        <el-input :placeholder="'可指定参数,如：这是一条{{userName}}的简介'"  v-model="form.profile"></el-input>
      </el-form-item>
      <el-form-item label="消息分类" prop="msgType">
        <self-dict-select v-model="form.msgType" type="message_type"></self-dict-select>
        只对非虚拟客户端有效，如果绑定了三方模板，且三方支持则三方也有效
      </el-form-item>
      <el-form-item label="消息紧急性" prop="msgLevel">
        <self-dict-select v-model="form.msgLevel" type="message_level"></self-dict-select>
        只对非虚拟客户端有效，如果绑定了三方模板，且三方支持则三方也有效
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'MessageTemplateEdit',
    components: {
      SelfDictSelect
    },
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          name: null,
          code: null,
          content: null,
          title: null,
          profile: null,
          msgType: null,
          msgLevel: null,
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgLevel: [
            {required: true, message: '必填', trigger: 'blur'}
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
        if (this.formDataLoading === true) {
          return
        }
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/base/message/template/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.code = content.code
            self.form.content = content.content
            self.form.title = content.title
            self.form.profile = content.profile
            self.form.msgType = content.msgType
            self.form.msgLevel = content.msgLevel
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
          })
          .catch(function (response) {
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
              self.$http.put('/base/message/template/' + self.id, self.form)
                .then(function (response) {
                  self.$message.success('消息模板修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('消息模板修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
      }
    },
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'MessageTemplateEditLoadData=true'
        if (vm.id !== vm.$route.params.id || vm.$utils.loadDataControl.has(dataControl)) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
